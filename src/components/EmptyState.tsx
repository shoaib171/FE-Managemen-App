
import { ClipboardList, CheckCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  filter: 'all' | 'active' | 'completed';
}

export function EmptyState({ filter }: EmptyStateProps) {
  const messages = {
    all: {
      title: 'No tasks yet',
      description: 'Create your first task to get started',
      icon: ClipboardList,
    },
    active: {
      title: 'No active tasks',
      description: 'All caught up! Your active tasks will appear here',
      icon: CheckCircle2,
    },
    completed: {
      title: 'No completed tasks',
      description: 'Tasks you complete will appear here',
      icon: CheckCircle,
    },
  };
  
  const { title, description, icon: Icon } = messages[filter];
  
  return (
    <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
      <div className={cn(
        "rounded-full p-3 mb-4",
        filter === 'all' ? "bg-blue-100 text-blue-500 dark:bg-blue-950/30" :
        filter === 'active' ? "bg-amber-100 text-amber-500 dark:bg-amber-950/30" :
        "bg-green-100 text-green-500 dark:bg-green-950/30"
      )}>
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-medium text-center">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mt-1">{description}</p>
    </div>
  );
}
