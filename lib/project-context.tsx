'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Project } from './types';
import { useToast } from '@/components/ui/toast';
import { useSession } from 'next-auth/react';

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string | null;
  isModalOpen: boolean;
  isLoading: boolean;
  addProject: (project: Omit<Project, 'id' | 'tasksCount'>) => void;
  selectProject: (projectId: string | null) => void;
  openModal: () => void;
  closeModal: () => void;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { data: session } = useSession();

  // Fetch projects when session changes
  useEffect(() => {
    if (session?.user) {
      refreshProjects();
    }
  }, [session]);

  const refreshProjects = async () => {
    if (!session?.user) return;
    
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showToast('Failed to load projects', 'error');
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'tasksCount'>) => {
    if (!session?.user) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) throw new Error('Failed to create project');
      
      const newProject = await response.json();
      setProjects(prevProjects => [...prevProjects, newProject]);
      showToast(`Project "${projectData.name}" created successfully!`, 'success');
      setIsModalOpen(false);
      setSelectedProjectId(newProject.id);
    } catch (error) {
      console.error('Error creating project:', error);
      showToast('Failed to create project', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const selectProject = (projectId: string | null) => {
    setSelectedProjectId(projectId);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProjectId,
        isModalOpen,
        isLoading,
        addProject,
        selectProject,
        openModal,
        closeModal,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}; 