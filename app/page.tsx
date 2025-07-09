'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TaskBoard } from '@/components/task-board';
import { AnalyticsSection } from '@/components/analytics-section';
import { hardcodedTasks, getTaskStats } from '@/lib/data';
import { TaskStatus } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/dashboard/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Clock, ListTodo } from 'lucide-react';

const statCards = [
  {
    title: 'Total Tasks',
    icon: ListTodo,
    value: 0,
    gradient: { from: 'from-blue-500', to: 'to-blue-600' }
  },
  {
    title: 'Completed',
    icon: CheckCircle,
    value: 0,
    gradient: { from: 'from-green-500', to: 'to-green-600' }
  },
  {
    title: 'In Progress',
    icon: Clock,
    value: 0,
    gradient: { from: 'from-yellow-500', to: 'to-yellow-600' }
  },
  {
    title: 'Overdue',
    icon: Bell,
    value: 0,
    gradient: { from: 'from-red-500', to: 'to-red-600' }
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('board');
  const stats = React.useMemo(() => getTaskStats(), []);

  // Update stat cards with actual values
  const updatedStatCards = React.useMemo(() => [
    { ...statCards[0], value: stats.total },
    { ...statCards[1], value: stats.completed },
    { ...statCards[2], value: stats.inProgress },
    { ...statCards[3], value: stats.overdue }
  ], [stats]);

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    // In a real app, this would update the database
    console.debug(`Moved task ${taskId} to ${newStatus}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {updatedStatCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  gradient
                  from={stat.gradient.from}
                  to={stat.gradient.to}
                  className="relative overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/80">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <Icon className="w-8 h-8 opacity-80" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="board">
              <TaskBoard 
                tasks={hardcodedTasks} 
                onTaskMove={handleTaskMove}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Analytics & Insights
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Track your team's performance and project progress
                  </p>
                </div>
                <AnalyticsSection />
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Notifications
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Stay updated with your team's activities
                  </p>
                </div>
                {/* Notifications content will go here */}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
