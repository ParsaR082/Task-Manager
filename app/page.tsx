'use client';

import React from 'react';
import { ProjectTaskBoard } from '@/components/project-task-board';
import { TaskStatus } from '@/lib/types';
import { sampleTasks, sampleProjects } from '@/lib/sample-data';

export default function HomePage() {
  // Handle task movement between columns
  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} moved to ${newStatus}`);
    // In a real app, you would update your database or state here
  };

  return (
    <ProjectTaskBoard 
      tasks={sampleTasks}
      projects={sampleProjects}
      onTaskMove={handleTaskMove}
    />
  );
}
