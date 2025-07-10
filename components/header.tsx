'use client';

import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { NotificationBell } from './notification-bell';
import { TaskSearch } from './task-search';
import { motion } from 'framer-motion';
import { Command } from 'lucide-react';

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
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side - Logo/Title */}
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
              <Command className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Task Manager</h1>
          </div>
        </motion.div>

        {/* Center - Search */}
        <motion.div 
          className="flex-1 max-w-2xl mx-6"
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
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
          <ThemeToggle />
        </motion.div>
      </div>
    </header>
  );
} 