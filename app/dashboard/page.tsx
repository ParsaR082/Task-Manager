import { ProjectTaskBoard } from '@/components/project-task-board';
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading tasks...</div>}>
      <ProjectTaskBoard />
    </Suspense>
  );
} 