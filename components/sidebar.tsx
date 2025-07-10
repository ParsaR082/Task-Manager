'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  Plus,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Command,
  PanelLeft,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/types';

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  projects?: Project[];
  selectedProjectId?: string | null;
  onProjectSelect?: (projectId: string | null) => void;
}

export function Sidebar({ 
  collapsed = false, 
  onCollapsedChange,
  projects = [],
  selectedProjectId = null,
  onProjectSelect
}: SidebarProps) {
  const [localCollapsed, setLocalCollapsed] = useState(collapsed);
  const pathname = usePathname();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/', active: pathname === '/' },
    { icon: Calendar, label: 'Calendar', href: '/calendar', active: pathname === '/calendar' },
  ];

  // Default projects if none provided
  const projectItems = projects.length > 0 ? projects : [
    { id: 'project-1', name: 'Website Redesign', color: 'bg-blue-500', tasksCount: 12 },
    { id: 'project-2', name: 'Mobile App', color: 'bg-green-500', tasksCount: 8 },
    { id: 'project-3', name: 'Marketing Campaign', color: 'bg-purple-500', tasksCount: 5 },
    { id: 'project-4', name: 'API Development', color: 'bg-orange-500', tasksCount: 15 },
  ];

  const handleToggleCollapse = () => {
    const newCollapsed = !localCollapsed;
    setLocalCollapsed(newCollapsed);
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsed);
    }
  };

  const handleProjectClick = (projectId: string | null) => {
    if (onProjectSelect) {
      onProjectSelect(projectId);
    }
  };

  return (
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
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Add project"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </motion.button>
              </div>
              
              <div className="space-y-1.5">
                {/* All Projects Option */}
                <motion.div
                  onClick={() => handleProjectClick(null)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                    "transition-all duration-200",
                    "cursor-pointer group border",
                    "hover:shadow-sm",
                    selectedProjectId === null
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-800/40 shadow-sm"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent hover:border-slate-200 dark:hover:border-slate-700/70"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={cn(
                    'w-3 h-3 rounded-full shadow-sm', 
                    'bg-gradient-to-r from-blue-400 to-purple-400',
                    'ring-2 ring-white dark:ring-slate-800'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      selectedProjectId === null
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-slate-700 dark:text-slate-300"
                    )}>
                      All Projects <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full ml-1">
                        {projectItems.reduce((sum, project) => sum + project.tasksCount, 0)}
                      </span>
                    </p>
                  </div>
                  <motion.span 
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      selectedProjectId === null
                        ? "bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                      selectedProjectId === null ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
                    )}
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    style={{ display: "none" }} /* Hide this since we're showing count inline */
                  >
                    {projectItems.reduce((sum, project) => sum + project.tasksCount, 0)}
                  </motion.span>
                </motion.div>
                
                {/* Project List */}
                {projectItems.map((project, index) => (
                  <motion.div
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                      "transition-all duration-200",
                      "cursor-pointer group border",
                      "hover:shadow-sm",
                      selectedProjectId === project.id
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-800/40 shadow-sm"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent hover:border-slate-200 dark:hover:border-slate-700/70"
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn(
                      'w-3 h-3 rounded-full shadow-sm', 
                      project.color,
                      'ring-2 ring-white dark:ring-slate-800'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        selectedProjectId === project.id
                          ? "text-blue-600 dark:text-blue-300"
                          : "text-slate-700 dark:text-slate-300"
                      )}>
                        {project.name} <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full ml-1">
                          {project.tasksCount}
                        </span>
                      </p>
                    </div>
                    <motion.span 
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        selectedProjectId === project.id
                          ? "bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                        selectedProjectId === project.id ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
                      )}
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      style={{ display: "none" }} /* Hide this since we're showing count inline */
                    >
                      {project.tasksCount}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Projects Section */}
        <AnimatePresence>
          {localCollapsed && (
            <motion.div 
              className="mt-8 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={cn(
                  "p-2 rounded-lg mb-2",
                  selectedProjectId === null
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleProjectClick(null)}
                title="All Projects"
              >
                <Layers className="w-5 h-5" />
              </motion.div>
              
              {projectItems.map((project) => (
                <motion.div
                  key={project.id}
                  className={cn(
                    "p-2 rounded-lg mb-2 relative",
                    selectedProjectId === project.id
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleProjectClick(project.id)}
                  title={project.name}
                >
                  <FolderKanban className="w-5 h-5" />
                  <div className={cn(
                    'absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full', 
                    project.color,
                    'ring-2 ring-white dark:ring-slate-900'
                  )} />
                </motion.div>
              ))}
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
              >
                <Plus className="w-5 h-5" />
                <span>Create Task</span>
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
          href="/settings"
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

      {/* Mobile Overlay */}
      <AnimatePresence>
        {!localCollapsed && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleToggleCollapse}
          />
        )}
      </AnimatePresence>
    </aside>
  );
} 