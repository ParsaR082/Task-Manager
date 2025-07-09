'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { motion } from 'framer-motion';
import { Task } from '@/lib/types';
import { hardcodedTasks } from '@/lib/data';
import DatePicker from 'react-datepicker';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';

// Import the DatePicker styles
import 'react-datepicker/dist/react-datepicker.css';

export default function CalendarPage() {
  const [tasks] = useState<Task[]>(hardcodedTasks);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Group tasks by date
  const tasksByDate = React.useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      // Format the date as YYYY-MM-DD for consistent comparison
      const dateKey = new Date(task.dueDate).toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(task);
    });
    
    return grouped;
  }, [tasks]);
  
  // Get tasks for selected date
  const tasksForSelectedDate = React.useMemo(() => {
    // Format the selected date as YYYY-MM-DD
    const dateKey = selectedDate.toISOString().split('T')[0];
    return tasksByDate[dateKey] || [];
  }, [selectedDate, tasksByDate]);

  // Custom day renderer to highlight dates with tasks
  const renderDayContents = (day: number, date?: Date) => {
    if (!date) return <span>{day}</span>;
    
    // Format the date as YYYY-MM-DD for consistent comparison
    const dateKey = date.toISOString().split('T')[0];
    const hasTask = tasksByDate[dateKey] && tasksByDate[dateKey].length > 0;
    const taskCount = hasTask ? tasksByDate[dateKey].length : 0;
    
    // Check if this is today's date
    const isToday = new Date().toISOString().split('T')[0] === dateKey;
    
    return (
      <div className="relative flex items-center justify-center">
        <span className={isToday ? 'font-bold' : ''}>{day}</span>
        {hasTask && (
          <span className={`task-indicator ${
            tasksByDate[dateKey].some(task => task.priority === 'high') 
              ? 'bg-red-500 dark:bg-red-600' 
              : tasksByDate[dateKey].some(task => task.priority === 'medium')
                ? 'bg-yellow-500 dark:bg-yellow-600'
                : 'bg-blue-500 dark:bg-blue-600'
          }`}>
            {taskCount}
          </span>
        )}
      </div>
    );
  };
  
  // Priority color mapping
  const priorityColors = {
    low: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-300',
    medium: 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-300',
    high: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300'
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-blue-500" />
              Task Calendar
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              View and manage your tasks by date
            </p>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/20">
          <div className="flex flex-col lg:flex-row">
            {/* Calendar Section */}
            <div className="p-6 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700">
              <div className="calendar-wrapper max-w-md mx-auto">
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
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors duration-200"
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
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors duration-200"
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
            <div className="p-6 lg:w-1/2 overflow-y-auto">
              <motion.h2 
                className="text-xl font-semibold mb-6 flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700"
                key={selectedDate.toISOString()}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                Tasks for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </motion.h2>
              
              <AnimatePresence mode="wait">
                {tasksForSelectedDate.length > 0 ? (
                  <motion.div 
                    className="space-y-4"
                    key="task-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {tasksForSelectedDate.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 300, 
                          damping: 30,
                          delay: index * 0.1
                        }}
                        className={cn(
                          'p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300',
                          priorityColors[task.priority]
                        )}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                        <p className="text-sm mb-3 opacity-90">{task.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize px-2 py-1 bg-white/30 dark:bg-black/20 rounded-full text-xs">
                            Priority: {task.priority}
                          </span>
                          <span className="font-medium capitalize px-2 py-1 bg-white/30 dark:bg-black/20 rounded-full text-xs">
                            Status: {task.status.replace('_', ' ').toLowerCase()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-60 text-center"
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4"
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(59, 130, 246, 0)",
                          "0 0 0 8px rgba(59, 130, 246, 0.1)",
                          "0 0 0 0 rgba(59, 130, 246, 0)"
                        ]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3
                      }}
                    >
                      <CalendarIcon className="w-8 h-8 text-slate-400" />
                    </motion.div>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                      No tasks scheduled for this date
                    </p>
                    <motion.button 
                      className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Task
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
} 