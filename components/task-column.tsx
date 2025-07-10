'use client';

import React from 'react';
import { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './task-card';
import { Plus, MoreVertical, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StrictModeDroppable } from './strict-mode-droppable';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask?: () => void;
  searchQuery?: string;
}

const statusColors: Record<TaskStatus, {
  border: string;
  bg: string;
  text: string;
  icon: string;
  accent: string;
}> = {
  [TaskStatus.TODO]: {
    border: 'border-slate-200 dark:border-slate-700',
    bg: 'bg-slate-50/80 dark:bg-slate-800/50',
    text: 'text-slate-700 dark:text-slate-300',
    icon: 'text-slate-400 dark:text-slate-500',
    accent: 'bg-slate-600 dark:bg-slate-400'
  },
  [TaskStatus.IN_PROGRESS]: {
    border: 'border-blue-200 dark:border-blue-800/40',
    bg: 'bg-blue-50/80 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    icon: 'text-blue-400 dark:text-blue-500',
    accent: 'bg-blue-500 dark:bg-blue-400'
  },
  [TaskStatus.DONE]: {
    border: 'border-green-200 dark:border-green-800/40',
    bg: 'bg-green-50/80 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-300',
    icon: 'text-green-400 dark:text-green-500',
    accent: 'bg-green-500 dark:bg-green-400'
  }
};

export function TaskColumn({ title, status, tasks, onAddTask, searchQuery = '' }: TaskColumnProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full min-h-0"
    >
      {/* Column Header */}
      <motion.div 
        className={cn(
          "flex items-center justify-between p-4 border-b",
          statusColors[status].border
        )}
        layout
      >
        <div className="flex items-center gap-3">
          <motion.div className="flex items-center gap-2">
            <motion.div 
              className={cn(
                "h-3 w-3 rounded-full",
                statusColors[status].accent
              )}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.h2 
              className={cn('font-semibold text-lg', statusColors[status].text)}
              layout
            >
              {title}
            </motion.h2>
          </motion.div>
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={cn(
              "bg-white dark:bg-slate-900 text-sm font-medium px-2.5 py-1 rounded-full min-w-[28px] text-center shadow-sm",
              statusColors[status].text,
              statusColors[status].border
            )}
            layout
          >
            {tasks.length}
          </motion.span>
        </div>

        <div className="flex items-center gap-2">
          {onAddTask && (
            <motion.button
              onClick={onAddTask}
              className={cn(
                "p-2 rounded-full transition-colors",
                statusColors[status].icon,
                "hover:bg-white dark:hover:bg-slate-800"
              )}
              title="Add new task"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          )}
          <motion.button
            className={cn(
              "p-2 rounded-full transition-colors",
              statusColors[status].icon,
              "hover:bg-white dark:hover:bg-slate-800"
            )}
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
                ? 'rgba(59, 130, 246, 0.08)' 
                : 'transparent',
              scale: snapshot.isDraggingOver ? 1.02 : 1,
              transition: { 
                type: "spring",
                stiffness: 350,
                damping: 25
              }
            }}
            className={cn(
              'flex-1 p-4 min-h-[200px] relative overflow-y-auto',
              'transition-all duration-200',
              statusColors[status].bg,
              snapshot.isDraggingOver && [
                'ring-2 ring-blue-400/30 dark:ring-blue-500/30',
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
                    opacity: [0.3, 0.15, 0.3],
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
                      stiffness: 400,
                      damping: 20
                    }
                  }}
                  className={cn(
                    "absolute inset-0 pointer-events-none rounded-b-2xl",
                    status === TaskStatus.TODO 
                      ? "bg-slate-400/10 dark:bg-slate-500/10" 
                      : status === TaskStatus.IN_PROGRESS
                        ? "bg-blue-400/10 dark:bg-blue-500/10"
                        : "bg-green-400/10 dark:bg-green-500/10"
                  )}
                />
              )}
            </AnimatePresence>

            {/* Tasks List */}
            <motion.div 
              className="space-y-4 relative"
              layout
            >
              <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                      mass: 0.8,
                      delay: index * 0.05
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
                    stiffness: 350,
                    damping: 25
                  }}
                  className="flex flex-col items-center justify-center h-32 text-center"
                >
                  {searchQuery ? (
                    <motion.div 
                      className="flex flex-col items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                        "bg-white/80 dark:bg-slate-800/80 shadow-sm"
                      )}>
                        <Search className={cn("w-5 h-5", statusColors[status].icon)} />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No matching tasks in {title.toLowerCase()}
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div 
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                          "bg-white/80 dark:bg-slate-800/80 shadow-sm"
                        )}
                        whileHover={{ scale: 1.15, rotate: 180 }}
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(99, 102, 241, 0)",
                            "0 0 0 10px rgba(99, 102, 241, 0.1)",
                            "0 0 0 0 rgba(99, 102, 241, 0)"
                          ]
                        }}
                        transition={{ 
                          rotate: { type: "spring", stiffness: 300, damping: 15 },
                          boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                        }}
                      >
                        <Plus className={cn("w-5 h-5", statusColors[status].icon)} />
                      </motion.div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        No tasks in {title.toLowerCase()}
                      </p>
                      {onAddTask && (
                        <motion.button
                          onClick={onAddTask}
                          className={cn(
                            "text-sm font-medium px-3 py-1.5 rounded-full",
                            "bg-white dark:bg-slate-800 shadow-sm",
                            statusColors[status].text
                          )}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add your first task
                        </motion.button>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drop Indicator */}
            <AnimatePresence>
              {snapshot.isDraggingOver && tasks.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -8, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut"
                    },
                    scale: {
                      type: "spring",
                      stiffness: 400,
                      damping: 20
                    }
                  }}
                  className={cn(
                    'absolute inset-4 border-2 border-dashed rounded-xl',
                    'flex items-center justify-center',
                    status === TaskStatus.TODO 
                      ? "border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30" 
                      : status === TaskStatus.IN_PROGRESS
                        ? "border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/30"
                        : "border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-900/30"
                  )}
                >
                  <motion.div 
                    className={cn(
                      "flex flex-col items-center gap-2 px-4 py-2 rounded-lg",
                      "bg-white/90 dark:bg-slate-800/90 shadow-sm"
                    )}
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }}
                  >
                    <ChevronDown className={cn("w-5 h-5", statusColors[status].text)} />
                    <p className={cn("text-sm font-medium", statusColors[status].text)}>
                      Drop here
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </StrictModeDroppable>
    </motion.div>
  );
} 
