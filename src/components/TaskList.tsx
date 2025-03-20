
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

export function TaskList() {
  const { filteredTasks, filter } = useTasks();
  
  if (filteredTasks.length === 0) {
    return <EmptyState filter={filter} />;
  }
  
  return (
    <div className="space-y-1 animate-fade-in">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
