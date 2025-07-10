'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings } from 'lucide-react';
import { TaskSearch } from './task-search';
import { NotificationBell } from './notification-bell';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700 bg-white/75 dark:bg-slate-900/75 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side - Search */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <TaskSearch value={searchQuery} onChange={setSearchQuery} />
        </motion.div>

        {/* Right side - Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <NotificationBell />
          <ThemeToggle />
        </motion.div>
      </div>
    </header>
  );
} 