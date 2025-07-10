'use client';

import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { Task } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Import the DatePicker styles
import 'react-datepicker/dist/react-datepicker.css';

interface TaskCalendarProps {
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

export function TaskCalendar({ tasks, isOpen, onClose }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();
  
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
  
  // Get tasks for selected date, filtered by search query
  const tasksForSelectedDate = useMemo(() => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const tasksForDate = tasksByDate[dateKey] || [];
    
    if (!searchQuery.trim()) {
      return tasksForDate;
    }
    
    // Filter tasks by title (case-insensitive)
    return tasksForDate.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedDate, tasksByDate, searchQuery]);
  
  // Priority color mapping for calendar indicators
  const calendarPriorityColors = {
    low: 'bg-blue-500 dark:bg-blue-600',
    medium: 'bg-yellow-500 dark:bg-yellow-600',
    high: 'bg-red-500 dark:bg-red-600'
  };
  
  // Get highest priority from a list of tasks
  const getHighestPriority = (taskList: Task[]): 'high' | 'medium' | 'low' => {
    if (taskList.some(task => task.priority === 'high')) return 'high';
    if (taskList.some(task => task.priority === 'medium')) return 'medium';
    return 'low';
  };
  
  // Custom day renderer to highlight dates with tasks
  const renderDayContents = (day: number, date?: Date) => {
    if (!date) return <span>{day}</span>;
    
    const dateKey = date.toISOString().split('T')[0];
    const tasksForDay = tasksByDate[dateKey] || [];
    const hasTask = tasksForDay.length > 0;
    
    if (!hasTask) {
      return <span>{day}</span>;
    }
    
    // Get highest priority for this day
    const highestPriority = getHighestPriority(tasksForDay);
    const taskCount = tasksForDay.length;
    
    return (
      <div className="relative flex items-center justify-center">
        <span>{day}</span>
        <motion.span 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={`task-indicator-badge priority-${highestPriority}`}
        >
          {taskCount}
        </motion.span>
      </div>
    );
  };
  
  // Priority color mapping for task cards
  const priorityColors = {
    low: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-300',
    medium: 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-300',
    high: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300'
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
                <CalendarIcon className="w-5 h-5 text-blue-500" />
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
                    onChange={(date: Date | null) => date && setSelectedDate(date)}
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
                        <motion.button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </motion.button>
                        <motion.div 
                          className="text-lg font-semibold text-slate-100"
                          initial={false}
                          animate={{ opacity: [0.8, 1] }}
                          transition={{ duration: 0.3 }}
                          key={`${date.getMonth()}-${date.getFullYear()}`}
                        >
                          {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                        </motion.div>
                        <motion.button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </motion.button>
                      </div>
                    )}
                  />
                </div>
              </div>
              
              {/* Tasks for Selected Date */}
              <div className="p-4 md:w-1/2 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-3">
                  Tasks for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                {/* Search Bar */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-lg 
                              bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                              placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                              transition-all duration-200"
                    placeholder="Search tasks by title..."
                  />
                  {searchQuery && (
                    <button 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                    </button>
                  )}
                </div>
                
                <AnimatePresence mode="wait">
                  {tasksForSelectedDate.length > 0 ? (
                    <motion.div 
                      className="space-y-3"
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AnimatePresence>
                        {tasksForSelectedDate.map((task, index) => (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ 
                              type: 'spring', 
                              stiffness: 300, 
                              damping: 30,
                              delay: index * 0.05
                            }}
                            className={cn(
                              'p-3 rounded-lg border cursor-pointer relative group',
                              priorityColors[task.priority]
                            )}
                            onClick={() => {
                              onClose();
                              router.push(`/tasks/${task.id}`);
                            }}
                            whileHover={{ 
                              scale: 1.03,
                              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)"
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 px-2 py-1 rounded-full text-xs"
                              initial={{ x: -10 }}
                              whileHover={{ x: 0 }}
                            >
                              View details <ArrowRight className="w-3 h-3" />
                            </motion.div>
                            <h4 className="font-medium mb-1 pr-16">{task.title}</h4>
                            <p className="text-sm opacity-80 line-clamp-2">{task.description}</p>
                            <div className="flex items-center justify-between mt-2 text-xs">
                              <span className="font-medium capitalize">Priority: {task.priority}</span>
                              <span className="font-medium capitalize">Status: {task.status.replace('_', ' ').toLowerCase()}</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
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
                        {searchQuery 
                          ? `No tasks matching "${searchQuery}" for this date` 
                          : "No tasks scheduled for this date"}
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