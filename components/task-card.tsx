'use client';

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Calendar, User, Tag, Clock } from 'lucide-react';
import { Task } from '@/lib/types';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  index: number;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200'
};

const priorityColorsDark = {
  low: 'dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  medium: 'dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  high: 'dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
  urgent: 'dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
};

export function TaskCard({ task, index }: TaskCardProps) {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'done';
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={clsx(
            'group relative bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-3 transition-all duration-200 cursor-grab active:cursor-grabbing',
            'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600',
            'hover-scale animate-fade-in',
            snapshot.isDragging && 'shadow-lg rotate-2 scale-105',
            isOverdue && 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
          )}
        >
          {/* Priority Badge */}
          <div className="flex items-center justify-between mb-2">
            <span
              className={clsx(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
                priorityColors[task.priority],
                priorityColorsDark[task.priority]
              )}
            >
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
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
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
              <span className={clsx(isOverdue && 'text-red-600 dark:text-red-400 font-medium')}>
                {new Date(task.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {task.assignee && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span className="truncate max-w-[100px]">
                  {task.assignee.split(' ')[0]}
                </span>
              </div>
            )}
          </div>

          {/* Drag Indicator */}
          <div 
            className={clsx(
              'absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity',
              'w-2 h-8 bg-slate-300 dark:bg-slate-600 rounded-full',
              'before:content-[""] before:absolute before:top-1 before:left-0 before:w-2 before:h-1 before:bg-slate-400 dark:before:bg-slate-500 before:rounded-full',
              'after:content-[""] after:absolute after:bottom-1 after:left-0 after:w-2 after:h-1 after:bg-slate-400 dark:after:bg-slate-500 after:rounded-full'
            )}
          />
        </div>
      )}
    </Draggable>
  );
} 