'use client';

import React, { useMemo } from 'react';
import { Task, TaskStatus, Project } from '@/lib/types';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, Clock, AlertCircle, Layers, PieChart, LineChart, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  TooltipProps
} from 'recharts';

interface AnalyticsSectionProps {
  tasks: Task[];
  projects?: Project[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  color: string;
  index: number;
}

export function AnalyticsSection({ tasks, projects = [] }: AnalyticsSectionProps) {
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE).length;
  const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const todoTasks = tasks.filter(task => task.status === TaskStatus.TODO).length;
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

  // Status Distribution data for pie chart
  const statusDistributionData = useMemo(() => {
    return [
      { name: 'To Do', value: todoTasks, color: '#3b82f6' }, // blue-500
      { name: 'In Progress', value: inProgressTasks, color: '#eab308' }, // yellow-500
      { name: 'Done', value: completedTasks, color: '#22c55e' }, // green-500
    ];
  }, [todoTasks, inProgressTasks, completedTasks]);

  // Task Priority data for bar chart
  const taskPriorityData = useMemo(() => {
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
    const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
    const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
    
    return [
      { name: 'High', value: highPriorityTasks, color: '#ef4444' }, // red-500
      { name: 'Medium', value: mediumPriorityTasks, color: '#eab308' }, // yellow-500
      { name: 'Low', value: lowPriorityTasks, color: '#3b82f6' }, // blue-500
    ];
  }, [tasks]);

  // Tasks Over Time data for line chart
  const tasksOverTimeData = useMemo(() => {
    // Get date range (last 7 days)
    const dates: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Count tasks created on each date
    return dates.map(date => {
      const tasksCreatedOnDate = tasks.filter(task => {
        const createdDate = task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : '';
        return createdDate === date;
      }).length;

      const tasksCompletedOnDate = tasks.filter(task => {
        const dueDate = new Date(task.dueDate).toISOString().split('T')[0];
        return dueDate === date && task.status === TaskStatus.DONE;
      }).length;

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        created: tasksCreatedOnDate,
        completed: tasksCompletedOnDate,
      };
    });
  }, [tasks]);

  // Project Breakdown data
  const projectBreakdownData = useMemo(() => {
    if (!projects || projects.length === 0) return [];

    return projects.map(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.id).length;
      return {
        name: project.name,
        value: projectTasks,
        color: project.color.includes('bg-') 
          ? project.color.replace('bg-', '') 
          : project.color
      };
    }).filter(project => project.value > 0);
  }, [tasks, projects]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-8">
      {/* Stat Cards */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Status Distribution
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  animationDuration={1000}
                  animationBegin={200}
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Priority Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Task Priority
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={taskPriorityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barSize={60}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="name" className="text-xs text-slate-600 dark:text-slate-400" />
                <YAxis className="text-xs text-slate-600 dark:text-slate-400" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Tasks">
                  {taskPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Tasks Over Time Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Tasks Over Time
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={tasksOverTimeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="date" className="text-xs text-slate-600 dark:text-slate-400" />
                <YAxis className="text-xs text-slate-600 dark:text-slate-400" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="created"
                  name="Created"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="#22c55e"
                  strokeWidth={2}
                  animationDuration={1500}
                  animationBegin={300}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <FolderKanban className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Project Breakdown
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={projectBreakdownData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis type="number" className="text-xs text-slate-600 dark:text-slate-400" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100}
                  className="text-xs text-slate-600 dark:text-slate-400" 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Tasks">
                  {projectBreakdownData.map((entry, index) => {
                    // Convert color class names to actual color values
                    let color = '#3b82f6'; // Default blue
                    if (entry.color === 'blue-500') color = '#3b82f6';
                    if (entry.color === 'green-500') color = '#22c55e';
                    if (entry.color === 'purple-500') color = '#a855f7';
                    if (entry.color === 'orange-500') color = '#f97316';
                    
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
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