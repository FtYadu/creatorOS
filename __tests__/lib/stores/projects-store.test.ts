import { useProjectsStore } from '@/lib/stores/projects-store';
import { projectsService } from '@/lib/services/projects-service';
import toast from 'react-hot-toast';
import { Project } from '@/types';

jest.mock('@/lib/services/projects-service', () => ({
  projectsService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('useProjectsStore', () => {
  const mockProjects: Project[] = [
    {
      id: '1',
      clientName: 'Test Client',
      projectType: 'Wedding',
      stage: 'leads',
      deadline: new Date('2024-12-31'),
      budget: 5000,
      location: 'NYC',
      requirements: [],
      urgent: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useProjectsStore.setState({
      projects: [],
      isLoading: false,
      selectedProject: null,
    });
  });

  describe('fetchProjects', () => {
    it('should set isLoading to false and show error toast on failure', async () => {
      const error = new Error('Failed to fetch projects');
      (projectsService.getAll as jest.Mock).mockRejectedValueOnce(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const store = useProjectsStore.getState();

      // Initial state
      useProjectsStore.setState({ isLoading: true }); // Assume isLoading is true before action starts to explicitly test if it gets set to false

      // Call the action
      await store.fetchProjects();

      // Assertions
      expect(projectsService.getAll).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch projects:', error);
      expect(toast.error).toHaveBeenCalledWith('Failed to load projects');
      expect(useProjectsStore.getState().isLoading).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    it('should fetch projects and set state on success', async () => {
      (projectsService.getAll as jest.Mock).mockResolvedValueOnce(mockProjects);

      const store = useProjectsStore.getState();

      await store.fetchProjects();

      expect(projectsService.getAll).toHaveBeenCalled();
      expect(useProjectsStore.getState().projects).toEqual(mockProjects);
      expect(useProjectsStore.getState().isLoading).toBe(false);
    });
  });
});
