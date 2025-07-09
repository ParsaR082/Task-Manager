import { Task, TaskStatus } from './types';

export const hardcodedTasks: Task[] = [
  {
    id: '1',
    title: 'Implement authentication',
    description: 'Add user login and registration functionality',
    status: TaskStatus.TODO,
    priority: 'high',
    dueDate: '2024-03-20',
    tags: ['auth', 'security']
  },
  {
    id: '2',
    title: 'Design dashboard layout',
    description: 'Create responsive layout for the main dashboard',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: '2024-03-15',
    tags: ['ui', 'design']
  },
  {
    id: '3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: TaskStatus.DONE,
    priority: 'high',
    dueDate: '2024-03-10',
    tags: ['devops']
  },
  {
    id: '4',
    title: 'Write API documentation',
    description: 'Document all API endpoints and usage',
    status: TaskStatus.TODO,
    priority: 'low',
    dueDate: '2024-03-25',
    tags: ['docs']
  },
  {
    id: '5',
    title: 'Implement real-time notifications',
    description: 'Add WebSocket support for live updates',
    status: TaskStatus.IN_PROGRESS,
    priority: 'high',
    dueDate: '2024-03-18',
    tags: ['feature', 'websocket']
  },
  {
    id: '6',
    title: 'Optimize database queries',
    description: 'Improve performance of slow queries',
    status: TaskStatus.TODO,
    priority: 'high',
    dueDate: '2024-03-12',
    tags: ['performance', 'database']
  },
  {
    id: '7',
    title: 'Add data visualization charts',
    description: 'Create interactive charts for analytics',
    status: TaskStatus.DONE,
    priority: 'medium',
    dueDate: '2024-03-08',
    tags: ['ui', 'analytics']
  },
  {
    id: '8',
    title: 'Implement dark mode',
    description: 'Add system-wide dark mode support',
    status: TaskStatus.DONE,
    priority: 'low',
    dueDate: '2024-03-05',
    tags: ['ui', 'theme']
  },
  {
    id: '9',
    title: 'Setup error monitoring',
    description: 'Integrate error tracking service',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: '2024-03-22',
    tags: ['monitoring', 'devops']
  },
  {
    id: '10',
    title: 'User onboarding flow',
    description: 'Design and implement user onboarding',
    status: TaskStatus.TODO,
    priority: 'medium',
    dueDate: '2024-03-28',
    tags: ['ux', 'feature']
  },
  {
    id: '11',
    title: 'Mobile responsive design',
    description: 'Ensure all pages work on mobile devices',
    status: TaskStatus.IN_PROGRESS,
    priority: 'high',
    dueDate: '2024-03-14',
    tags: ['ui', 'mobile']
  },
  {
    id: '12',
    title: 'Add search functionality',
    description: 'Implement global search with filters',
    status: TaskStatus.TODO,
    priority: 'medium',
    dueDate: '2024-03-30',
    tags: ['feature', 'search']
  },
  {
    id: '13',
    title: 'Performance optimization',
    description: 'Optimize app loading and rendering',
    status: TaskStatus.DONE,
    priority: 'high',
    dueDate: '2024-03-07',
    tags: ['performance']
  },
  {
    id: '14',
    title: 'Add file upload support',
    description: 'Implement secure file upload system',
    status: TaskStatus.TODO,
    priority: 'low',
    dueDate: '2024-04-02',
    tags: ['feature', 'storage']
  },
  {
    id: '15',
    title: 'Email notification system',
    description: 'Setup automated email notifications',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: '2024-03-19',
    tags: ['feature', 'email']
  }
];

export function getTaskStats() {
  const now = new Date();
  
  const stats = {
    total: hardcodedTasks.length,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0
  };

  hardcodedTasks.forEach(task => {
    // Count by status
    switch (task.status) {
      case TaskStatus.DONE:
        stats.completed++;
        break;
      case TaskStatus.IN_PROGRESS:
        stats.inProgress++;
        break;
      case TaskStatus.TODO:
        stats.todo++;
        break;
    }

    // Check for overdue tasks
    const dueDate = new Date(task.dueDate);
    if (dueDate < now && task.status !== TaskStatus.DONE) {
      stats.overdue++;
    }
  });

  return stats;
}

export function getTasksByStatus(status: TaskStatus): Task[] {
  return hardcodedTasks.filter(task => task.status === status);
}

export function getTaskById(id: string): Task | undefined {
  return hardcodedTasks.find(task => task.id === id);
}

// Debug utilities
export function debugLogTaskOperation(operation: string, taskId: string, details?: any) {
  console.debug(`[Task Operation] ${operation}:`, {
    taskId,
    timestamp: new Date().toISOString(),
    ...details
  });
} 