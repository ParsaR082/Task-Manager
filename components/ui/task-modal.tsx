'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, TaskStatus, TaskPriority, Project } from '@/lib/types';
import { useProjects } from '@/lib/project-context';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
];

const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
  { value: TaskStatus.TODO, label: 'To Do', color: 'bg-slate-500' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-amber-500' },
  { value: TaskStatus.DONE, label: 'Done', color: 'bg-green-500' },
];

export function TaskModal({ isOpen, onClose, onSave, isLoading = false }: TaskModalProps) {
  const { projects } = useProjects();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  
  // Form validation
  const [titleError, setTitleError] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus(TaskStatus.TODO);
      setPriority('medium');
      setProjectId(undefined);
      setTitleError('');
    }
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setTitleError('Task title is required');
      return;
    }
    
    // Create new task
    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      projectId,
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 10, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Create New Task
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Task Title */}
              <div className="space-y-2">
                <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="task-title"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (e.target.value.trim()) setTitleError('');
                    }}
                    placeholder="Enter task title"
                    className={cn(
                      "w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      "transition-all duration-200",
                      titleError 
                        ? "border-red-500 dark:border-red-500" 
                        : "border-slate-300 dark:border-slate-600"
                    )}
                    autoFocus
                  />
                  {titleError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {titleError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {titleError}
                  </motion.p>
                )}
              </div>
              
              {/* Task Description */}
              <div className="space-y-2">
                <label htmlFor="task-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  id="task-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[80px]"
                />
              </div>
              
              {/* Due Date */}
              <div className="space-y-2">
                <label htmlFor="due-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {statusOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2",
                        status === option.value 
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                      onClick={() => setStatus(option.value)}
                    >
                      <span className={cn("w-2 h-2 rounded-full", option.color)} />
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {priorityOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2",
                        priority === option.value 
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                      onClick={() => setPriority(option.value)}
                    >
                      <span className={cn("w-2 h-2 rounded-full", option.color)} />
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Project */}
              <div className="space-y-2">
                <label htmlFor="project" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Project
                </label>
                <select
                  id="project"
                  value={projectId || ''}
                  onChange={(e) => setProjectId(e.target.value || undefined)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">None</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors",
                    "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
                    "flex items-center gap-2",
                    isLoading && "opacity-80 cursor-not-allowed"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Task'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 