'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/lib/types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id' | 'tasksCount'>) => void;
  project?: Project;
}

const colorOptions = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
  { name: 'Pink', value: 'bg-pink-500' },
];

export function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [color, setColor] = useState(project?.color || colorOptions[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      color,
      createdAt: project?.createdAt || new Date().toISOString(),
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
                {project ? 'Edit Project' : 'Create Project'}
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
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800",
                    "border-slate-300 dark:border-slate-600",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                    "text-slate-900 dark:text-slate-100",
                    "placeholder-slate-400 dark:placeholder-slate-500"
                  )}
                  placeholder="Enter project name"
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
                  placeholder="Enter project description"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setColor(option.value)}
                      className={cn(
                        "w-full aspect-square rounded-lg relative",
                        option.value,
                        color === option.value && "ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-blue-500"
                      )}
                      title={option.name}
                    >
                      {color === option.value && (
                        <Check className="absolute inset-0 m-auto w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
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
                  {project ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 