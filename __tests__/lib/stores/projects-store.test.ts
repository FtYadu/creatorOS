import { useProjectsStore } from '@/lib/stores/projects-store';
import { projectsService } from '@/lib/services/projects-service';
import toast from 'react-hot-toast';
import { Project } from '@/types';

// Mock dependencies
jest.mock('@/lib/services/projects-service');
jest.mock('react-hot-toast');

describe('useProjectsStore', () => {
  const mockProject: Project = {
    id: '1',
    clientName: 'Test Client',
    projectType: 'Wedding',
    stage: 'leads',
    deadline: new Date('2024-12-31'),
    budget: 5000,
    location: 'NYC',
    requirements: [],
    urgent: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUpdatedProject: Project = {
    ...mockProject,
    clientName: 'Updated Client',
    stage: 'shooting',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useProjectsStore.setState({
      projects: [],
      isLoading: false,
      selectedProject: null,
    });
  });

  describe('fetchProjects', () => {
    it('should fetch all projects successfully', async () => {
      (projectsService.getAll as jest.Mock).mockResolvedValue([mockProject]);

      await useProjectsStore.getState().fetchProjects();

      expect(projectsService.getAll).toHaveBeenCalledWith(undefined);
      expect(useProjectsStore.getState().projects).toEqual([mockProject]);
      expect(useProjectsStore.getState().isLoading).toBe(false);
    });

    it('should fetch projects by stage successfully', async () => {
      (projectsService.getAll as jest.Mock).mockResolvedValue([mockProject]);

      await useProjectsStore.getState().fetchProjects('leads');

      expect(projectsService.getAll).toHaveBeenCalledWith('leads');
      expect(useProjectsStore.getState().projects).toEqual([mockProject]);
      expect(useProjectsStore.getState().isLoading).toBe(false);
    });

    it('should handle fetchProjects error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (projectsService.getAll as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      await useProjectsStore.getState().fetchProjects();

      expect(toast.error).toHaveBeenCalledWith('Failed to load projects');
      expect(useProjectsStore.getState().isLoading).toBe(false);
      expect(useProjectsStore.getState().projects).toEqual([]);
      consoleSpy.mockRestore();
    });
  });

  describe('fetchProject', () => {
    it('should fetch a single project successfully', async () => {
      (projectsService.getById as jest.Mock).mockResolvedValue(mockProject);

      await useProjectsStore.getState().fetchProject('1');

      expect(projectsService.getById).toHaveBeenCalledWith('1');
      expect(useProjectsStore.getState().selectedProject).toEqual(mockProject);
      expect(useProjectsStore.getState().isLoading).toBe(false);
    });

    it('should handle fetchProject error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (projectsService.getById as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      await useProjectsStore.getState().fetchProject('1');

      expect(toast.error).toHaveBeenCalledWith('Failed to load project');
      expect(useProjectsStore.getState().isLoading).toBe(false);
      expect(useProjectsStore.getState().selectedProject).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const newProjectData = {
        clientName: 'Test Client',
        projectType: 'Wedding' as const,
        stage: 'leads' as const,
        deadline: new Date('2024-12-31'),
        budget: 5000,
        location: 'NYC',
        requirements: [],
        urgent: false,
      };

      (projectsService.create as jest.Mock).mockResolvedValue(mockProject);

      await useProjectsStore.getState().createProject(newProjectData);

      expect(projectsService.create).toHaveBeenCalledWith(newProjectData);
      expect(useProjectsStore.getState().projects).toEqual([mockProject]);
      expect(useProjectsStore.getState().isLoading).toBe(false);
      expect(toast.success).toHaveBeenCalledWith('Project created successfully');
    });

    it('should handle createProject error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const newProjectData = {
        clientName: 'Test Client',
        projectType: 'Wedding' as const,
        stage: 'leads' as const,
        deadline: new Date('2024-12-31'),
        budget: 5000,
        location: 'NYC',
        requirements: [],
        urgent: false,
      };

      (projectsService.create as jest.Mock).mockRejectedValue(new Error('Create failed'));

      await useProjectsStore.getState().createProject(newProjectData);

      expect(toast.error).toHaveBeenCalledWith('Failed to create project');
      expect(useProjectsStore.getState().isLoading).toBe(false);
      expect(useProjectsStore.getState().projects).toEqual([]);
      consoleSpy.mockRestore();
    });
  });

  describe('updateProject', () => {
    beforeEach(() => {
      useProjectsStore.setState({
        projects: [mockProject],
        selectedProject: mockProject,
      });
    });

    it('should update a project successfully', async () => {
      const updates = { clientName: 'Updated Client' };
      (projectsService.update as jest.Mock).mockResolvedValue(mockUpdatedProject);

      await useProjectsStore.getState().updateProject('1', updates);

      expect(projectsService.update).toHaveBeenCalledWith('1', updates);
      expect(useProjectsStore.getState().projects).toEqual([mockUpdatedProject]);
      expect(useProjectsStore.getState().selectedProject).toEqual(mockUpdatedProject);
      expect(useProjectsStore.getState().isLoading).toBe(false);
      expect(toast.success).toHaveBeenCalledWith('Project updated successfully');
    });

    it('should handle updateProject error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const updates = { clientName: 'Updated Client' };
      (projectsService.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

      await useProjectsStore.getState().updateProject('1', updates);

      expect(toast.error).toHaveBeenCalledWith('Failed to update project');
      expect(useProjectsStore.getState().isLoading).toBe(false);
      expect(useProjectsStore.getState().projects).toEqual([mockProject]);
      consoleSpy.mockRestore();
    });
  });

  describe('moveProject', () => {
    it('should move a project successfully', async () => {
      useProjectsStore.setState({ projects: [mockProject] });
      (projectsService.update as jest.Mock).mockResolvedValue(mockUpdatedProject);

      await useProjectsStore.getState().moveProject('1', 'shooting');

      // The moveProject action directly calls updateProject inside
      expect(projectsService.update).toHaveBeenCalledWith('1', { stage: 'shooting' });
      expect(useProjectsStore.getState().projects).toEqual([mockUpdatedProject]);
    });

    it('should handle moveProject error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      useProjectsStore.setState({ projects: [mockProject] });
      (projectsService.update as jest.Mock).mockRejectedValue(new Error('Move failed'));

      await useProjectsStore.getState().moveProject('1', 'shooting');

      // Since moveProject calls updateProject which handles errors, console.error from updateProject is called
      expect(consoleSpy).toHaveBeenCalledWith('Failed to update project:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('deleteProject', () => {
    beforeEach(() => {
      useProjectsStore.setState({
        projects: [mockProject],
        selectedProject: mockProject,
      });
    });

    it('should delete a project successfully', async () => {
      (projectsService.delete as jest.Mock).mockResolvedValue(undefined);

      await useProjectsStore.getState().deleteProject('1');

      expect(projectsService.delete).toHaveBeenCalledWith('1');
      expect(useProjectsStore.getState().projects).toEqual([]);
      expect(useProjectsStore.getState().selectedProject).toBeNull();
      expect(useProjectsStore.getState().isLoading).toBe(false);
      expect(toast.success).toHaveBeenCalledWith('Project deleted successfully');
    });

    it('should handle deleteProject error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (projectsService.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      await useProjectsStore.getState().deleteProject('1');

      expect(toast.error).toHaveBeenCalledWith('Failed to delete project');
      expect(useProjectsStore.getState().isLoading).toBe(false);
      expect(useProjectsStore.getState().projects).toEqual([mockProject]);
      consoleSpy.mockRestore();
    });
  });

  describe('setSelectedProject', () => {
    it('should set the selected project', () => {
      useProjectsStore.getState().setSelectedProject(mockProject);
      expect(useProjectsStore.getState().selectedProject).toEqual(mockProject);
    });

    it('should clear the selected project', () => {
      useProjectsStore.setState({ selectedProject: mockProject });
      useProjectsStore.getState().setSelectedProject(null);
      expect(useProjectsStore.getState().selectedProject).toBeNull();
    });
  });
});
