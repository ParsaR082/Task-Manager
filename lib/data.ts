import { Task, TaskStatus } from './types';

// Generate dates close to today
function getNearbyDate(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

export const hardcodedTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    description: 'Finalize the project proposal document with all requirements and submit for review.',
    status: TaskStatus.TODO,
    priority: 'high',
    dueDate: getNearbyDate(2),
    tags: ['Documentation', 'Planning']
  },
  {
    id: '2',
    title: 'Review Design Mockups',
    description: 'Review the design mockups for the new landing page and provide feedback.',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: getNearbyDate(1),
    tags: ['Design', 'Feedback']
  },
  {
    id: '3',
    title: 'Setup Development Environment',
    description: 'Install and configure all necessary tools for the development environment.',
    status: TaskStatus.DONE,
    priority: 'low',
    dueDate: getNearbyDate(-1),
    tags: ['Setup', 'Development']
  },
  {
    id: '4',
    title: 'Client Meeting Preparation',
    description: 'Prepare slides and talking points for the upcoming client meeting.',
    status: TaskStatus.TODO,
    priority: 'high',
    dueDate: getNearbyDate(0), // Today
    tags: ['Meeting', 'Client']
  },
  {
    id: '5',
    title: 'Database Schema Design',
    description: 'Design the database schema for the new application based on requirements.',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: getNearbyDate(3),
    tags: ['Database', 'Architecture']
  },
  {
    id: '6',
    title: 'API Documentation',
    description: 'Document all API endpoints, request parameters, and response formats.',
    status: TaskStatus.TODO,
    priority: 'medium',
    dueDate: getNearbyDate(4),
    tags: ['Documentation', 'API']
  },
  {
    id: '7',
    title: 'Code Review',
    description: 'Review pull requests and provide feedback on code quality and standards.',
    status: TaskStatus.IN_PROGRESS,
    priority: 'high',
    dueDate: getNearbyDate(0), // Today
    tags: ['Code Review', 'Quality']
  },
  {
    id: '8',
    title: 'Unit Test Implementation',
    description: 'Write unit tests for all core functionality to ensure code quality.',
    status: TaskStatus.TODO,
    priority: 'medium',
    dueDate: getNearbyDate(5),
    tags: ['Testing', 'Quality']
  },
  {
    id: '9',
    title: 'Performance Optimization',
    description: 'Identify and fix performance bottlenecks in the application.',
    status: TaskStatus.DONE,
    priority: 'low',
    dueDate: getNearbyDate(-2),
    tags: ['Performance', 'Optimization']
  },
  {
    id: '10',
    title: 'Deployment Planning',
    description: 'Create a deployment plan for the next release including rollback strategy.',
    status: TaskStatus.TODO,
    priority: 'high',
    dueDate: getNearbyDate(7),
    tags: ['Deployment', 'Planning']
  },
  {
    id: '11',
    title: 'User Documentation',
    description: 'Create user guides and documentation for end users.',
    status: TaskStatus.IN_PROGRESS,
    priority: 'low',
    dueDate: getNearbyDate(6),
    tags: ['Documentation', 'User Guide']
  },
  {
    id: '12',
    title: 'Security Audit',
    description: 'Conduct a security audit of the application and address any vulnerabilities.',
    status: TaskStatus.DONE,
    priority: 'high',
    dueDate: getNearbyDate(-3),
    tags: ['Security', 'Audit']
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