import { TaskDetail } from '@/components/task-detail';
import { Suspense } from 'react';

export default function TaskPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading task...</div>}>
      <TaskDetail id={params.id} />
    </Suspense>
  );
} 