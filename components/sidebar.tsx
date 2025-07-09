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
  FolderKanban
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  const [localCollapsed, setLocalCollapsed] = useState(collapsed);
  const pathname = usePathname();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/', active: pathname === '/' },
    { icon: FolderKanban, label: 'Task Board', href: '/board', active: pathname === '/board' },
    { icon: CheckSquare, label: 'My Tasks', href: '/tasks', active: pathname === '/tasks' },
    { icon: Calendar, label: 'Calendar', href: '/calendar', active: pathname === '/calendar' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics', active: pathname === '/analytics' },
    { icon: Users, label: 'Team', href: '/team', active: pathname === '/team' },
  ];

  const projectItems = [
    { name: 'Website Redesign', color: 'bg-blue-500', tasksCount: 12 },
    { name: 'Mobile App', color: 'bg-green-500', tasksCount: 8 },
    { name: 'Marketing Campaign', color: 'bg-purple-500', tasksCount: 5 },
    { name: 'API Development', color: 'bg-orange-500', tasksCount: 15 },
  ];

  const handleToggleCollapse = () => {
    const newCollapsed = !localCollapsed;
    setLocalCollapsed(newCollapsed);
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsed);
    }
  };

  return (
    <aside 
      className={clsx(
        'relative flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out',
        localCollapsed ? 'w-16' : 'w-64',
        'h-screen overflow-hidden'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        {!localCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl text-slate-900 dark:text-slate-100">
              TaskFlow
            </h1>
          </div>
        )}
        
        <button
          onClick={handleToggleCollapse}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={localCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {localCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                item.active
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                localCollapsed && 'justify-center'
              )}
              title={localCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!localCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Projects Section */}
        {!localCollapsed && (
          <div className="mt-8">
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Projects
              </h3>
              <button
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Add project"
              >
                <Plus className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-1">
              {projectItems.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                >
                  <div className={clsx('w-3 h-3 rounded-full', project.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {project.name}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.tasksCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!localCollapsed && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-3">
              Quick Actions
            </h3>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Create Task</span>
            </button>
          </div>
        )}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700">
        <Link
          href="/settings"
          className={clsx(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
            localCollapsed && 'justify-center'
          )}
          title={localCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!localCollapsed && <span>Settings</span>}
        </Link>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={clsx(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity',
          localCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        onClick={handleToggleCollapse}
      />
    </aside>
  );
} 