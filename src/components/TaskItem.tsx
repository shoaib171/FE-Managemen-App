
import { useState } from 'react';
import { format } from 'date-fns';
import { Check, Clock, Calendar, Edit, Trash } from 'lucide-react';
import { Task } from '@/contexts/TaskContext';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TaskModal } from './TaskModal';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTaskStatus, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  
  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskStatus(task.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  
  return (
    <>
      <Card 
        className={cn(
          "mb-3 overflow-hidden transition-all duration-300 hover:shadow-md",
          "border-l-4",
          task.status === 'completed' 
            ? "border-l-green-500 bg-green-50 dark:bg-green-950/20" 
            : task.dueDate && task.dueDate < new Date() 
              ? "border-l-red-500 bg-red-50 dark:bg-red-950/20"
              : "border-l-blue-500 bg-white dark:bg-gray-950"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-full mt-0.5 transition-all",
                  task.status === 'completed' ? "text-green-500" : "text-gray-400"
                )}
                onClick={handleToggleStatus}
              >
                <Check className={cn(
                  "h-5 w-5 transition-all",
                  task.status === 'completed' ? "opacity-100" : "opacity-30" 
                )} />
              </Button>
              
              <div className="space-y-1">
                <h3 className={cn(
                  "text-base font-medium transition-all",
                  task.status === 'completed' && "line-through text-gray-500"
                )}>
                  {task.title}
                </h3>
                
                <p className={cn(
                  "text-sm text-gray-500 dark:text-gray-400",
                  task.status === 'completed' && "line-through text-gray-400"
                )}>
                  {task.description}
                </p>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{format(task.createdAt, 'MMM d, yyyy')}</span>
                  </div>
                  
                  {task.dueDate && (
                    <div className={cn(
                      "flex items-center text-xs",
                      task.status === 'completed' 
                        ? "text-gray-500" 
                        : task.dueDate < new Date() 
                          ? "text-red-500" 
                          : "text-blue-500"
                    )}>
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{format(task.dueDate, 'MMM d, h:mm a')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500" onClick={handleDelete}>
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isEditing && (
        <TaskModal
          open={isEditing}
          onOpenChange={setIsEditing}
          taskToEdit={task}
        />
      )}
    </>
  );
}
