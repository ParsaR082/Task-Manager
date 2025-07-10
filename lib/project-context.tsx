'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Project } from './types';

// Default projects data
const defaultProjects: Project[] = [
  { id: 'project-1', name: 'Website Redesign', color: 'bg-blue-500', description: 'Redesign the company website', tasksCount: 12 },
  { id: 'project-2', name: 'Mobile App', color: 'bg-green-500', description: 'Develop the mobile application', tasksCount: 8 },
  { id: 'project-3', name: 'Marketing Campaign', color: 'bg-purple-500', description: 'Q3 marketing campaign', tasksCount: 5 },
  { id: 'project-4', name: 'API Development', color: 'bg-orange-500', description: 'Build new API endpoints', tasksCount: 15 },
];

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string | null;
  isModalOpen: boolean;
  isLoading: boolean;
  addProject: (project: Omit<Project, 'id' | 'tasksCount'>) => void;
  selectProject: (projectId: string | null) => void;
  openModal: () => void;
  closeModal: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addProject = (projectData: Omit<Project, 'id' | 'tasksCount'>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newProject: Project = {
        ...projectData,
        id: `project-${Date.now()}`,
        tasksCount: 0,
      };
      
      setProjects(prevProjects => [...prevProjects, newProject]);
      setIsLoading(false);
      setIsModalOpen(false);
      setSelectedProjectId(newProject.id);
    }, 800); // Simulate network delay
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