import { Task, TaskStatus, Project } from './types';

// Sample projects data
export const sampleProjects: Project[] = [
  { id: 'project-1', name: 'Website Redesign', color: 'bg-blue-500', tasksCount: 0 },
  { id: 'project-2', name: 'Mobile App', color: 'bg-green-500', tasksCount: 0 },
  { id: 'project-3', name: 'Marketing Campaign', color: 'bg-purple-500', tasksCount: 0 },
  { id: 'project-4', name: 'API Development', color: 'bg-orange-500', tasksCount: 0 },
];

// Sample tasks data with projectId field
export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the new admin dashboard layout',
    status: TaskStatus.TODO,
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    tags: ['Design', 'UI/UX'],
    projectId: 'project-1',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    id: '2',
    title: 'Implement authentication flow',
    description: 'Set up user authentication with JWT and refresh tokens',
    status: TaskStatus.IN_PROGRESS,
    priority: 'high',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    tags: ['Development', 'Security'],
    projectId: 'project-1',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples and response schemas',
    status: TaskStatus.TODO,
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    tags: ['Documentation', 'API'],
    projectId: 'project-4',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    id: '4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    tags: ['DevOps', 'Automation'],
    projectId: 'project-4',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
  },
  {
    id: '5',
    title: 'Optimize database queries',
    description: 'Improve performance of slow database queries',
    status: TaskStatus.DONE,
    priority: 'high',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    tags: ['Database', 'Performance'],
    projectId: 'project-4',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
  },
  {
    id: '6',
    title: 'User testing session',
    description: 'Conduct user testing with 5 participants',
    status: TaskStatus.TODO,
    priority: 'low',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    tags: ['Testing', 'User Research'],
    projectId: 'project-2',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
  },
  {
    id: '7',
    title: 'Weekly team meeting',
    description: 'Discuss project progress and roadmap',
    status: TaskStatus.DONE,
    priority: 'medium',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    tags: ['Meeting', 'Team'],
    projectId: 'project-3',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() // 9 days ago
  },
  {
    id: '8',
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions',
    status: TaskStatus.DONE,
    priority: 'low',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    tags: ['Maintenance', 'Dependencies'],
    projectId: 'project-2',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
  },
  {
    id: '9',
    title: 'Create marketing assets',
    description: 'Design social media graphics and email templates',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    tags: ['Marketing', 'Design'],
    projectId: 'project-3',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: '10',
    title: 'Implement dark mode',
    description: 'Add dark mode support to the application',
    status: TaskStatus.TODO,
    priority: 'low',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    tags: ['UI/UX', 'Development'],
    projectId: 'project-1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: '11',
    title: 'Refactor authentication module',
    description: 'Improve code structure and fix security issues',
    status: TaskStatus.DONE,
    priority: 'high',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    tags: ['Development', 'Security'],
    projectId: 'project-1',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  },
  {
    id: '12',
    title: 'API performance testing',
    description: 'Run load tests on API endpoints',
    status: TaskStatus.DONE,
    priority: 'medium',
    dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    tags: ['Testing', 'API'],
    projectId: 'project-4',
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString() // 11 days ago
  }
]; 