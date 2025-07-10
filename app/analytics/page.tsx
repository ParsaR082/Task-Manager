'use client';

import React, { useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AnalyticsSection } from '@/components/analytics-section';
import { Task, TaskStatus, Project } from '@/lib/types';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

// Import the sample data
import { sampleTasks, sampleProjects } from '@/lib/sample-data';

export default function AnalyticsPage() {
  // We'll use the sample tasks data for our analytics
  const tasks = sampleTasks;
  
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Track task progress and performance metrics
            </p>
          </div>
        </div>

        {/* Analytics Section with Charts */}
        <AnalyticsSection tasks={tasks} projects={sampleProjects} />
      </motion.div>
    </DashboardLayout>
  );
} 