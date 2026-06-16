import { projectsService } from "@/lib/services/projects-service";
import { Project } from "@/types";

// Mock fetch
global.fetch = jest.fn();

describe("projectsService", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe("getAll", () => {
    it("should fetch all projects", async () => {
      const mockProjects = [
        {
          id: "1",
          client_name: "Test Client",
          project_type: "Wedding",
          stage: "leads",
          deadline: "2024-12-31",
          budget: 5000,
          location: "NYC",
          requirements: [],
          urgent: false,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      const projects = await projectsService.getAll();

      expect(projects).toHaveLength(1);
      expect(projects[0].clientName).toBe("Test Client");
      expect(global.fetch).toHaveBeenCalledWith("/api/projects?");
    });

    it("should filter projects by stage", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await projectsService.getAll("shooting");

      expect(global.fetch).toHaveBeenCalledWith("/api/projects?stage=shooting");
    });

    it("should throw error on failed fetch", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(projectsService.getAll()).rejects.toThrow(
        "Failed to fetch projects",
      );
    });
  });

  describe("getById", () => {
    it("should fetch a project by id", async () => {
      const mockProject = {
        id: "1",
        client_name: "Test Client",
        project_type: "Wedding",
        stage: "leads",
        deadline: "2024-12-31",
        budget: 5000,
        location: "NYC",
        requirements: [],
        urgent: false,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
  describe('getById', () => {
    it('should fetch a single project by id', async () => {
      const mockProject = {
        id: '123',
        client_name: 'Single Client',
        project_type: 'Commercial',
        stage: 'editing',
        deadline: '2024-11-30',
        budget: 10000,
        location: 'LA',
        requirements: ['Drone footage'],
        urgent: true,
        created_at: '2024-02-01',
        updated_at: '2024-02-02',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProject }),
      });

      const project = await projectsService.getById("1");

      expect(project.id).toBe("1");
      expect(project.clientName).toBe("Test Client");
      expect(global.fetch).toHaveBeenCalledWith("/api/projects/1");
    });

    it("should throw error on failed fetch", async () => {
      const project = await projectsService.getById('123');

      expect(project.id).toBe('123');
      expect(project.clientName).toBe('Single Client');
      expect(project.projectType).toBe('Commercial');
      expect(project.stage).toBe('editing');
      expect(project.budget).toBe(10000);
      expect(project.location).toBe('LA');
      expect(project.requirements).toEqual(['Drone footage']);
      expect(project.urgent).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('/api/projects/123');
    });

    it('should throw error on failed fetch', async () => {
  describe('delete', () => {
    it('should delete a project', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await projectsService.delete('1');

      expect(global.fetch).toHaveBeenCalledWith('/api/projects/1', {
        method: 'DELETE',
      });
    });

    it('should throw error on failed delete', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(projectsService.getById("1")).rejects.toThrow(
        "Failed to fetch project",
      );
      expect(global.fetch).toHaveBeenCalledWith("/api/projects/1");
    });
  });

  describe("create", () => {
    it("should create a new project", async () => {
      await expect(projectsService.getById('999')).rejects.toThrow('Failed to fetch project');
      await expect(projectsService.delete('1')).rejects.toThrow('Failed to delete project');
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const newProject = {
        clientName: "New Client",
        projectType: "Wedding" as const,
        stage: "leads" as const,
        deadline: new Date("2024-12-31"),
        budget: 5000,
        location: "NYC",
        requirements: [],
        urgent: false,
      };

      const mockResponse = {
        id: "1",
        client_name: "New Client",
        project_type: "Wedding",
        stage: "leads",
        deadline: "2024-12-31",
        budget: 5000,
        location: "NYC",
        requirements: [],
        urgent: false,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      });

      const project = await projectsService.create(newProject);

      expect(project.clientName).toBe("New Client");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/projects",
        expect.any(Object),
      );
    });
  });

  describe('update', () => {
    it('should update an existing project', async () => {
      const updates = {
        clientName: 'Updated Client',
        budget: 6000,
      };

      const mockResponse = {
        id: '1',
        client_name: 'Updated Client',
        project_type: 'Wedding',
        stage: 'leads',
        deadline: '2024-12-31',
        budget: 6000,
        location: 'NYC',
        requirements: [],
        urgent: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-02',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      });

      const project = await projectsService.update('1', updates);

      expect(project.clientName).toBe('Updated Client');
      expect(project.budget).toBe(6000);
      expect(global.fetch).toHaveBeenCalledWith('/api/projects/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: updates.clientName,
          budget: updates.budget,
        }),
      });
    });

    it('should throw error on failed fetch', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(projectsService.update('1', { clientName: 'Fail' })).rejects.toThrow('Failed to update project');
    });
  });
});
