
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addTask, updateTask, removeTask as removeTaskAction, toggleTask, setFilter } from '@/store/taskSlice';
import { Task } from '@/types/task';

export const useReduxTasks = () => {
  const dispatch = useDispatch();
  const { tasks, filter } = useSelector((state: RootState) => state.tasks);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const addNewTask = (task: Task) => {
    return dispatch(addTask(task));
  };

  const updateExistingTask = (task: Task) => {
    return dispatch(updateTask(task));
  };

  const removeTask = (id: string) => {
    return dispatch(removeTaskAction(id));
  };

  const toggleTaskCompleted = (id: string) => {
    return dispatch(toggleTask(id));
  };

  const updateTaskStatus = (id: string, status: 'active' | 'in_progress' | 'completed') => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const updatedTask = { ...task, status };
      // If status is completed, also mark the task as completed
      if (status === 'completed') {
        updatedTask.completed = true;
      }
      return dispatch(updateTask(updatedTask));
    }
  };

  const changeFilter = (newFilter: 'all' | 'active' | 'completed') => {
    return dispatch(setFilter(newFilter));
  };

  return {
    tasks,
    filteredTasks,
    filter,
    addNewTask,
    updateExistingTask,
    removeTask,
    toggleTaskCompleted,
    updateTaskStatus,
    changeFilter
  };
};
