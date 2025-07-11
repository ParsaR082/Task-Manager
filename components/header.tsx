'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings } from 'lucide-react';
import { TaskSearch } from './task-search';
import { NotificationBell } from './notification-bell';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { useTasks } from '@/lib/task-context';
import { useRouter } from 'next/navigation';
import { useDebounce } from '../hooks/useDebounce';

export function Header() {
  const router = useRouter();
  const { setSearchQuery } = useTasks();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const debouncedSearch = useDebounce(localSearchQuery, 300);

  // Update global search query when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleSearch = useCallback((value: string) => {
    setLocalSearchQuery(value);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700 bg-white/75 dark:bg-slate-900/75 backdrop-blur-lg">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-6">
        {/* Left side - Brand */}
        <div className="flex gap-4 items-center">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m3 17 2 2 4-4" />
              <path d="m3 7 2 2 4-4" />
              <path d="M13 6h8" />
              <path d="M13 12h8" />
              <path d="M13 18h8" />
            </svg>
          </div>
          <h1 className="hidden md:block text-xl font-bold text-slate-900 dark:text-slate-100">
            TaskFlow
          </h1>
        </div>

        {/* Center - Search */}
        <div className="flex-1 flex justify-center max-w-xl px-4">
          <TaskSearch 
            value={localSearchQuery} 
            onChange={handleSearch}
            placeholder="Search tasks by title or description..."
          />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 