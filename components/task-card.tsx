'use client';

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Calendar, Tag, Clock, GripVertical } from 'lucide-react';
import { Task, TaskStatus } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  index: number;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50',
  high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50'
};

export function TaskCard({ task, index }: TaskCardProps) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          initial={false}
          animate={{
            scale: snapshot.isDragging ? 1.05 : 1,
            rotate: snapshot.isDragging ? 2 : 0,
            boxShadow: snapshot.isDragging 
              ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' 
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25
          }}
          className={cn(
            'group relative bg-white dark:bg-slate-800 rounded-lg border p-4 mb-3',
            'hover:border-slate-300 dark:hover:border-slate-600',
            'transition-colors duration-200',
            isOverdue 
              ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
              : 'border-slate-200 dark:border-slate-700'
          )}
        >
          {/* Drag Handle */}
          <div 
            {...provided.dragHandleProps}
            className={cn(
              'absolute top-0 right-0 bottom-0 px-2 flex items-center justify-center',
              'cursor-grab active:cursor-grabbing',
              'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
            )}
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Priority Badge */}
          <div className="flex items-center justify-between mb-2">
            <span className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
              priorityColors[task.priority]
            )}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            {isOverdue && (
              <div className="flex items-center text-red-600 dark:text-red-400 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Overdue
              </div>
            )}
          </div>

          {/* Task Title */}
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 pr-8">
            {task.title}
          </h3>

          {/* Task Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
            {task.description}
          </p>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span className={cn(
                isOverdue && 'text-red-600 dark:text-red-400 font-medium'
              )}>
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
} 