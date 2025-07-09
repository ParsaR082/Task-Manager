'use client';

import React, { useState, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '@/lib/types';
import { TaskColumn } from './task-column';
import { motion } from 'framer-motion';
import { getTasksByStatus } from '@/lib/data';

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
}

const columns = [
  { id: 'backlog' as TaskStatus, title: 'Backlog' },
  { id: 'in-progress' as TaskStatus, title: 'In Progress' },
  { id: 'done' as TaskStatus, title: 'Done' }
];

export function TaskBoard({ tasks, onTaskMove }: TaskBoardProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  
  // Group tasks by status
  const tasksByStatus = React.useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      backlog: [],
      'in-progress': [],
      done: []
    };

    localTasks.forEach(task => {
      if (groups[task.status]) {
        groups[task.status].push(task);
      }
    });

    return groups;
  }, [localTasks]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    // No destination (dropped outside)
    if (!destination) {
      return;
    }

    // Dropped in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    // Update local state
    setLocalTasks(prevTasks => {
      const newTasks = [...prevTasks];
      const taskIndex = newTasks.findIndex(task => task.id === draggableId);

      if (taskIndex !== -1) {
        newTasks[taskIndex] = {
          ...newTasks[taskIndex],
          status: destinationStatus
        };
      }

      return newTasks;
    });

    // Call external handler if provided
    if (onTaskMove) {
      onTaskMove(draggableId, destinationStatus);
    }
  }, [onTaskMove]);

  const handleAddTask = useCallback((status: TaskStatus) => {
    // For now, just log the action
    // In a real app, this would open a modal or form
    console.log(`Add task to ${status}`);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Board Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Task Board
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your tasks with drag and drop
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium">{localTasks.length}</span> total tasks
          </div>
        </div>
      </motion.div>

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex flex-1 gap-6 p-6 overflow-x-auto">
            {columns.map((column, index) => (
              <motion.div 
                key={column.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex-1 min-w-[320px] max-w-[400px]"
              >
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 h-full shadow-sm hover-scale">
                  <TaskColumn
                    title={column.title}
                    status={column.id}
                    tasks={tasksByStatus[column.id]}
                    onAddTask={() => handleAddTask(column.id)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </motion.div>
  );
} 