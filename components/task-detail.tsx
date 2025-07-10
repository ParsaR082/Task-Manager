'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/lib/task-context';
import { Task, TaskStatus } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface TaskDetailProps {
  id: string;
}

export function TaskDetail({ id }: TaskDetailProps) {
  const { tasks } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }
        const data = await response.json();
        setTask(data);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task. Please try again.');
        toast.error('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 dark:text-red-400">{error || 'Task not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {task.title}
            </h1>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                task.status === TaskStatus.TODO ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}>
                {task.status.replace('-', ' ').toUpperCase()}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                task.priority === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              {task.description || 'No description provided.'}
            </p>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 