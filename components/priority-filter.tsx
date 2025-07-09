import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Priority = 'low' | 'medium' | 'high';

interface PriorityFilterProps {
  selectedPriority: Priority | null;
  onPriorityChange: (priority: Priority | null) => void;
}

const priorities: { value: Priority; label: string; baseColor: string; hoverColor: string }[] = [
  { 
    value: 'low', 
    label: 'Low', 
    baseColor: 'bg-blue-100 dark:bg-blue-900/30',
    hoverColor: 'hover:bg-blue-200 dark:hover:bg-blue-800/40'
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    baseColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    hoverColor: 'hover:bg-yellow-200 dark:hover:bg-yellow-800/40'
  },
  { 
    value: 'high', 
    label: 'High', 
    baseColor: 'bg-red-100 dark:bg-red-900/30',
    hoverColor: 'hover:bg-red-200 dark:hover:bg-red-800/40'
  }
];

export function PriorityFilter({ selectedPriority, onPriorityChange }: PriorityFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">
        Priority:
      </span>
      <div className="flex gap-2">
        {priorities.map((priority) => (
          <motion.button
            key={priority.value}
            onClick={() => onPriorityChange(selectedPriority === priority.value ? null : priority.value)}
            className={cn(
              'relative px-3 py-1 rounded-full text-sm font-medium transition-all duration-200',
              'border border-transparent',
              priority.baseColor,
              priority.hoverColor,
              'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
              selectedPriority === priority.value ? 'ring-2 ring-offset-2 dark:ring-offset-slate-900' : '',
              selectedPriority === priority.value 
                ? 'text-slate-900 dark:text-slate-100' 
                : 'text-slate-700 dark:text-slate-300'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={false}
          >
            {priority.label}
            {selectedPriority === priority.value && (
              <motion.div
                layoutId="priorityIndicator"
                className="absolute inset-0 rounded-full border-2"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
} 