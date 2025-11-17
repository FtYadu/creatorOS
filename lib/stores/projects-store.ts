import { create } from 'zustand';
import { Project, ProjectStage } from '@/types';
import { projectsService } from '@/lib/services/projects-service';
import toast from 'react-hot-toast';

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  selectedProject: Project | null;
  fetchProjects: (stage?: ProjectStage) => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  moveProject: (id: string, newStage: ProjectStage) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setSelectedProject: (project: Project | null) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  isLoading: false,
  selectedProject: null,

  fetchProjects: async (stage?: ProjectStage) => {
    set({ isLoading: true });
    try {
      const projects = await projectsService.getAll(stage);
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to load projects');
      set({ isLoading: false });
    }
  },

  fetchProject: async (id: string) => {
    set({ isLoading: true });
    try {
      const project = await projectsService.getById(id);
      set({ selectedProject: project, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch project:', error);
      toast.error('Failed to load project');
      set({ isLoading: false });
    }
  },

  createProject: async (project) => {
    set({ isLoading: true });
    try {
      const newProject = await projectsService.create(project);
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
      toast.success('Project created successfully');
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
      set({ isLoading: false });
    }
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true });
    try {
      const updated = await projectsService.update(id, updates);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updated : p)),
        selectedProject: state.selectedProject?.id === id ? updated : state.selectedProject,
        isLoading: false,
      }));
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Failed to update project:', error);
      toast.error('Failed to update project');
      set({ isLoading: false });
    }
  },

  moveProject: async (id, newStage) => {
    try {
      await get().updateProject(id, { stage: newStage });
    } catch (error) {
      console.error('Failed to move project:', error);
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true });
    try {
      await projectsService.delete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        isLoading: false,
      }));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
      set({ isLoading: false });
    }
  },

  setSelectedProject: (project) => set({ selectedProject: project }),
}));
