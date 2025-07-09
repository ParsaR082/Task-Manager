import { Task, TaskStatus } from './types';

export const hardcodedTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Implement auth modal',
    description: 'Connect Google OAuth provider for user authentication',
    status: 'backlog',
    deadline: '2024-07-15',
    priority: 'high',
    createdAt: new Date('2024-07-01'),
    assignee: 'John Doe',
    tags: ['frontend', 'auth']
  },
  {
    id: 'task-2',
    title: 'Setup MongoDB connection',
    description: 'Configure database connection and schema design',
    status: 'backlog',
    deadline: '2024-07-20',
    priority: 'high',
    createdAt: new Date('2024-07-02'),
    assignee: 'Jane Smith',
    tags: ['backend', 'database']
  },
  {
    id: 'task-3',
    title: 'Design task card component',
    description: 'Create reusable task card with drag-and-drop functionality',
    status: 'in-progress',
    deadline: '2024-07-10',
    priority: 'medium',
    createdAt: new Date('2024-07-03'),
    assignee: 'Mike Johnson',
    tags: ['frontend', 'ui']
  },
  {
    id: 'task-4',
    title: 'Implement user dashboard',
    description: 'Build main dashboard with task overview and analytics',
    status: 'in-progress',
    deadline: '2024-07-25',
    priority: 'high',
    createdAt: new Date('2024-07-04'),
    assignee: 'Sarah Wilson',
    tags: ['frontend', 'dashboard']
  },
  {
    id: 'task-5',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment to Vercel',
    status: 'backlog',
    deadline: '2024-07-30',
    priority: 'medium',
    createdAt: new Date('2024-07-05'),
    assignee: 'David Brown',
    tags: ['devops', 'automation']
  },
  {
    id: 'task-6',
    title: 'Add notification system',
    description: 'Implement real-time notifications for task updates',
    status: 'backlog',
    deadline: '2024-08-05',
    priority: 'low',
    createdAt: new Date('2024-07-06'),
    assignee: 'Emily Davis',
    tags: ['frontend', 'notifications']
  },
  {
    id: 'task-7',
    title: 'Create API documentation',
    description: 'Document all API endpoints with examples',
    status: 'done',
    deadline: '2024-07-08',
    priority: 'medium',
    createdAt: new Date('2024-06-28'),
    assignee: 'Chris Lee',
    tags: ['documentation', 'api']
  },
  {
    id: 'task-8',
    title: 'Implement search functionality',
    description: 'Add search and filter capabilities for tasks',
    status: 'in-progress',
    deadline: '2024-07-18',
    priority: 'medium',
    createdAt: new Date('2024-07-07'),
    assignee: 'Alex Turner',
    tags: ['frontend', 'search']
  },
  {
    id: 'task-9',
    title: 'Setup error monitoring',
    description: 'Integrate error tracking and monitoring tools',
    status: 'backlog',
    deadline: '2024-08-01',
    priority: 'low',
    createdAt: new Date('2024-07-08'),
    assignee: 'Lisa Garcia',
    tags: ['monitoring', 'infrastructure']
  },
  {
    id: 'task-10',
    title: 'Mobile responsive design',
    description: 'Ensure all components work perfectly on mobile devices',
    status: 'done',
    deadline: '2024-07-12',
    priority: 'high',
    createdAt: new Date('2024-06-25'),
    assignee: 'Tom Wilson',
    tags: ['frontend', 'mobile', 'responsive']
  },
  {
    id: 'task-11',
    title: 'Performance optimization',
    description: 'Optimize app performance and loading times',
    status: 'done',
    deadline: '2024-07-14',
    priority: 'medium',
    createdAt: new Date('2024-06-30'),
    assignee: 'Rachel Green',
    tags: ['performance', 'optimization']
  }
];

export function getTasksByStatus(status: TaskStatus): Task[] {
  return hardcodedTasks.filter(task => task.status === status);
}

export function getTaskStats() {
  const total = hardcodedTasks.length;
  const completed = hardcodedTasks.filter(task => task.status === 'done').length;
  const inProgress = hardcodedTasks.filter(task => task.status === 'in-progress').length;
  const overdue = hardcodedTasks.filter(task => {
    const deadline = new Date(task.deadline);
    const today = new Date();
    return deadline < today && task.status !== 'done';
  }).length;

  return { total, completed, inProgress, overdue };
} 