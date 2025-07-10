'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from './types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/toast';

// Sample tasks data
const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design new dashboard',
    description: 'Create wireframes and mockups for the new dashboard layout',
    status: TaskStatus.IN_PROGRESS,
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projectId: 'project-1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Implement authentication',
    description: 'Add user login and registration functionality',
    status: TaskStatus.TODO,
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projectId: 'project-2',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Write API documentation',
    description: 'Document all API endpoints and parameters',
    status: TaskStatus.DONE,
    priority: 'low',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projectId: 'project-4',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface TaskContextType {
  tasks: Task[];
  isTaskModalOpen: boolean;
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  openTaskModal: () => void;
  closeTaskModal: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...taskData,
        id: `task-${uuidv4()}`,
        createdAt: now,
        updatedAt: now,
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      setIsLoading(false);
      setIsTaskModalOpen(false);
      showToast(`Task "${taskData.title}" created successfully!`, 'success');
    }, 800); // Simulate network delay
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const moveTask = (id: string, newStatus: TaskStatus) => {
    updateTask(id, { status: newStatus });
  };

  const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isTaskModalOpen,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        openTaskModal,
        closeTaskModal,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}; 