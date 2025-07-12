'use client';

import { useState, useEffect } from 'react';
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
                ? "mobile-modal max-h-[85vh]" 
                : "w-full max-w-lg rounded-2xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mobile-p border-b border-slate-200 dark:border-slate-700">
              <h2 className="mobile-text-xl font-semibold text-slate-900 dark:text-slate-100">
                {project ? 'Edit Project' : 'Create Project'}
              </h2>
              <button
                onClick={onClose}
                className="touch-icon-button text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mobile-p mobile-section-spacing overflow-y-auto max-h-[calc(85vh-120px)] sm:max-h-none">
              <div className="mobile-item-spacing">
                <label
                  htmlFor="name"
                  className="block mobile-body font-medium text-slate-700 dark:text-slate-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "w-full mobile-px py-3 rounded-lg border bg-white dark:bg-slate-800",
                    "border-slate-300 dark:border-slate-600",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent",
                    "text-slate-900 dark:text-slate-100 mobile-body",
                    "placeholder-slate-400 dark:placeholder-slate-500",
                    "touch-target"
                  )}
                  placeholder="Enter project name"
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
                  placeholder="Enter project description"
                />
              </div>

              <div className="mobile-item-spacing">
                <label className="block mobile-body font-medium text-slate-700 dark:text-slate-300">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setColor(option.value)}
                      className={cn(
                        "w-full aspect-square rounded-lg relative touch-target",
                        "transition-all duration-200",
                        option.value,
                        color === option.value && "ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-blue-500 scale-110"
                      )}
                      title={option.name}
                    >
                      {color === option.value && (
                        <Check className="absolute inset-0 m-auto w-5 h-5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
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