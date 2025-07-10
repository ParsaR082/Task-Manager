'use client';

import { ProjectTaskBoard } from '@/components/project-task-board';
import { Suspense, useState } from 'react';
import { TaskCalendar } from '@/components/task-calendar';
import { useTasks } from '@/lib/task-context';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Suspense fallback={<div>Loading calendar...</div>}>
      <TaskCalendar 
        tasks={tasks} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </Suspense>
  );
} 