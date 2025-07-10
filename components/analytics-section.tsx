'use client';

import React from 'react';
import { Task, TaskStatus } from '@/lib/types';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, Clock, AlertCircle, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsSectionProps {
  tasks: Task[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  color: string;
  index: number;
}

export function AnalyticsSection({ tasks }: AnalyticsSectionProps) {
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE).length;
  const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const _todoTasks = tasks.filter(task => task.status === TaskStatus.TODO).length;
  const overdueTasks = tasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE
  ).length;
  
  // Completion rate as percentage
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const stats: StatCardProps[] = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: Layers,
      description: 'All tasks in the system',
      color: 'blue',
      index: 0
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      description: `${completionRate}% completion rate`,
      color: 'green',
      index: 1
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      description: `${Math.round((inProgressTasks / totalTasks) * 100) || 0}% of total tasks`,
      color: 'yellow',
      index: 2
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      description: overdueTasks > 0 ? 'Requires attention' : 'All on schedule',
      color: 'red',
      index: 3
    }
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            Dashboard Overview
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track your task progress and performance
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
}

function StatCard({ title, value, icon: Icon, description, color, index }: StatCardProps) {
  const colorVariants = {
    blue: {
      background: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-800/40',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-500 dark:text-blue-400',
      gradient: 'from-blue-500/20 to-blue-600/20 dark:from-blue-500/30 dark:to-blue-600/30'
    },
    green: {
      background: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-100 dark:border-green-800/40',
      text: 'text-green-700 dark:text-green-300',
      icon: 'text-green-500 dark:text-green-400',
      gradient: 'from-green-500/20 to-green-600/20 dark:from-green-500/30 dark:to-green-600/30'
    },
    yellow: {
      background: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-100 dark:border-yellow-800/40',
      text: 'text-yellow-700 dark:text-yellow-300',
      icon: 'text-yellow-500 dark:text-yellow-400',
      gradient: 'from-yellow-500/20 to-yellow-600/20 dark:from-yellow-500/30 dark:to-yellow-600/30'
    },
    red: {
      background: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-100 dark:border-red-800/40',
      text: 'text-red-700 dark:text-red-300',
      icon: 'text-red-500 dark:text-red-400',
      gradient: 'from-red-500/20 to-red-600/20 dark:from-red-500/30 dark:to-red-600/30'
    }
  };
  
  const colors = colorVariants[color as keyof typeof colorVariants];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6',
        'backdrop-blur-sm backdrop-saturate-150',
        'transition-all duration-300',
        colors.background,
        colors.border
      )}
    >
      {/* Background gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50',
        colors.gradient
      )} />
      
      {/* Icon */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          'bg-white/80 dark:bg-slate-800/80 shadow-sm'
        )}>
          <Icon className={cn('w-6 h-6', colors.icon)} />
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          className={cn(
            'text-3xl font-bold',
            colors.text
          )}
        >
          {value}
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className={cn('font-semibold text-lg mb-1', colors.text)}>
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
} 