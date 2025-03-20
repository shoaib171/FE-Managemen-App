
import { Task } from '@/types/task';
import { useReduxTasks } from '@/hooks/useReduxTasks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskEditor } from './TaskEditor';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: Task;
}

export function TaskModal({ open, onOpenChange, taskToEdit }: TaskModalProps) {
  const { addNewTask, updateExistingTask } = useReduxTasks();
  
  const handleSave = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (taskToEdit) {
      updateExistingTask({
        ...taskToEdit,
        ...taskData,
      });
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      addNewTask(newTask);
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        <TaskEditor
          taskToEdit={taskToEdit}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
