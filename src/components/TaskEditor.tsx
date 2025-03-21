
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TaskEditorProps {
  taskToEdit?: Task;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function TaskEditor({ taskToEdit, onSave, onCancel }: TaskEditorProps) {
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    taskToEdit?.startDate ? new Date(taskToEdit.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    taskToEdit?.endDate ? new Date(taskToEdit.endDate) : undefined
  );
  const [completed, setCompleted] = useState(taskToEdit?.completed || false);
  const [assignedUser, setAssignedUser] = useState<string | undefined>(undefined);
  
  const { token } = useAuth();
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (!token) return [];
      const response = await axios.get('http://localhost:5000/api/tasks/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: !!token
  });
  
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStartDate(taskToEdit.startDate ? new Date(taskToEdit.startDate) : undefined);
      setEndDate(taskToEdit.endDate ? new Date(taskToEdit.endDate) : undefined);
      setCompleted(taskToEdit.completed);
      // Set assigned user if exists in the task
      if (taskToEdit.assignedTo) {
        setAssignedUser(taskToEdit.assignedTo);
      }
    }
  }, [taskToEdit]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    onSave({
      title,
      description,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      completed,
      assignedTo: assignedUser
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          autoFocus
          className="transition-all duration-200"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          className="min-h-[100px] transition-all duration-200"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assignee">Assign To</Label>
        <Select value={assignedUser} onValueChange={setAssignedUser}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a user">
              {assignedUser ? (
                <div className="flex items-center">
                  {users.find((user: User) => user._id === assignedUser)?.name || 'Select a user'}
                </div>
              ) : (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Select a user</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="p-2 text-center">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-2 text-center">No users available</div>
            ) : (
              users.map((user: User) => (
                <SelectItem key={user._id} value={user._id} className="flex items-center p-2">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Start Date</Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : <span>Choose start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {startDate && (
            <Button
              type="button"
              variant="outline"
              className="text-red-500"
              onClick={() => setStartDate(undefined)}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>End Date</Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : <span>Choose end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {endDate && (
            <Button
              type="button"
              variant="outline"
              className="text-red-500"
              onClick={() => setEndDate(undefined)}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {taskToEdit && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!completed ? 'default' : 'outline'}
              className="w-full"
              onClick={() => setCompleted(false)}
            >
              Active
            </Button>
            <Button
              type="button"
              variant={completed ? 'default' : 'outline'}
              className="w-full"
              onClick={() => setCompleted(true)}
            >
              Completed
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {taskToEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
