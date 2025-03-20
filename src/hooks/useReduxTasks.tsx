
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { 
  addTask, 
  updateTask, 
  deleteTask, 
  toggleCompleted, 
  setFilter 
} from '@/store/taskSlice';
import { Task } from '@/types/task';

export const useReduxTasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const filter = useSelector((state: RootState) => state.tasks.filter);
  
  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    const now = new Date();
    
    // Auto-complete tasks if end date has passed
    if (task.endDate && new Date(task.endDate) < now && !task.completed) {
      dispatch(toggleCompleted(task.id));
      return filter === 'completed';
    }
    
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  return {
    tasks,
    filteredTasks,
    filter,
    addNewTask: (task: Task) => dispatch(addTask(task)),
    updateExistingTask: (task: Task) => dispatch(updateTask(task)),
    removeTask: (id: string) => dispatch(deleteTask(id)),
    toggleTaskCompleted: (id: string) => dispatch(toggleCompleted(id)),
    changeFilter: (newFilter: 'all' | 'active' | 'completed') => dispatch(setFilter(newFilter)),
  };
};
