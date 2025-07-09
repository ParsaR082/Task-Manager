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
      <motion.div 
        className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700"
        layout
      >
        <div className="flex items-center gap-3">
          <motion.h2 
            className={cn('font-semibold text-lg', headerColors[status])}
            layout
          >
            {title}
          </motion.h2>
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium px-2 py-1 rounded-full min-w-[24px] text-center"
            layout
          >
            {tasks.length}
          </motion.span>
        </div>

        <div className="flex items-center gap-2">
          {onAddTask && (
            <motion.button
              onClick={onAddTask}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
              title="Add new task"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          )}
          <motion.button
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="More options"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

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
              scale: snapshot.isDraggingOver ? 1.02 : 1,
              transition: { 
                type: "spring",
                stiffness: 300,
                damping: 30
              }
            }}
            className={cn(
              'flex-1 p-4 min-h-[200px] relative',
              'transition-all duration-200',
              statusColors[status],
              snapshot.isDraggingOver && [
                'ring-2 ring-blue-400 dark:ring-blue-500 ring-opacity-50',
                'border-blue-300 dark:border-blue-600'
              ]
            )}
          >
            {/* Background Pulse Animation */}
            <AnimatePresence>
              {snapshot.isDraggingOver && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: [0.5, 0.3, 0.5],
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    opacity: {
                      repeat: Infinity,
                      duration: 2
                    },
                    scale: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  className="absolute inset-0 bg-blue-400/10 dark:bg-blue-500/10 rounded-lg pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Tasks List */}
            <motion.div 
              className="space-y-3 relative"
              layout
            >
              <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 1
                    }}
                  >
                    <TaskCard task={task} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </motion.div>

            {/* Empty State */}
            <AnimatePresence>
              {tasks.length === 0 && !snapshot.isDraggingOver && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  className="flex flex-col items-center justify-center h-32 text-center"
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-3"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Plus className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  </motion.div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    No tasks in {title.toLowerCase()}
                  </p>
                  {onAddTask && (
                    <motion.button
                      onClick={onAddTask}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add your first task
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drop Indicator */}
            <AnimatePresence>
              {snapshot.isDraggingOver && tasks.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -5, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      duration: 2
                    },
                    scale: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  className={cn(
                    'absolute inset-4 border-2 border-dashed rounded-lg',
                    'flex items-center justify-center',
                    'border-blue-300 dark:border-blue-600',
                    'bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  <motion.p 
                    className="text-blue-600 dark:text-blue-400 font-medium"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2
                    }}
                  >
                    Drop task here
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </StrictModeDroppable>
    </motion.div>
  );
} 