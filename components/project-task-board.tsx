'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Project } from '@/lib/types';
import { Sidebar } from './sidebar';
import { TaskBoard } from './task-board';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectTaskBoardProps {
  tasks: Task[];
  projects?: Project[];
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
}

export function ProjectTaskBoard({ tasks, projects, onTaskMove }: ProjectTaskBoardProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Listen for the custom event to clear project filter
  useEffect(() => {
    const handleClearProjectFilter = () => {
      setSelectedProjectId(null);
    };

    window.addEventListener('clearProjectFilter', handleClearProjectFilter);
    
    return () => {
      window.removeEventListener('clearProjectFilter', handleClearProjectFilter);
    };
  }, []);

  // Generate projects if not provided
  const availableProjects: Project[] = projects || [
    { id: 'project-1', name: 'Website Redesign', color: 'bg-blue-500', tasksCount: 0 },
    { id: 'project-2', name: 'Mobile App', color: 'bg-green-500', tasksCount: 0 },
    { id: 'project-3', name: 'Marketing Campaign', color: 'bg-purple-500', tasksCount: 0 },
    { id: 'project-4', name: 'API Development', color: 'bg-orange-500', tasksCount: 0 },
  ];

  // Count tasks for each project
  const projectsWithTaskCounts = availableProjects.map(project => {
    const taskCount = tasks.filter(task => task.projectId === project.id).length;
    return { ...project, tasksCount: taskCount };
  });

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Backdrop blur for glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10 pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200 dark:bg-blue-900 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200 dark:bg-purple-900 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>
      
      {/* Sidebar with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sidebarCollapsed ? 'collapsed' : 'expanded'}
          initial={{ width: sidebarCollapsed ? 80 : 240, opacity: 0.8 }}
          animate={{ width: sidebarCollapsed ? 80 : 240, opacity: 1 }}
          exit={{ width: sidebarCollapsed ? 80 : 240, opacity: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          className="relative z-20"
        >
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onCollapsedChange={setSidebarCollapsed}
            projects={projectsWithTaskCounts}
            selectedProjectId={selectedProjectId}
            onProjectSelect={setSelectedProjectId}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 backdrop-blur-[2px]">
        <motion.main 
          className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
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
                onTaskMove={onTaskMove}
                selectedProjectId={selectedProjectId}
              />
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
} 