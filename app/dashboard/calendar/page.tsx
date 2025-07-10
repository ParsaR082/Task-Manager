import { TaskCalendar } from '@/components/task-calendar';
import { Suspense } from 'react';

export default function CalendarPage() {
  return (
    <Suspense fallback={<div>Loading calendar...</div>}>
      <TaskCalendar />
    </Suspense>
  );
} 