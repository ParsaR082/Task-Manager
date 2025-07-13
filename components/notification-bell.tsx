'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

export function NotificationBell({ count = 0, onClick }: NotificationBellProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleHoverStart = useCallback(() => setIsHovering(true), []);
  const handleHoverEnd = useCallback(() => setIsHovering(false), []);
  
  return (
    <motion.button
      className={cn(
        "relative p-2 rounded-lg transition-colors",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "text-slate-500 dark:text-slate-400",
        "hover:text-slate-700 dark:hover:text-slate-300"
      )}
      onClick={onClick}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Notifications ${count > 0 ? `(${count} unread)` : ''}`}
      title={`Notifications ${count > 0 ? `(${count} unread)` : ''}`}
    >
      <Bell className="h-5 w-5" />
      
      {/* Notification Count Badge */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            key="count"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "absolute -top-1 -right-1 flex items-center justify-center",
              "min-w-[18px] h-[18px] rounded-full text-xs font-medium",
              "bg-red-500 text-white shadow-sm"
            )}
          >
            {count > 9 ? '9+' : count}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Optimized Ring Animation */}
      <AnimatePresence>
        {isHovering && count > 0 && (
          <motion.div
            key="ring"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.2, 1.4],
              opacity: [0.6, 0.3, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, repeat: 0 }}
            className="absolute inset-0 rounded-full bg-red-500/20 pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      {/* Optimized Shake Animation */}
      {count > 0 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={isHovering ? {
            rotate: [0, -3, 3, -3, 3, 0],
            transition: { 
              duration: 0.4,
              repeat: 0,
              ease: "easeInOut"
            }
          } : {}}
        />
      )}
    </motion.button>
  );
} 