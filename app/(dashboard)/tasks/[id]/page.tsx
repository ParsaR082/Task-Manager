'use client';

import { requireAuth } from '@/lib/server-utils';
import prisma from '@/lib/prisma';
import { TaskStatus } from '@/lib/types';
import { 
  Calendar, 
  Clock, 
  Tag, 
  CheckCircle2, 
  ArrowLeft,
  AlertTriangle,
  Edit3,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Map Prisma TaskStatus to our frontend TaskStatus
function mapTaskStatus(status: any): TaskStatus {
  const mapping: Record<string, TaskStatus> = {
    'TODO': TaskStatus.TODO,
    'IN_PROGRESS': TaskStatus.IN_PROGRESS,
    'DONE': TaskStatus.DONE
  };
  return mapping[status] || TaskStatus.TODO;
}

// Format date nicely
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Priority styling
const priorityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50',
  high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50'
};

// Status styling
const statusColors = {
  [TaskStatus.TODO]: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
  [TaskStatus.DONE]: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50'
};

async function TaskDetails({ id }: { id: string }) {
  // Require authentication
  const user = await requireAuth();
  
  // Fetch task from database
  const task = await prisma.task.findUnique({
    where: {
      id: id,
      userId: user.id // Ensure the task belongs to the authenticated user
    },
    include: {
      project: true
    }
  });
  
  if (!task) {
    notFound();
  }
  
  // Map to frontend task format
  const frontendTask = {
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: mapTaskStatus(task.status),
    priority: task.priority.toLowerCase() as 'low' | 'medium' | 'high',
    dueDate: task.dueDate ? task.dueDate.toISOString() : '',
    tags: task.tags as string[],
    projectId: task.projectId || undefined,
    project: task.project ? {
      id: task.project.id,
      name: task.project.name,
      color: task.project.color
    } : undefined,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
        {/* Task Header */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {frontendTask.title}
          </h1>
          
          <div className="flex gap-2">
            <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors">
              <Edit3 className="w-5 h-5" />
            </button>
            <button className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Task Description */}
        <div className="mb-8">
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {frontendTask.description || "No description provided."}
          </p>
        </div>
        
        {/* Task Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[frontendTask.status]}`}>
                {frontendTask.status.replace('_', ' ')}
              </span>
            </div>
            
            {/* Priority */}
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">Priority:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[frontendTask.priority]}`}>
                {frontendTask.priority.charAt(0).toUpperCase() + frontendTask.priority.slice(1)}
              </span>
            </div>
            
            {/* Project (if available) */}
            {frontendTask.project && (
              <div className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 rounded-full" 
                  style={{ backgroundColor: frontendTask.project.color }}
                ></div>
                <span className="text-slate-700 dark:text-slate-300">Project:</span>
                <span className="text-slate-900 dark:text-slate-100">{frontendTask.project.name}</span>
              </div>
            )}
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            {/* Due Date */}
            {frontendTask.dueDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">Due Date:</span>
                <span className="text-slate-900 dark:text-slate-100">{formatDate(frontendTask.dueDate)}</span>
              </div>
            )}
            
            {/* Created At */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">Created:</span>
              <span className="text-slate-900 dark:text-slate-100">{formatDate(frontendTask.createdAt)}</span>
            </div>
            
            {/* Updated At */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">Updated:</span>
              <span className="text-slate-900 dark:text-slate-100">{formatDate(frontendTask.updatedAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        {frontendTask.tags && frontendTask.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {frontendTask.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function TaskDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TaskDetails id={params.id} />
    </Suspense>
  );
} 