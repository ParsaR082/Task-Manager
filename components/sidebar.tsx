'use client';

import React, { useState, useEffect } from 'react';
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
  Settings,
  X
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
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export function Sidebar({ 
  collapsed = false, 
  onCollapsedChange,
  isMobileOpen = false,
  onMobileToggle,
}: SidebarProps) {
  const { projects, selectedProjectId, setSelectedProjectId, addProject } = useProjects();
  const { addTask } = useTasks();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [localCollapsed, setLocalCollapsed] = useState(collapsed);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile && isMobileOpen && onMobileToggle) {
      onMobileToggle();
    }
  }, [pathname, isMobile, isMobileOpen, onMobileToggle]);

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

  const handleMobileClose = () => {
    if (onMobileToggle) {
      onMobileToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-nav-overlay"
            onClick={handleMobileClose}
          />
        )}
      </AnimatePresence>

      <aside 
        className={cn(
          'relative flex flex-col bg-white/90 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-700',
          'backdrop-blur-md shadow-sm transition-all duration-300 ease-in-out',
          // Desktop behavior
          'lg:relative lg:translate-x-0',
          !isMobile && (localCollapsed ? 'w-20' : 'w-64'),
          'h-screen overflow-hidden',
          // Mobile behavior
          isMobile && [
            'mobile-nav-drawer',
            'w-64',
            isMobileOpen ? 'open' : 'closed'
          ]
        )}
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mobile-p border-b border-slate-200 dark:border-slate-700"
          layout
        >
          <AnimatePresence mode="wait">
            {(!localCollapsed || isMobile) ? (
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
                <h1 className="font-bold mobile-text-xl text-slate-900 dark:text-slate-100">
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
          
          <div className="flex items-center gap-2">
            {/* Mobile close button */}
            {isMobile && (
              <motion.button
                onClick={handleMobileClose}
                className="touch-icon-button text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
            
            {/* Desktop collapse button */}
            {!isMobile && (
              <motion.button
                onClick={handleToggleCollapse}
                className="touch-icon-button text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                title={localCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PanelLeft className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  localCollapsed && "rotate-180"
                )} />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 mobile-px py-4 overflow-y-auto scrollbar-hidden">
          <div className="mobile-item-spacing">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 mobile-px py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  'hover:shadow-sm border border-transparent touch-target',
                  item.active
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-800/40 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60',
                  (!isMobile && localCollapsed) && 'justify-center'
                )}
                title={(!isMobile && localCollapsed) ? item.label : undefined}
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
                  {(isMobile || !localCollapsed) && (
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
            {(isMobile || !localCollapsed) && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mobile-px mb-3">
                  <h3 className="mobile-caption font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Projects
                  </h3>
                  <motion.button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="touch-icon-button hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    title="Add project"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  </motion.button>
                </div>

                {/* Project List */}
                <div className="mobile-item-spacing">
                  <button
                    onClick={() => handleProjectClick(undefined)}
                    className={cn(
                      'w-full flex items-center gap-2 mobile-px py-2 rounded-lg mobile-body font-medium transition-colors touch-target',
                      selectedProjectId === undefined
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    )}
                  >
                    <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span>All Projects</span>
                  </button>

                  {projects.map((project) => (
                    <motion.button
                      key={project.id}
                      onClick={() => handleProjectClick(project.id)}
                      className={cn(
                        'w-full flex items-center gap-2 mobile-px py-2 rounded-lg mobile-body font-medium transition-colors touch-target',
                        selectedProjectId === project.id
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={cn("w-3 h-3 rounded-full", project.color)} />
                      <span className="truncate">{project.name}</span>
                      {project.tasksCount !== undefined && (
                        <span className="ml-auto text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                          {project.tasksCount}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 dark:border-slate-700 mobile-p">
          <div className="mobile-item-spacing">
            <motion.button
              onClick={() => setIsTaskModalOpen(true)}
              className={cn(
                'w-full flex items-center gap-2 mobile-px py-3 rounded-lg mobile-body font-medium',
                'bg-blue-500 hover:bg-blue-600 text-white transition-colors touch-target',
                (!isMobile && localCollapsed) && 'justify-center'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              <AnimatePresence mode="wait">
                {(isMobile || !localCollapsed) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    New Task
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={addTask}
        projects={projects}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={addProject}
      />
    </>
  );
} 