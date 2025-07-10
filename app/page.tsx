'use client';

import React from 'react';
import { ProjectTaskBoard } from '@/components/project-task-board';
import { Task, TaskStatus, Project } from '@/lib/types';

// Sample projects data
const sampleProjects: Project[] = [
  { id: 'project-1', name: 'Website Redesign', color: 'bg-blue-500', tasksCount: 0 },
  { id: 'project-2', name: 'Mobile App', color: 'bg-green-500', tasksCount: 0 },
  { id: 'project-3', name: 'Marketing Campaign', color: 'bg-purple-500', tasksCount: 0 },
  { id: 'project-4', name: 'API Development', color: 'bg-orange-500', tasksCount: 0 },
];

// Sample tasks data with projectId field
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the new admin dashboard layout',
    status: TaskStatus.TODO,
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    tags: ['Design', 'UI/UX'],
    projectId: 'project-1'
  },
  {
    id: '2',
    title: 'Implement authentication flow',
    description: 'Set up user authentication with JWT and refresh tokens',
    status: TaskStatus.IN_PROGRESS,
    priority: 'high',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    tags: ['Development', 'Security'],
    projectId: 'project-1'
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples and response schemas',
    status: TaskStatus.TODO,
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    tags: ['Documentation', 'API'],
    projectId: 'project-4'
  },
  {
    id: '4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    tags: ['DevOps', 'Automation'],
    projectId: 'project-4'
  },
  {
    id: '5',
    title: 'Optimize database queries',
    description: 'Improve performance of slow database queries',
    status: TaskStatus.DONE,
    priority: 'high',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    tags: ['Database', 'Performance'],
    projectId: 'project-4'
  },
  {
    id: '6',
    title: 'User testing session',
    description: 'Conduct user testing with 5 participants',
    status: TaskStatus.TODO,
    priority: 'low',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    tags: ['Testing', 'User Research'],
    projectId: 'project-2'
  },
  {
    id: '7',
    title: 'Weekly team meeting',
    description: 'Discuss project progress and roadmap',
    status: TaskStatus.DONE,
    priority: 'medium',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    tags: ['Meeting', 'Team'],
    projectId: 'project-3'
  },
  {
    id: '8',
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions',
    status: TaskStatus.DONE,
    priority: 'low',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    tags: ['Maintenance', 'Dependencies'],
    projectId: 'project-2'
  }
];

export default function HomePage() {
  // Handle task movement between columns
  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} moved to ${newStatus}`);
    // In a real app, you would update your database or state here
  };

  return (
    <ProjectTaskBoard 
      tasks={sampleTasks}
      projects={sampleProjects}
      onTaskMove={handleTaskMove}
    />
  );
}
