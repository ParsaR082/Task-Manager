'use client';

import { useMemo } from 'react';
import { AnalyticsSection } from '@/components/analytics-section';
import { useTasks } from '@/lib/task-context';
import { useProjects } from '@/components/project-provider';

export default function AnalyticsPage() {
  const { tasks } = useTasks();
  const { projects } = useProjects();

  return (
    <div className="mobile-section-spacing">
      <h1 className="mobile-heading text-slate-900 dark:text-slate-100">
        Analytics & Insights
      </h1>
      <AnalyticsSection tasks={tasks} projects={projects} />
    </div>
  );
} 