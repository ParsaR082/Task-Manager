'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Calendar,
  FolderKanban,
  Target,
  LineChart
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  TooltipProps
} from 'recharts';
import { Task, Project, TaskStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

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
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'done';
  }).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Prepare data for charts
  const statusDistributionData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: '#94a3b8' },
    { name: 'In Progress', value: inProgressTasks, color: '#3b82f6' },
    { name: 'Done', value: completedTasks, color: '#22c55e' }
  ].filter(item => item.value > 0);

  const taskPriorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#3b82f6' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, color: '#a855f7' }
  ].filter(item => item.value > 0);

  // Generate tasks over time data (last 7 days)
  const tasksOverTimeData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    const created = tasks.filter(task => {
      const createdDate = new Date(task.createdAt).toISOString().split('T')[0];
      return createdDate === dateStr;
    }).length;
    
    const completed = tasks.filter(task => {
      const updatedDate = new Date(task.updatedAt).toISOString().split('T')[0];
      return updatedDate === dateStr && task.status === 'done';
    }).length;
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      created,
      completed
    };
  });

  // Project breakdown data
  const projectBreakdownData = projects.map(project => ({
    name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
    value: tasks.filter(task => task.projectId === project.id).length,
    color: project.color || 'blue-500'
  })).filter(item => item.value > 0);

  // Add "No Project" category
  const noProjectTasks = tasks.filter(task => !task.projectId).length;
  if (noProjectTasks > 0) {
    projectBreakdownData.push({
      name: 'No Project',
      value: noProjectTasks,
      color: 'gray-500'
    });
  }

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: Target,
      description: 'All tasks in the system',
      color: 'blue'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      description: `${completionRate}% completion rate`,
      color: 'green'
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      description: 'Currently being worked on',
      color: 'yellow'
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      description: 'Past due date',
      color: 'red'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="text-slate-900 dark:text-slate-100 font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="mobile-section-spacing">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mobile-gap mb-8">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 mobile-gap">
        {/* Task Status Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mobile-p shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="mobile-text-lg font-semibold text-slate-900 dark:text-slate-100">
              Task Status Distribution
            </h3>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
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
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mobile-p shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="mobile-text-lg font-semibold text-slate-900 dark:text-slate-100">
              Task Priority
            </h3>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={taskPriorityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barSize={60}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs text-slate-600 dark:text-slate-400"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs text-slate-600 dark:text-slate-400"
                  tick={{ fontSize: 12 }}
                />
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
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mobile-p shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="w-5 h-5 text-blue-500" />
            <h3 className="mobile-text-lg font-semibold text-slate-900 dark:text-slate-100">
              Tasks Over Time
            </h3>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={tasksOverTimeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs text-slate-600 dark:text-slate-400"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs text-slate-600 dark:text-slate-400"
                  tick={{ fontSize: 12 }}
                />
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
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mobile-p shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <FolderKanban className="w-5 h-5 text-blue-500" />
            <h3 className="mobile-text-lg font-semibold text-slate-900 dark:text-slate-100">
              Project Breakdown
            </h3>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={projectBreakdownData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis 
                  type="number" 
                  className="text-xs text-slate-600 dark:text-slate-400"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  className="text-xs text-slate-600 dark:text-slate-400"
                  tick={{ fontSize: 10 }}
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
                    if (entry.color === 'red-500') color = '#ef4444';
                    if (entry.color === 'yellow-500') color = '#f59e0b';
                    if (entry.color === 'indigo-500') color = '#6366f1';
                    if (entry.color === 'pink-500') color = '#ec4899';
                    if (entry.color === 'gray-500') color = '#6b7280';
                    
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
        ease: "easeOut"
      }}
      className={cn(
        'relative overflow-hidden rounded-xl border mobile-p',
        'bg-gradient-to-br backdrop-blur-sm',
        colors.background,
        colors.border,
        colors.gradient
      )}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={cn(
            'p-2 rounded-lg',
            colors.background
          )}>
            <Icon className={cn('w-5 h-5', colors.icon)} />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: (index * 0.1) + 0.3,
              type: "spring",
              stiffness: 200
            }}
            className={cn(
              'text-2xl sm:text-3xl font-bold',
              colors.text
            )}
          >
            {value}
          </motion.div>
        </div>
        <h3 className={cn('font-semibold mobile-body mb-1', colors.text)}>
          {title}
        </h3>
        <p className={cn('mobile-caption opacity-80', colors.text)}>
          {description}
        </p>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/5" />
    </motion.div>
  );
} 