'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Helper function to normalize a date to YYYY-MM-DD format in local timezone
  const formatDateToYYYYMMDD = (date: Date | string): string => {
    const d = new Date(date);
    // Get date parts in local timezone
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      const dateKey = formatDateToYYYYMMDD(task.dueDate);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(task);
    });
    
    return grouped;
  }, [tasks]);
  
  // Get tasks for selected date, filtered by search query
  const tasksForSelectedDate = useMemo(() => {
    const dateKey = formatDateToYYYYMMDD(selectedDate);
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
  const getHighestPriority = (taskList: Task[]): 'urgent' | 'high' | 'medium' | 'low' => {
    if (taskList.some(task => task.priority === 'urgent')) return 'urgent';
    if (taskList.some(task => task.priority === 'high')) return 'high';
    if (taskList.some(task => task.priority === 'medium')) return 'medium';
    return 'low';
  };
  
  // Custom day renderer to highlight dates with tasks
  const renderDayContents = (day: number, date?: Date) => {
    if (!date) return <span>{day}</span>;
    
    const dateKey = formatDateToYYYYMMDD(date);
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
    high: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300',
    urgent: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-800/50 dark:text-purple-300'
  };

  const getPriorityColor = (priority: string) => {
    return priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium;
  };

  if (isMobile) {
    // Mobile layout - full page
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Mobile Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 mobile-safe-area py-4">
          <div className="flex items-center justify-between">
            <h1 className="mobile-text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              Calendar
            </h1>
            <button 
              onClick={onClose}
              className="touch-icon-button text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mobile-safe-area mobile-section-spacing">
          {/* Mobile Calendar */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="calendar-wrapper p-4">
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
                      className="touch-icon-button hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </motion.button>
                    <motion.div 
                      className="mobile-text-lg font-semibold text-slate-900 dark:text-slate-100"
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
                      className="touch-icon-button hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
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

          {/* Mobile Tasks Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Mobile Tasks Header */}
            <div className="mobile-p border-b border-slate-200 dark:border-slate-700">
              <div className="mobile-row">
                <h3 className="mobile-text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Tasks for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </h3>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mobile-caption px-2 py-1 rounded-full font-medium">
                  {tasksForSelectedDate.length}
                </span>
              </div>

              {/* Mobile Search */}
              <div className="mt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-lg border bg-white dark:bg-slate-700",
                      "border-slate-300 dark:border-slate-600",
                      "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                      "text-slate-900 dark:text-slate-100 mobile-body",
                      "placeholder-slate-400 dark:placeholder-slate-500"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Tasks List */}
            <div className="mobile-p">
              <AnimatePresence mode="popLayout">
                {tasksForSelectedDate.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-8"
                  >
                    <CalendarIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 mobile-body">
                      {searchQuery ? 'No matching tasks found' : 'No tasks for this date'}
                    </p>
                  </motion.div>
                ) : (
                  <div className="mobile-item-spacing">
                    {tasksForSelectedDate.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'p-4 rounded-lg border cursor-pointer transition-all duration-200',
                          'hover:shadow-md active:scale-[0.98]',
                          getPriorityColor(task.priority)
                        )}
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium mobile-body truncate">{task.title}</h4>
                            {task.description && (
                              <p className="mobile-caption text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="mobile-caption px-2 py-1 bg-white/50 dark:bg-slate-900/50 rounded-md font-medium">
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-2 flex-shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout - modal
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
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            {/* Desktop Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
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
            
            <div className="flex h-full max-h-[calc(85vh-80px)]">
              {/* Desktop Calendar Section */}
              <div className="p-6 w-1/2 border-r border-slate-200 dark:border-slate-700">
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
                          className="text-lg font-semibold text-slate-900 dark:text-slate-100"
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
              
              {/* Desktop Tasks Section */}
              <div className="w-1/2 flex flex-col">
                {/* Desktop Tasks Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Tasks for {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full font-medium">
                      {tasksForSelectedDate.length}
                    </span>
                  </div>

                  {/* Desktop Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-slate-700",
                        "border-slate-300 dark:border-slate-600",
                        "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                        "text-slate-900 dark:text-slate-100 text-sm",
                        "placeholder-slate-400 dark:placeholder-slate-500"
                      )}
                    />
                  </div>
                </div>

                {/* Desktop Tasks List */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hidden">
                  <AnimatePresence mode="popLayout">
                    {tasksForSelectedDate.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-12"
                      >
                        <CalendarIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">
                          {searchQuery ? 'No matching tasks found' : 'No tasks for this date'}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {tasksForSelectedDate.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                              'p-4 rounded-lg border cursor-pointer transition-all duration-200',
                              'hover:shadow-md hover:scale-[1.02]',
                              getPriorityColor(task.priority)
                            )}
                            onClick={() => router.push(`/tasks/${task.id}`)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{task.title}</h4>
                                {task.description && (
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs px-2 py-1 bg-white/50 dark:bg-slate-900/50 rounded-md font-medium">
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-2 flex-shrink-0" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 