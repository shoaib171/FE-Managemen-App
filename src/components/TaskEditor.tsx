
import { useState, useEffect } from 'react';
import { Task } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskEditorProps {
  taskToEdit?: Task;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function TaskEditor({ taskToEdit, onSave, onCancel }: TaskEditorProps) {
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(taskToEdit?.dueDate);
  const [status, setStatus] = useState<'active' | 'completed'>(
    taskToEdit?.status || 'active'
  );
  
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate);
      setStatus(taskToEdit.status);
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
      dueDate,
      status,
    });
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
        <Label>Due Date & Time</Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'PPP') : <span>Choose a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {dueDate && (
            <Button
              type="button"
              variant="outline"
              className="text-red-500"
              onClick={() => setDueDate(undefined)}
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
              variant={status === 'active' ? 'default' : 'outline'}
              className="w-full"
              onClick={() => setStatus('active')}
            >
              Active
            </Button>
            <Button
              type="button"
              variant={status === 'completed' ? 'default' : 'outline'}
              className="w-full"
              onClick={() => setStatus('completed')}
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
