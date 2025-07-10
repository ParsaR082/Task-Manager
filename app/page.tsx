'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TaskBoard } from '@/components/task-board';
import { Task, TaskStatus } from '@/lib/types';
import { AnalyticsSection } from '@/components/analytics-section';
import { motion } from 'framer-motion';

// Sample tasks data
const tasks: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the new admin dashboard layout',
    status: TaskStatus.TODO,
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    tags: ['Design', 'UI/UX']
  },
  {
    id: '2',
    title: 'Implement authentication flow',
    description: 'Set up user authentication with JWT and refresh tokens',
    status: TaskStatus.IN_PROGRESS,
    priority: 'high',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    tags: ['Development', 'Security']
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples and response schemas',
    status: TaskStatus.TODO,
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    tags: ['Documentation', 'API']
  },
  {
    id: '4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    tags: ['DevOps', 'Automation']
  },
  {
    id: '5',
    title: 'Optimize database queries',
    description: 'Improve performance of slow database queries',
    status: TaskStatus.DONE,
    priority: 'high',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    tags: ['Database', 'Performance']
  },
  {
    id: '6',
    title: 'User testing session',
    description: 'Conduct user testing with 5 participants',
    status: TaskStatus.TODO,
    priority: 'low',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    tags: ['Testing', 'User Research']
  },
  {
    id: '7',
    title: 'Weekly team meeting',
    description: 'Discuss project progress and roadmap',
    status: TaskStatus.DONE,
    priority: 'medium',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    tags: ['Meeting', 'Team']
  },
  {
    id: '8',
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions',
    status: TaskStatus.DONE,
    priority: 'low',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    tags: ['Maintenance', 'Dependencies']
  }
];

export default function Home() {
  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} moved to ${newStatus}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnalyticsSection tasks={tasks} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1"
        >
          <TaskBoard 
            tasks={tasks} 
            onTaskMove={handleTaskMove} 
          />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
