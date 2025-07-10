'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  BarChart3, 
  FolderKanban,
  Command,
  PanelLeft,
  Layers,
  Plus,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '@/components/project-provider';
import { useTasks } from '@/lib/task-context';
import { TaskModal } from '@/components/ui/task-modal';
import { ProjectModal } from '@/components/ui/project-modal';

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ 
  collapsed = false, 
  onCollapsedChange,
}: SidebarProps) {
  const { projects, selectedProjectId, setSelectedProjectId, addProject } = useProjects();
  const { addTask } = useTasks();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [localCollapsed, setLocalCollapsed] = useState(collapsed);
  const pathname = usePathname();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: pathname === '/dashboard' },
    { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar', active: pathname === '/dashboard/calendar' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics', active: pathname === '/dashboard/analytics' },
  ];

  const handleToggleCollapse = () => {
    const newCollapsed = !localCollapsed;
    setLocalCollapsed(newCollapsed);
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsed);
    }
  };

  const handleProjectClick = (projectId: string | undefined) => {
    setSelectedProjectId(projectId);
  };

  return (
    <>
      <aside 
        className={cn(
          'relative flex flex-col bg-white/90 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-700',
          'backdrop-blur-md shadow-sm transition-all duration-300 ease-in-out',
          localCollapsed ? 'w-20' : 'w-64',
          'h-screen overflow-hidden'
        )}
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700"
          layout
        >
          <AnimatePresence mode="wait">
            {!localCollapsed ? (
              <motion.div 
                key="expanded"
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Command className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-bold text-xl text-slate-900 dark:text-slate-100">
                  TaskFlow
                </h1>
              </motion.div>
            ) : (
              <motion.div 
                key="collapsed"
                className="flex items-center justify-center w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Command className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            onClick={handleToggleCollapse}
            className={cn(
              "p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800",
              "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
              "transition-colors shadow-sm"
            )}
            title={localCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PanelLeft className={cn(
              "w-4 h-4 transition-transform duration-300",
              localCollapsed && "rotate-180"
            )} />
          </motion.button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="space-y-1.5">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  'hover:shadow-sm border border-transparent',
                  item.active
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-800/40 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60',
                  localCollapsed && 'justify-center'
                )}
                title={localCollapsed ? item.label : undefined}
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    item.active 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-slate-500 dark:text-slate-400"
                  )} />
                </motion.div>
                <AnimatePresence mode="wait">
                  {!localCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </div>

          {/* Projects Section */}
          <AnimatePresence>
            {!localCollapsed && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between px-3 mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Projects
                  </h3>
                  <motion.button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    title="Add project"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  </motion.button>
                </div>

                {/* Project List */}
                <div className="space-y-1">
                  <button
                    onClick={() => handleProjectClick(undefined)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      selectedProjectId === undefined
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    <Layers className="w-4 h-4" />
                    All Projects
                  </button>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectClick(project.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        selectedProjectId === project.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      <FolderKanban className="w-4 h-4" />
                      {project.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions */}
          <AnimatePresence>
            {!localCollapsed && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-3">
                  Quick Actions
                </h3>
                <motion.button 
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                    "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                    "dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600",
                    "text-white shadow-md hover:shadow-lg transition-all duration-200"
                  )}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsTaskModalOpen(true)}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Task</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed Quick Actions */}
          <AnimatePresence>
            {localCollapsed && (
              <motion.div 
                className="mt-4 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className={cn(
                    "p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600",
                    "text-white shadow-md hover:shadow-lg transition-all duration-200"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsTaskModalOpen(true)}
                  title="Create Task"
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Settings */}
        <motion.div 
          className="p-3 border-t border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50"
          layout
        >
          <Link
            href="/dashboard/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
              'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
              'transition-all duration-200 hover:shadow-sm',
              localCollapsed && 'justify-center'
            )}
            title={localCollapsed ? 'Settings' : undefined}
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Settings className="w-5 h-5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
            </motion.div>
            <AnimatePresence mode="wait">
              {!localCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </motion.div>
      </aside>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={addTask}
        projects={projects}
      />

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={addProject}
      />
    </>
  );
} 