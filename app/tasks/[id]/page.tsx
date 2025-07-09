'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { motion } from 'framer-motion';
import { Task, TaskStatus } from '@/lib/types';
import { hardcodedTasks } from '@/lib/data';
import { 
  Calendar, 
  Clock, 
  Tag, 
  CheckCircle2, 
  ArrowLeft,
  AlertTriangle,
  Edit3,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function TaskDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const fetchTask = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from an API
        // For now, we'll use the hardcoded tasks
        setTimeout(() => {
          const foundTask = hardcodedTasks.find(t => t.id === params.id);
          setTask(foundTask || null);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching task:', error);
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Priority styling
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50',
    high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50'
  };

  // Status styling
  const statusColors = {
    [TaskStatus.TODO]: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
    [TaskStatus.DONE]: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50'
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-4xl p-6">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
              <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
              <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Task not found
  if (!task) {
    return (
      <DashboardLayout>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto max-w-4xl p-6 text-center"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4"
              >
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Task Not Found</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                The task you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/calendar">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Calendar
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-4xl p-6"
      >
        {/* Back Button */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Link href="/calendar">
            <motion.button 
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Calendar
            </motion.button>
          </Link>
        </motion.div>

        {/* Task Details Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
        >
          {/* Header with priority indicator */}
          <div className={`h-2 ${
            task.priority === 'high' ? 'bg-red-500' : 
            task.priority === 'medium' ? 'bg-yellow-500' : 
            'bg-blue-500'
          }`}></div>

          <div className="p-8">
            {/* Title */}
            <motion.h1 
              variants={itemVariants}
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4"
            >
              {task.title}
            </motion.h1>

            {/* Meta information */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-3 mb-6"
            >
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                <Clock className="w-3 h-3 mr-1" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>

              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {task.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </span>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(task.dueDate)}
              </span>
            </motion.div>

            {/* Description */}
            <motion.div 
              variants={itemVariants}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Description</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {task.description}
              </p>
            </motion.div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="mb-8"
              >
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-3 pt-6 border-t border-slate-200 dark:border-slate-700"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Task
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-md transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Task
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
} 