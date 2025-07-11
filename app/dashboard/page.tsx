'use client';

import { useState } from 'react';
import { TaskBoard } from '@/components/task-board';
import { PriorityFilter } from '@/components/priority-filter';
import { useTasks } from '@/lib/task-context';
import { useProjects } from '@/components/project-provider';
import { TaskStatus } from '@/lib/types';

export default function DashboardPage() {
  const { filteredTasks, updateTask } = useTasks();
  const { selectedProjectId } = useProjects();
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | null>(null);

  // Filter tasks based on priority and selected project
  const displayedTasks = filteredTasks.filter(task => {
    const matchesPriority = !selectedPriority || task.priority === selectedPriority;
    const matchesProject = !selectedProjectId || task.projectId === selectedProjectId;
    return matchesPriority && matchesProject;
  });

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <PriorityFilter
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
        />
      </div>

      <TaskBoard
        tasks={displayedTasks}
        onTaskMove={handleTaskMove}
        selectedProjectId={selectedProjectId}
      />
    </div>
  );
} 