'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { getTaskStats } from '@/lib/data';

const priorityData = [
  { name: 'High', value: 5, color: '#ef4444' },
  { name: 'Medium', value: 4, color: '#f59e0b' },
  { name: 'Low', value: 2, color: '#22c55e' },
  { name: 'Urgent', value: 1, color: '#dc2626' }
];

const weeklyData = [
  { name: 'Mon', completed: 4, created: 6 },
  { name: 'Tue', completed: 3, created: 4 },
  { name: 'Wed', completed: 6, created: 5 },
  { name: 'Thu', completed: 8, created: 7 },
  { name: 'Fri', completed: 5, created: 3 },
  { name: 'Sat', completed: 2, created: 1 },
  { name: 'Sun', completed: 3, created: 2 }
];

const teamData = [
  { name: 'John Doe', tasks: 8, completed: 6 },
  { name: 'Jane Smith', tasks: 6, completed: 5 },
  { name: 'Mike Johnson', tasks: 10, completed: 7 },
  { name: 'Sarah Wilson', tasks: 7, completed: 6 }
];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, change, changeType = 'neutral', icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              changeType === 'positive' 
                ? 'text-green-600 dark:text-green-400' 
                : changeType === 'negative'
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
}

export function AnalyticsSection() {
  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          change="+12% from last week"
          changeType="positive"
          icon={CheckCircle}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          change="+8% from last week"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          change="3 active today"
          changeType="neutral"
          icon={Clock}
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          change="-2 from yesterday"
          changeType="positive"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Progress Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Weekly Progress
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">Created</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {priorityData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {item.name}: {item.value} tasks
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Team Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#64748b" 
                fontSize={12}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="tasks" fill="#e2e8f0" name="Total Tasks" />
              <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { user: 'John Doe', action: 'completed', task: 'API Documentation', time: '2 hours ago' },
              { user: 'Jane Smith', action: 'created', task: 'Mobile App Testing', time: '4 hours ago' },
              { user: 'Mike Johnson', action: 'updated', task: 'Dashboard Design', time: '6 hours ago' },
              { user: 'Sarah Wilson', action: 'completed', task: 'User Research', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    <span className="font-medium">{activity.user}</span> {activity.action} 
                    <span className="font-medium"> {activity.task}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 