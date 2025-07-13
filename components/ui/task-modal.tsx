'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, TaskStatus, TaskPriority, Project } from '@/lib/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  task?: Task;
  projects?: Project[];
}

export function TaskModal({ isOpen, onClose, onSave, task, projects = [] }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || TaskStatus.TODO);
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [projectId, setProjectId] = useState<string | undefined>(task?.projectId);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      dueDate,
      status: TaskStatus.TODO,
      priority,
      projectId,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "bg-white dark:bg-slate-900 shadow-xl overflow-hidden",
              isMobile 
                ? "mobile-modal max-h-[90vh]" 
                : "w-full max-w-lg rounded-2xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mobile-p border-b border-slate-200 dark:border-slate-700">
              <h2 className="mobile-text-xl font-semibold text-slate-900 dark:text-slate-100">
                {task ? 'Edit Task' : 'Create Task'}
              </h2>
              <button
                onClick={onClose}
                className="touch-icon-button text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mobile-p mobile-section-spacing overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-none scrollbar-hidden">
              <div className="mobile-item-spacing">
                <label
                  htmlFor="title"
                  className="block mobile-body font-medium text-slate-700 dark:text-slate-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={cn(
                    "w-full mobile-px py-3 rounded-lg border bg-white dark:bg-slate-800",
                    "border-slate-300 dark:border-slate-600",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                    "text-slate-900 dark:text-slate-100 mobile-body",
                    "placeholder-slate-400 dark:placeholder-slate-500",
                    "touch-target"
                  )}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="mobile-item-spacing">
                <label
                  htmlFor="description"
                  className="block mobile-body font-medium text-slate-700 dark:text-slate-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={cn(
                    "w-full mobile-px py-3 rounded-lg border bg-white dark:bg-slate-800",
                    "border-slate-300 dark:border-slate-600",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                    "text-slate-900 dark:text-slate-100 mobile-body",
                    "placeholder-slate-400 dark:placeholder-slate-500",
                    "min-h-[100px] resize-y"
                  )}
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mobile-item-spacing">
                  <label
                    htmlFor="priority"
                    className="block mobile-body font-medium text-slate-700 dark:text-slate-300"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className={cn(
                      "w-full mobile-px py-3 rounded-lg border bg-white dark:bg-slate-800",
                      "border-slate-300 dark:border-slate-600",
                      "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                      "text-slate-900 dark:text-slate-100 mobile-body",
                      "touch-target"
                    )}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="mobile-item-spacing">
                  <label
                    htmlFor="project"
                    className="block mobile-body font-medium text-slate-700 dark:text-slate-300"
                  >
                    Project
                  </label>
                  <select
                    id="project"
                    value={projectId || ''}
                    onChange={(e) => setProjectId(e.target.value || undefined)}
                    className={cn(
                      "w-full mobile-px py-3 rounded-lg border bg-white dark:bg-slate-800",
                      "border-slate-300 dark:border-slate-600",
                      "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                      "text-slate-900 dark:text-slate-100 mobile-body",
                      "touch-target"
                    )}
                  >
                    <option value="">No Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mobile-item-spacing">
                <label
                  htmlFor="dueDate"
                  className="block mobile-body font-medium text-slate-700 dark:text-slate-300"
                >
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={cn(
                    "w-full mobile-px py-3 rounded-lg border bg-white dark:bg-slate-800",
                    "border-slate-300 dark:border-slate-600",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                    "text-slate-900 dark:text-slate-100 mobile-body",
                    "touch-target"
                  )}
                />
              </div>

              <div className="mobile-item-spacing">
                <label
                  htmlFor="status"
                  className="block mobile-body font-medium text-slate-700 dark:text-slate-300"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className={cn(
                    "w-full mobile-px py-3 rounded-lg border bg-white dark:bg-slate-800",
                    "border-slate-300 dark:border-slate-600",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                    "text-slate-900 dark:text-slate-100 mobile-body",
                    "touch-target"
                  )}
                >
                  <option value={TaskStatus.TODO}>To Do</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.DONE}>Done</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    "touch-button order-2 sm:order-1",
                    "text-slate-700 dark:text-slate-300",
                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                    "border border-slate-300 dark:border-slate-600"
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cn(
                    "touch-button order-1 sm:order-2",
                    "bg-blue-500 hover:bg-blue-600",
                    "text-white border border-blue-500 hover:border-blue-600",
                    "focus:ring-blue-500"
                  )}
                >
                  {task ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 