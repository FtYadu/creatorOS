import { Project, ProjectStage } from '@/types';

const API_BASE = '/api';

export const projectsService = {
  async getAll(stage?: ProjectStage): Promise<Project[]> {
    const params = new URLSearchParams();
    if (stage) params.append('stage', stage);

    const response = await fetch(`${API_BASE}/projects?${params}`);
    if (!response.ok) throw new Error('Failed to fetch projects');

    const { data } = await response.json();
    return data.map((p: any) => ({
      id: p.id,
      clientName: p.client_name,
      projectType: p.project_type,
      stage: p.stage,
      deadline: new Date(p.deadline),
      budget: p.budget,
      location: p.location,
      requirements: p.requirements || [],
      urgent: p.urgent || false,
      createdAt: new Date(p.created_at),
      updatedAt: new Date(p.updated_at),
    }));
  },

  async getById(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE}/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');

    const { data } = await response.json();
    return {
      id: data.id,
      clientName: data.client_name,
      projectType: data.project_type,
      stage: data.stage,
      deadline: new Date(data.deadline),
      budget: data.budget,
      location: data.location,
      requirements: data.requirements || [],
      urgent: data.urgent || false,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: project.clientName,
        projectType: project.projectType,
        stage: project.stage,
        deadline: project.deadline.toISOString(),
        budget: project.budget,
        location: project.location,
        requirements: project.requirements,
        urgent: project.urgent,
      }),
    });

    if (!response.ok) throw new Error('Failed to create project');

    const { data } = await response.json();
    return {
      id: data.id,
      clientName: data.client_name,
      projectType: data.project_type,
      stage: data.stage,
      deadline: new Date(data.deadline),
      budget: data.budget,
      location: data.location,
      requirements: data.requirements || [],
      urgent: data.urgent || false,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: updates.clientName,
        projectType: updates.projectType,
        stage: updates.stage,
        deadline: updates.deadline?.toISOString(),
        budget: updates.budget,
        location: updates.location,
        requirements: updates.requirements,
        urgent: updates.urgent,
      }),
    });

    if (!response.ok) throw new Error('Failed to update project');

    const { data } = await response.json();
    return {
      id: data.id,
      clientName: data.client_name,
      projectType: data.project_type,
      stage: data.stage,
      deadline: new Date(data.deadline),
      budget: data.budget,
      location: data.location,
      requirements: data.requirements || [],
      urgent: data.urgent || false,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete project');
  },
};
