'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  selectedProjectId: string | undefined;
  setSelectedProjectId: (id: string | undefined) => void;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'tasksCount'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'tasksCount'>) => {
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      tasksCount: 0
    };
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const createdProject = await response.json();
      setProjects(prev => [...prev, createdProject]);
      toast.success('Project created successfully');
      return createdProject;
    } catch (err) {
      console.error('Error creating project:', err);
      toast.error('Failed to create project');
      throw err;
    }
  };

  const updateProject = async (projectUpdate: Project) => {
    try {
      const response = await fetch(`/api/projects/${projectUpdate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject = await response.json();
      setProjects(prev => 
        prev.map(p => p.id === projectUpdate.id ? { ...p, ...updatedProject } : p)
      );
      toast.success('Project updated successfully');
      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      toast.error('Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(prev => prev.filter(p => p.id !== id));
      
      // Clear selection if the deleted project was selected
      if (selectedProjectId === id) {
        setSelectedProjectId(undefined);
      }
      
      toast.success('Project deleted successfully');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project');
      throw err;
    }
  };

  // Fetch projects on initial load
  useEffect(() => {
    fetchProjects();
  }, []);

  // Listen for custom event to clear project filter
  useEffect(() => {
    const handleClearProjectFilter = () => {
      setSelectedProjectId(undefined);
    };

    window.addEventListener('clearProjectFilter', handleClearProjectFilter);
    
    return () => {
      window.removeEventListener('clearProjectFilter', handleClearProjectFilter);
    };
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        selectedProjectId,
        setSelectedProjectId,
        fetchProjects,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
} 