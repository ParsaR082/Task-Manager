'use client';

import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { Task } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import the DatePicker styles
import 'react-datepicker/dist/react-datepicker.css';

interface TaskCalendarProps {
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

export function TaskCalendar({ tasks, isOpen, onClose }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      const dateKey = new Date(task.dueDate).toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(task);
    });
    
    return grouped;
  }, [tasks]);
  
  // Get tasks for selected date
  const tasksForSelectedDate = useMemo(() => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    return tasksByDate[dateKey] || [];
  }, [selectedDate, tasksByDate]);
  
  // Custom day renderer to highlight dates with tasks
  const renderDayContents = (day: number, date?: Date) => {
    if (!date) return <span>{day}</span>;
    
    const dateKey = date.toISOString().split('T')[0];
    const hasTask = tasksByDate[dateKey] && tasksByDate[dateKey].length > 0;
    const taskCount = hasTask ? tasksByDate[dateKey].length : 0;
    
    return (
      <div className="relative flex items-center justify-center">
        <span>{day}</span>
        {hasTask && (
          <span className={cn(
            'absolute -bottom-1 left-1/2 transform -translate-x-1/2',
            'w-5 h-5 flex items-center justify-center rounded-full text-[10px]',
            'bg-blue-500 text-white font-medium'
          )}>
            {taskCount}
          </span>
        )}
      </div>
    );
  };
  
  // Priority color mapping
  const priorityColors = {
    low: 'bg-blue-100 border-blue-300 text-blue-800',
    medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    high: 'bg-red-100 border-red-300 text-red-800'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Task Calendar
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row h-full">
              {/* Calendar Section */}
              <div className="p-4 md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
                <div className="calendar-wrapper">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date) => setSelectedDate(date)}
                    inline
                    renderDayContents={renderDayContents}
                    calendarClassName="w-full"
                    renderCustomHeader={({
                      date,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled,
                    }) => (
                      <div className="flex items-center justify-between px-2 py-2">
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="text-lg font-semibold">
                          {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                        </div>
                        <button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  />
                </div>
              </div>
              
              {/* Tasks for Selected Date */}
              <div className="p-4 md:w-1/2 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">
                  Tasks for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                <AnimatePresence>
                  {tasksForSelectedDate.length > 0 ? (
                    <motion.div className="space-y-3">
                      {tasksForSelectedDate.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className={cn(
                            'p-3 rounded-lg border',
                            priorityColors[task.priority]
                          )}
                        >
                          <h4 className="font-medium mb-1">{task.title}</h4>
                          <p className="text-sm opacity-80 line-clamp-2">{task.description}</p>
                          <div className="flex items-center justify-between mt-2 text-xs">
                            <span className="font-medium capitalize">Priority: {task.priority}</span>
                            <span className="font-medium capitalize">Status: {task.status.replace('_', ' ').toLowerCase()}</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-40 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                        <CalendarIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">
                        No tasks scheduled for this date
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 