'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus } from './types';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredTasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (id: string, taskUpdate: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();

  // Filter tasks based on search query
  const filteredTasks = React.useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  const fetchTasks = async (projectId?: string) => {
    if (!session?.user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = projectId ? `/api/tasks?projectId=${projectId}` : '/api/tasks';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!session?.user) {
      toast.error('You must be logged in to create tasks');
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully');
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, taskUpdate: Partial<Task>) => {
    if (!session?.user) {
      toast.error('You must be logged in to update tasks');
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prev => 
        prev.map(t => t.id === id ? { ...t, ...updatedTask } : t)
      );
      toast.success('Task updated successfully');
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    if (!session?.user) {
      toast.error('You must be logged in to delete tasks');
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
      throw err;
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      await updateTask(id, { status });
      toast.success(`Task moved to ${status}`);
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
      throw err;
    }
  };

  // Fetch tasks on initial load
  useEffect(() => {
    if (session?.user) {
      fetchTasks();
    }
  }, [session]);

  const value = {
    tasks,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
} 