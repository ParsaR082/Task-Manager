'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '@/lib/types';
import { TaskColumn } from './task-column';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, X, Layout, Filter, FolderKanban } from 'lucide-react';
import { PriorityFilter } from './priority-filter';
import { TaskCalendar } from './task-calendar';
import { cn } from '@/lib/utils';

interface TaskBoardProps {
  tasks?: Task[];
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
  selectedProjectId?: string;
}

const columns = [
  { id: TaskStatus.TODO, title: 'To Do' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
  { id: TaskStatus.DONE, title: 'Done' }
];

export function TaskBoard({ tasks = [], onTaskMove, selectedProjectId }: TaskBoardProps) {
  // State for filtered tasks
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter tasks based on search query and tags
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filter by project if selected
      if (selectedProjectId && task.projectId !== selectedProjectId) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by tags
    if (searchTags.length > 0) {
        if (!task.tags || task.tags.length === 0) {
          return false;
        }
        
        // Check if any of the task tags match any of the search tags
        if (!task.tags.some(taskTag => 
          searchTags.some(searchTag => 
            taskTag.toLowerCase().includes(searchTag.toLowerCase())
        )
        )) {
          return false;
    }
      }
      
      return true;
    });
  }, [tasks, searchQuery, searchTags, selectedProjectId]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped = {
      [TaskStatus.TODO]: [] as Task[],
      [TaskStatus.IN_PROGRESS]: [] as Task[],
      [TaskStatus.DONE]: [] as Task[]
    };

    filteredTasks.forEach(task => {
      grouped[task.status].push(task);
    });

    return grouped;
  }, [filteredTasks]);

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid drop target
    if (!destination) return;

    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the new status from the destination droppableId
    const newStatus = destination.droppableId as TaskStatus;

    // Call the onTaskMove callback if provided
    if (onTaskMove) {
      onTaskMove(draggableId, newStatus);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className={cn(
        "flex-1 gap-4 sm:gap-6",
        isMobile 
          ? "flex flex-col space-y-4 pb-4" 
          : "grid grid-cols-1 md:grid-cols-3 p-4 sm:p-6"
      )}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0 }}
            className={cn(
              isMobile && "mobile-card"
            )}
          >
            <TaskColumn 
              title="To Do" 
              tasks={tasksByStatus[TaskStatus.TODO]}
              status={TaskStatus.TODO}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              isMobile && "mobile-card"
            )}
          >
            <TaskColumn 
              title="In Progress" 
              tasks={tasksByStatus[TaskStatus.IN_PROGRESS]}
              status={TaskStatus.IN_PROGRESS}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={cn(
              isMobile && "mobile-card"
            )}
          >
            <TaskColumn
              title="Done" 
              tasks={tasksByStatus[TaskStatus.DONE]}
              status={TaskStatus.DONE}
            />
          </motion.div>
        </DragDropContext>
      </div>
    </div>
  );
} 