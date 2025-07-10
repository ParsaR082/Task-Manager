'use client';

import { useState } from 'react';
import { TaskCalendar } from './task-calendar';
import { Task, Project } from '@/lib/types';

interface CalendarWrapperProps {
  tasks: Task[];
  projects?: Project[];
}

export function CalendarWrapper({ tasks, projects }: CalendarWrapperProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="h-full">
      <TaskCalendar 
        tasks={tasks} 
        isOpen={isOpen} 
        onClose={handleClose} 
      />
    </div>
  );
} 