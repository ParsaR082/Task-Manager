'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, Menu, Search, X } from 'lucide-react';
import { TaskSearch } from './task-search';
import { NotificationBell } from './notification-bell';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { useTasks } from '@/lib/task-context';
import { useRouter } from 'next/navigation';
import { useDebounce } from '../hooks/useDebounce';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobile?: boolean;
}

export function Header({ onMobileMenuToggle, isMobile = false }: HeaderProps) {
  const router = useRouter();
  const { setSearchQuery } = useTasks();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const debouncedSearch = useDebounce(localSearchQuery, 300);

  // Update global search query when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleSearch = useCallback((value: string) => {
    setLocalSearchQuery(value);
  }, []);

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
    if (showMobileSearch) {
      setLocalSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700 bg-white/75 dark:bg-slate-900/75 backdrop-blur-lg">
      <div className="flex h-16 items-center mobile-safe-area">
        {/* Mobile Menu Button */}
        {isMobile && (
          <motion.button
            onClick={onMobileMenuToggle}
            className="touch-icon-button text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 mr-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        )}

        {/* Left side - Brand (Desktop) */}
        {!isMobile && (
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
            <h1 className="hidden md:block mobile-text-xl font-bold text-slate-900 dark:text-slate-100">
              TaskFlow
            </h1>
          </div>
        )}

        {/* Center - Search (Desktop) or Mobile Search Toggle */}
        <div className="flex-1 flex justify-center">
          {!isMobile ? (
            <div className="w-full max-w-xl px-4">
              <TaskSearch
                value={localSearchQuery}
                onChange={handleSearch}
                placeholder="Search tasks by title or description..."
              />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {!showMobileSearch ? (
                <motion.div
                  key="brand-mobile"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <svg
                      className="w-4 h-4 text-white"
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
                  <h1 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    TaskFlow
                  </h1>
                </motion.div>
              ) : (
                <motion.div
                  key="search-mobile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full max-w-md"
                >
                  <TaskSearch 
                    value={localSearchQuery} 
                    onChange={handleSearch}
                    placeholder="Search tasks..."
                    className="w-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {/* Mobile Search Toggle */}
          {isMobile && (
            <motion.button
              onClick={handleMobileSearchToggle}
              className="touch-icon-button text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showMobileSearch ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </motion.button>
          )}
          
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobile && showMobileSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
          >
            <div className="mobile-safe-area py-4">
              <TaskSearch 
                value={localSearchQuery} 
                onChange={handleSearch}
                placeholder="Search tasks by title or description..."
                className="w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 