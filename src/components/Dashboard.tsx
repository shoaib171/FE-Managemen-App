
import { useState } from 'react';
import { TaskList } from './TaskList';
import { TaskModal } from './TaskModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

export function Dashboard() {
  const { filter } = useTasks();
  const [isCreating, setIsCreating] = useState(false);
  
  const getFilterTitle = () => {
    switch (filter) {
      case 'all': return 'All Tasks';
      case 'active': return 'Active Tasks';
      case 'completed': return 'Completed Tasks';
      default: return 'Tasks';
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight animate-enter-from-left">
          {getFilterTitle()}
        </h1>
        
        <Button
          onClick={() => setIsCreating(true)}
          className="gap-1 animate-enter-from-right"
        >
          <Plus className="h-5 w-5" />
          <span>New Task</span>
        </Button>
      </div>
      
      <TaskList />
      
      <TaskModal
        open={isCreating}
        onOpenChange={setIsCreating}
      />
    </div>
  );
}
