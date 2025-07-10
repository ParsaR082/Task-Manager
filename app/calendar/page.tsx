'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskStatus } from '@/lib/types';
import DatePicker from 'react-datepicker';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Import the DatePicker styles
import 'react-datepicker/dist/react-datepicker.css';

// Sample tasks data (same as in page.tsx)
const tasks: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the new admin dashboard layout',
    status: TaskStatus.TODO,
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    tags: ['Design', 'UI/UX']
  },
  {
    id: '2',
    title: 'Implement authentication flow',
    description: 'Set up user authentication with JWT and refresh tokens',
    status: TaskStatus.IN_PROGRESS,
    priority: 'high',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    tags: ['Development', 'Security']
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples and response schemas',
    status: TaskStatus.TODO,
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    tags: ['Documentation', 'API']
  },
  {
    id: '4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    tags: ['DevOps', 'Automation']
  },
  {
    id: '5',
    title: 'Optimize database queries',
    description: 'Improve performance of slow database queries',
    status: TaskStatus.DONE,
    priority: 'high',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    tags: ['Database', 'Performance']
  },
  {
    id: '6',
    title: 'User testing session',
    description: 'Conduct user testing with 5 participants',
    status: TaskStatus.TODO,
    priority: 'low',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    tags: ['Testing', 'User Research']
  },
  {
    id: '7',
    title: 'Weekly team meeting',
    description: 'Discuss project progress and roadmap',
    status: TaskStatus.DONE,
    priority: 'medium',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    tags: ['Meeting', 'Team']
  },
  {
    id: '8',
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions',
    status: TaskStatus.DONE,
    priority: 'low',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    tags: ['Maintenance', 'Dependencies']
  }
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const router = useRouter();

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
  }, []);
  
  // Get tasks for selected date, filtered by search query
  const tasksForSelectedDate = React.useMemo(() => {
    // Format the selected date as YYYY-MM-DD
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
                className="text-xl font-semibold mb-4 flex items-center gap-2"
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
              
              {/* Search Bar */}
              <div className="relative mb-6">
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
                    className="space-y-4"
                    key="task-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
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
                            'p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative group',
                            priorityColors[task.priority]
                          )}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)"
                          }}
                          onClick={() => router.push(`/tasks/${task.id}`)}
                        >
                          <motion.div 
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 px-2 py-1 rounded-full text-xs"
                            initial={{ x: -10 }}
                            whileHover={{ x: 0 }}
                          >
                            View details <ArrowRight className="w-3 h-3" />
                          </motion.div>
                          <h3 className="font-semibold text-lg mb-1 pr-20">{task.title}</h3>
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
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                      {searchQuery 
                        ? `No tasks matching "${searchQuery}" for this date` 
                        : "No tasks scheduled for this date"}
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