'use client';

import { useState } from 'react';
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {task ? 'Edit Task' : 'Create Task'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800",
                    "border-slate-300 dark:border-slate-600",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                    "text-slate-900 dark:text-slate-100",
                    "placeholder-slate-400 dark:placeholder-slate-500"
                  )}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800",
                    "border-slate-300 dark:border-slate-600",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                    "text-slate-900 dark:text-slate-100",
                    "placeholder-slate-400 dark:placeholder-slate-500",
                    "min-h-[100px] resize-y"
                  )}
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800",
                      "border-slate-300 dark:border-slate-600",
                      "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                      "text-slate-900 dark:text-slate-100"
                    )}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="project"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Project
                  </label>
                  <select
                    id="project"
                    value={projectId || ''}
                    onChange={(e) => setProjectId(e.target.value || undefined)}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800",
                      "border-slate-300 dark:border-slate-600",
                      "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                      "text-slate-900 dark:text-slate-100"
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

              <div className="space-y-2">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800",
                    "border-slate-300 dark:border-slate-600",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                    "text-slate-900 dark:text-slate-100"
                  )}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800",
                    "border-slate-300 dark:border-slate-600",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                    "text-slate-900 dark:text-slate-100"
                  )}
                >
                  {Object.values(TaskStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    "text-slate-700 dark:text-slate-300",
                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                    "transition-colors"
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    "bg-blue-500 hover:bg-blue-600",
                    "text-white",
                    "transition-colors"
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