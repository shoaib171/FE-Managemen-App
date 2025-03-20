
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}
