
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/types/task';

interface TaskState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TaskState = {
  tasks: [],
  filter: 'all',
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    toggleCompleted: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    }
  },
});

export const { addTask, updateTask, deleteTask, toggleCompleted, setFilter } = taskSlice.actions;
export default taskSlice.reducer;
