'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriorityFilterProps {
  selectedPriority: 'low' | 'medium' | 'high' | null;
  onPriorityChange: (priority: 'low' | 'medium' | 'high' | null) => void;
}

const priorityOptions = [
  { label: 'All Priorities', value: null, color: 'bg-slate-400' },
  { label: 'Low Priority', value: 'low' as const, color: 'bg-blue-500' },
  { label: 'Medium Priority', value: 'medium' as const, color: 'bg-yellow-500' },
  { label: 'High Priority', value: 'high' as const, color: 'bg-red-500' },
];

export function PriorityFilter({ selectedPriority, onPriorityChange }: PriorityFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = useMemo(() => 
    priorityOptions.find(option => option.value === selectedPriority) || priorityOptions[0],
    [selectedPriority]
  );

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleSelect = useCallback((value: 'low' | 'medium' | 'high' | null) => {
    onPriorityChange(value);
    setIsOpen(false);
  }, [onPriorityChange]);

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg",
          "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
          "text-slate-700 dark:text-slate-300",
          "hover:bg-slate-50 dark:hover:bg-slate-700/50",
          "transition-colors duration-200"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={cn("w-3 h-3 rounded-full", selectedOption.color)} />
        <span className="text-sm font-medium">{selectedOption.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 z-50 mt-1 py-1 min-w-[220px]",
              "bg-white dark:bg-slate-800 rounded-xl shadow-lg",
              "border border-slate-200 dark:border-slate-700"
            )}
          >
            {priorityOptions.map((option, index) => {
              const isSelected = selectedPriority === option.value;
              return (
                <motion.button
                  key={index}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-2.5 text-left text-sm",
                    "transition-colors",
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className={cn(
                        "w-3 h-3 rounded-full",
                        option.color
                      )}
                    />
                    <span>{option.label}</span>
                  </div>
                  
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 