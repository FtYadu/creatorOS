import { create } from 'zustand';
import { Project, ProjectStage } from '@/types';
import { mockProjects } from '@/lib/utils/mock-data';

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  selectedProject: Project | null;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  moveProject: (id: string, newStage: ProjectStage) => void;
  deleteProject: (id: string) => void;
  setSelectedProject: (project: Project | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: mockProjects,
  isLoading: false,
  selectedProject: null,

  setProjects: (projects) => set({ projects }),

  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    )
  })),

  moveProject: (id, newStage) => set((state) => ({
    projects: state.projects.map(p =>
      p.id === id ? { ...p, stage: newStage, updatedAt: new Date() } : p
    )
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),

  setSelectedProject: (project) => set({ selectedProject: project }),

  setLoading: (loading) => set({ isLoading: loading })
}));
