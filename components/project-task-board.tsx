'use client';

import React, { useState, useEffect } from 'react';
import { TaskStatus } from '@/lib/types';
import { TaskBoard } from './task-board';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from './project-provider';
import { useTasks } from '@/lib/task-context';

export function ProjectTaskBoard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { selectedProjectId } = useProjects();
  const { tasks, updateTaskStatus } = useTasks();

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedProjectId || 'all-projects'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <TaskBoard 
            tasks={tasks}
            onTaskMove={handleTaskMove}
            selectedProjectId={selectedProjectId}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 