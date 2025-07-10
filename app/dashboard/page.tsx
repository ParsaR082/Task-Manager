'use client';

import { useState } from 'react';
import { TaskBoard } from '@/components/task-board';
import { TaskSearch } from '@/components/task-search';
import { PriorityFilter } from '@/components/priority-filter';
import { useTasks } from '@/lib/task-context';
import { useProjects } from '@/components/project-provider';
import { TaskStatus } from '@/lib/types';

export default function DashboardPage() {
  const { tasks, updateTask } = useTasks();
  const { selectedProjectId } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | null>(null);

  // Filter tasks based on search query, priority, and selected project
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = !selectedPriority || task.priority === selectedPriority;
    const matchesProject = !selectedProjectId || task.projectId === selectedProjectId;
    return matchesSearch && matchesPriority && matchesProject;
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
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <TaskSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
        <PriorityFilter
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
        />
      </div>

      <TaskBoard
        tasks={filteredTasks}
        onTaskMove={handleTaskMove}
        selectedProjectId={selectedProjectId}
      />
    </div>
  );
} 