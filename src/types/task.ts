
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  assignedTo?: string;
  assignedUser?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status?: 'active' | 'in_progress' | 'completed';
}
