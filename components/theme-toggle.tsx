'use client';

import React from 'react';
import { useTheme } from '@/lib/theme-context';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
    setTheme(nextTheme);
  };
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-lg transition-colors",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "text-slate-500 dark:text-slate-400",
        "hover:text-slate-700 dark:hover:text-slate-300"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'} mode`}
      title={`Current theme: ${theme}. Click to switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.div
            key="dark"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        ) : theme === 'light' ? (
          <motion.div
            key="light"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="system"
            initial={{ opacity: 0, y: -10, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Monitor className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background glow effect */}
      <AnimatePresence>
        {theme === 'dark' && (
          <motion.div
            key="dark-glow"
            className="absolute inset-0 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {theme === 'light' && (
          <motion.div
            key="light-glow"
            className="absolute inset-0 rounded-lg bg-yellow-500/10 dark:bg-yellow-400/10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
} 