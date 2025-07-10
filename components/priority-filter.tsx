'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PriorityFilterProps {
  selectedPriority: 'low' | 'medium' | 'high' | null;
  onPriorityChange: (priority: 'low' | 'medium' | 'high' | null) => void;
}

const priorityOptions = [
  { value: null, label: 'All Priorities', color: 'bg-slate-500 dark:bg-slate-400' },
  { value: 'low', label: 'Low Priority', color: 'bg-blue-500 dark:bg-blue-400' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-500 dark:bg-yellow-400' },
  { value: 'high', label: 'High Priority', color: 'bg-red-500 dark:bg-red-400' }
];

export function PriorityFilter({ selectedPriority, onPriorityChange }: PriorityFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get the selected option details
  const selectedOption = priorityOptions.find(option => option.value === selectedPriority);
  
  return (
    <div className="relative" ref={filterRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors",
          "bg-white dark:bg-slate-800 border shadow-sm",
          isOpen 
            ? "border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30" 
            : "border-slate-200 dark:border-slate-700",
          "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Filter by priority"
        title="Filter by priority"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <div className="flex items-center gap-2">
            {selectedPriority !== null && (
              <span 
                className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  selectedOption?.color
                )}
              />
            )}
            <span className="text-sm font-medium">
              {selectedOption?.label || 'All Priorities'}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
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
                  onClick={() => {
                    onPriorityChange(option.value as 'low' | 'medium' | 'high' | null);
                    setIsOpen(false);
                  }}
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