'use client';

import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { NotificationBell } from './notification-bell';
import { TaskSearch } from './task-search';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HeaderProps {
  onSearch?: (query: string, tags: string[]) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export function Header({ 
  onSearch, 
  notificationCount = 0, 
  onNotificationClick 
}: HeaderProps) {
  const availableTags = [
    'Documentation',
    'Design',
    'Development',
    'Planning',
    'Meeting',
    'Client',
    'Database',
    'API',
    'Testing',
    'Quality',
    'Performance',
    'Security',
    'Deployment',
    'Feedback',
    'Setup',
    'Architecture',
    'Optimization',
    'Audit',
    'Code Review',
    'User Guide'
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side - Logo/Title */}
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Task Manager</h1>
        </motion.div>

        {/* Center - Search */}
        <motion.div 
          className="flex-1 max-w-2xl mx-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <TaskSearch onSearch={onSearch} availableTags={availableTags} />
        </motion.div>

        {/* Right side - Actions */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <NotificationBell 
            count={notificationCount} 
            onClick={onNotificationClick} 
          />
          <ThemeToggle />
        </motion.div>
      </div>
    </header>
  );
} 