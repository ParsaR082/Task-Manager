'use client';

import React from 'react';
import { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './task-card';
import { Plus, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StrictModeDroppable } from './strict-mode-droppable';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask?: () => void;
}

const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50',
  [TaskStatus.IN_PROGRESS]: 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20',
  [TaskStatus.DONE]: 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
};

const headerColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'text-slate-700 dark:text-slate-300',
  [TaskStatus.IN_PROGRESS]: 'text-blue-700 dark:text-blue-300',
  [TaskStatus.DONE]: 'text-green-700 dark:text-green-300'
};

export function TaskColumn({ title, status, tasks, onAddTask }: TaskColumnProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full min-h-0"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <h2 className={cn('font-semibold text-lg', headerColors[status])}>
            {title}
          </h2>
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium px-2 py-1 rounded-full min-w-[24px] text-center"
          >
            {tasks.length}
          </motion.span>
        </div>

        <div className="flex items-center gap-2">
          {onAddTask && (
            <button
              onClick={onAddTask}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
              title="Add new task"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Droppable Area */}
      <StrictModeDroppable droppableId={status}>
        {(provided, snapshot) => (
          <motion.div
            ref={provided.innerRef}
            {...provided.droppableProps}
            animate={{
              backgroundColor: snapshot.isDraggingOver 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'transparent',
              transition: { duration: 0.2 }
            }}
            className={cn(
              'flex-1 p-4 min-h-[200px] transition-all duration-200',
              statusColors[status],
              snapshot.isDraggingOver && [
                'ring-2 ring-blue-400 dark:ring-blue-500 ring-opacity-50',
                'border-blue-300 dark:border-blue-600'
              ]
            )}
          >
            {/* Tasks List */}
            <AnimatePresence mode="popLayout">
              <motion.div 
                className="space-y-3"
                layout
              >
                {tasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            <AnimatePresence>
              {tasks.length === 0 && !snapshot.isDraggingOver && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center h-32 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    No tasks in {title.toLowerCase()}
                  </p>
                  {onAddTask && (
                    <button
                      onClick={onAddTask}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      Add your first task
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drag Over Indicator */}
            <AnimatePresence>
              {snapshot.isDraggingOver && tasks.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    'absolute inset-4 border-2 border-dashed rounded-lg',
                    'flex items-center justify-center',
                    'border-blue-300 dark:border-blue-600',
                    'bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Drop task here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </StrictModeDroppable>
    </motion.div>
  );
} 