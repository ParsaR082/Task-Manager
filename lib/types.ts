export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO date string
  tags?: string[];
  assignee?: string;
  projectId?: string; // Reference to the project this task belongs to
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  tasksCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string; // ISO date string
  relatedTaskId?: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string; // ISO date string
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  tags?: string[];
  assignee?: string[];
  dueDate?: {
    from?: string; // ISO date string
    to?: string; // ISO date string
  };
  search?: string;
} 