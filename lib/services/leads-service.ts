import { Lead, LeadStage, LeadSource } from '@/types';

const API_BASE = '/api';

export const leadsService = {
  async getAll(filters?: { stage?: LeadStage; source?: LeadSource; minScore?: number }): Promise<Lead[]> {
    const params = new URLSearchParams();
    if (filters?.stage) params.append('stage', filters.stage);
    if (filters?.source) params.append('source', filters.source);
    if (filters?.minScore) params.append('minScore', filters.minScore.toString());

    const response = await fetch(`${API_BASE}/leads?${params}`);
    if (!response.ok) throw new Error('Failed to fetch leads');

    const { data } = await response.json();
    return data.map((l: any) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      projectType: l.project_type,
      budget: l.budget,
      timeline: l.timeline,
      source: l.source,
      stage: l.stage,
      score: l.score,
      budgetScore: l.budget_score,
      timelineScore: l.timeline_score,
      engagementScore: l.engagement_score,
      location: l.location,
      requirements: l.requirements || [],
      tags: l.tags || [],
      referredBy: l.referred_by,
      lastContactDate: l.last_contact_date ? new Date(l.last_contact_date) : undefined,
      followUpDate: l.follow_up_date ? new Date(l.follow_up_date) : undefined,
      convertedToProjectId: l.converted_to_project_id,
      lostReason: l.lost_reason,
      notes: l.notes,
      createdAt: new Date(l.created_at),
      updatedAt: new Date(l.updated_at),
    }));
  },

  async getById(id: string): Promise<Lead> {
    const response = await fetch(`${API_BASE}/leads/${id}`);
    if (!response.ok) throw new Error('Failed to fetch lead');

    const { data } = await response.json();
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      projectType: data.project_type,
      budget: data.budget,
      timeline: data.timeline,
      source: data.source,
      stage: data.stage,
      score: data.score,
      budgetScore: data.budget_score,
      timelineScore: data.timeline_score,
      engagementScore: data.engagement_score,
      location: data.location,
      requirements: data.requirements || [],
      tags: data.tags || [],
      referredBy: data.referred_by,
      lastContactDate: data.last_contact_date ? new Date(data.last_contact_date) : undefined,
      followUpDate: data.follow_up_date ? new Date(data.follow_up_date) : undefined,
      convertedToProjectId: data.converted_to_project_id,
      lostReason: data.lost_reason,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async create(lead: Partial<Lead>): Promise<Lead> {
    const response = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        projectType: lead.projectType,
        budget: lead.budget,
        timeline: lead.timeline,
        source: lead.source,
        stage: lead.stage,
        score: lead.score,
        budgetScore: lead.budgetScore,
        timelineScore: lead.timelineScore,
        engagementScore: lead.engagementScore,
        location: lead.location,
        requirements: lead.requirements,
        tags: lead.tags,
        referredBy: lead.referredBy,
        notes: lead.notes,
      }),
    });

    if (!response.ok) throw new Error('Failed to create lead');

    const { data } = await response.json();
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      projectType: data.project_type,
      budget: data.budget,
      timeline: data.timeline,
      source: data.source,
      stage: data.stage,
      score: data.score,
      budgetScore: data.budget_score,
      timelineScore: data.timeline_score,
      engagementScore: data.engagement_score,
      location: data.location,
      requirements: data.requirements || [],
      tags: data.tags || [],
      referredBy: data.referred_by,
      lostReason: data.lost_reason,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async update(id: string, updates: Partial<Lead>): Promise<Lead> {
    const response = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        projectType: updates.projectType,
        budget: updates.budget,
        timeline: updates.timeline,
        source: updates.source,
        stage: updates.stage,
        score: updates.score,
        location: updates.location,
        requirements: updates.requirements,
        tags: updates.tags,
        notes: updates.notes,
        followUpDate: updates.followUpDate?.toISOString(),
        lostReason: updates.lostReason,
      }),
    });

    if (!response.ok) throw new Error('Failed to update lead');

    const { data } = await response.json();
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      projectType: data.project_type,
      budget: data.budget,
      timeline: data.timeline,
      source: data.source,
      stage: data.stage,
      score: data.score,
      budgetScore: data.budget_score,
      timelineScore: data.timeline_score,
      engagementScore: data.engagement_score,
      location: data.location,
      requirements: data.requirements || [],
      tags: data.tags || [],
      referredBy: data.referred_by,
      lastContactDate: data.last_contact_date ? new Date(data.last_contact_date) : undefined,
      followUpDate: data.follow_up_date ? new Date(data.follow_up_date) : undefined,
      convertedToProjectId: data.converted_to_project_id,
      lostReason: data.lost_reason,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete lead');
  },
};
