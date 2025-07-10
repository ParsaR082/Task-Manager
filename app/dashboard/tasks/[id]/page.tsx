'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTasks } from '@/lib/task-context';
import { Task } from '@/lib/types';
import { TaskModal } from '@/components/ui/task-modal';

export default function TaskDetailPage() {
  const { id } = useParams();
  const { tasks, updateTask } = useTasks();
  const [task, setTask] = useState<Task | undefined>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === id);
    setTask(foundTask);
  }, [id, tasks]);

  if (!task) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Task not found
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {task.title}
        </h1>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Edit Task
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Description
          </h2>
          <p className="mt-1 text-slate-900 dark:text-slate-100">
            {task.description || 'No description provided'}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Status
          </h2>
          <p className="mt-1 text-slate-900 dark:text-slate-100">
            {task.status}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Due Date
          </h2>
          <p className="mt-1 text-slate-900 dark:text-slate-100">
            {formatDate(task.dueDate)}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Created At
          </h2>
          <p className="mt-1 text-slate-900 dark:text-slate-100">
            {formatDate(task.createdAt)}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Last Updated
          </h2>
          <p className="mt-1 text-slate-900 dark:text-slate-100">
            {formatDate(task.updatedAt)}
          </p>
        </div>
      </div>

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updatedTask) => {
          updateTask(task.id, updatedTask);
          setIsEditModalOpen(false);
        }}
        task={task}
      />
    </div>
  );
} 