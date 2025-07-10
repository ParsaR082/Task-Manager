'use client';

import { useMemo } from 'react';
import { AnalyticsSection } from '@/components/analytics-section';
import { useTasks } from '@/lib/task-context';
import { useProjects } from '@/components/project-provider';

export default function AnalyticsPage() {
  const { tasks } = useTasks();
  const { projects } = useProjects();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Analytics & Insights
      </h1>
      <AnalyticsSection tasks={tasks} projects={projects} />
    </div>
  );
} 