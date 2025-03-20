
import React, { createContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export type TaskStatus = 'active' | 'completed';
export type TaskFilter = 'all' | TaskStatus;

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  dueDate?: Date;
}

interface TaskContextType {
  tasks: Task[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  filteredTasks: Task[];
}

export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  filter: 'all',
  setFilter: () => {},
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  toggleTaskStatus: () => {},
  filteredTasks: [],
});

const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the Q3 project proposal for the management team',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    dueDate: new Date(Date.now() + 172800000), // 2 days from now
  },
  {
    id: '2',
    title: 'Weekly team meeting',
    description: 'Discuss progress on current sprint tasks',
    status: 'active',
    createdAt: new Date(Date.now() - 43200000), // 12 hours ago
    dueDate: new Date(Date.now() + 43200000), // 12 hours from now
  },
  {
    id: '3',
    title: 'Review code pull requests',
    description: 'Check and approve pending pull requests from the dev team',
    status: 'completed',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks 
      ? JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        })) 
      : SAMPLE_TASKS;
  });
  
  const [filter, setFilter] = useState<TaskFilter>('all');
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully');
  };
  
  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...taskData } : task
    ));
    toast.success('Task updated successfully');
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  };
  
  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'active' ? 'completed' : 'active' } 
        : task
    ));
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });
  
  return (
    <TaskContext.Provider 
      value={{
        tasks,
        filter,
        setFilter,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        filteredTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
