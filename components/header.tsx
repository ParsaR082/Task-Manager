'use client';

import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { NotificationBell } from './notification-bell';
import { TaskSearch } from './task-search';
import { cn } from '@/lib/utils';

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
    'frontend',
    'backend',
    'bug',
    'feature',
    'documentation',
    'design',
    'testing'
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Search */}
        <div className="flex-1 max-w-2xl">
          <TaskSearch onSearch={onSearch} availableTags={availableTags} />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          <NotificationBell 
            count={notificationCount} 
            onClick={onNotificationClick} 
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 