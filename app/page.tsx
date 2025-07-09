'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { TaskBoard } from '@/components/task-board';
import { AnalyticsSection } from '@/components/analytics-section';
import { hardcodedTasks } from '@/lib/data';
import { TaskStatus } from '@/lib/types';

export default function Dashboard() {
  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    // In a real app, this would update the database
    console.log(`Moved task ${taskId} to ${newStatus}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Task Board Section */}
        <section>
          <TaskBoard 
            tasks={hardcodedTasks} 
            onTaskMove={handleTaskMove}
          />
        </section>

        {/* Analytics Section */}
        <section>
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
        </section>
      </div>
    </DashboardLayout>
  );
}
