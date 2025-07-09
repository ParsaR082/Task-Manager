export type TaskStatus = 'backlog' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  deadline: string;
  priority: TaskPriority;
  createdAt: Date;
  assignee?: string;
  tags?: string[];
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
} 