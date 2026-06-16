import { leadsService } from '@/lib/services/leads-service';
import { Lead } from '@/types';

// Mock fetch
global.fetch = jest.fn();

describe('leadsService', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getById', () => {
    it('should fetch a lead by id successfully', async () => {
      const mockLeadResponse = {
        id: 'lead-1',
        name: 'Test Lead',
        email: 'test@example.com',
        phone: '1234567890',
        project_type: 'Kitchen Remodel',
        budget: '10000-20000',
        timeline: '1-3 months',
        source: 'Website',
        stage: 'new',
        score: 85,
        budget_score: 80,
        timeline_score: 90,
        engagement_score: 85,
        location: 'San Francisco',
        requirements: ['req1', 'req2'],
        tags: ['tag1'],
        referred_by: 'John Doe',
        last_contact_date: '2024-01-01T00:00:00.000Z',
        follow_up_date: '2024-01-05T00:00:00.000Z',
        converted_to_project_id: null,
        lost_reason: null,
        notes: 'Some notes',
        created_at: '2023-12-01T00:00:00.000Z',
        updated_at: '2023-12-02T00:00:00.000Z',
  describe('getAll', () => {
    it('should fetch all leads', async () => {
      const mockLeads = [
        {
          id: '1',
          name: 'Test Lead',
          email: 'test@example.com',
          phone: '1234567890',
          project_type: 'Wedding',
          budget: 5000,
          timeline: '1-3 months',
          source: 'website',
          stage: 'new',
          score: 80,
          budget_score: 20,
          timeline_score: 30,
          engagement_score: 30,
          location: 'NYC',
          requirements: [],
          tags: [],
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockLeads }),
      });

      const leads = await leadsService.getAll();

      expect(leads).toHaveLength(1);
      expect(leads[0].name).toBe('Test Lead');
      expect(leads[0].projectType).toBe('Wedding');
      expect(global.fetch).toHaveBeenCalledWith('/api/leads?');
    });

    it('should filter leads by stage and source', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await leadsService.getAll({ stage: 'contacted', source: 'google', minScore: 50 });

      expect(global.fetch).toHaveBeenCalledWith('/api/leads?stage=contacted&source=google&minScore=50');
    });

    it('should throw error on failed fetch', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(leadsService.getAll()).rejects.toThrow('Failed to fetch leads');
    });
  });

  describe('getById', () => {
    it('should fetch a lead by id', async () => {
      const mockLead = {
        id: '1',
        name: 'Test Lead',
        email: 'test@example.com',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockLeadResponse }),
      });

      const lead = await leadsService.getById('lead-1');

      expect(global.fetch).toHaveBeenCalledWith('/api/leads/lead-1');
      expect(lead).toEqual({
        id: mockLeadResponse.id,
        name: mockLeadResponse.name,
        email: mockLeadResponse.email,
        phone: mockLeadResponse.phone,
        projectType: mockLeadResponse.project_type,
        budget: mockLeadResponse.budget,
        timeline: mockLeadResponse.timeline,
        source: mockLeadResponse.source,
        stage: mockLeadResponse.stage,
        score: mockLeadResponse.score,
        budgetScore: mockLeadResponse.budget_score,
        timelineScore: mockLeadResponse.timeline_score,
        engagementScore: mockLeadResponse.engagement_score,
        location: mockLeadResponse.location,
        requirements: mockLeadResponse.requirements,
        tags: mockLeadResponse.tags,
        referredBy: mockLeadResponse.referred_by,
        lastContactDate: new Date(mockLeadResponse.last_contact_date),
        followUpDate: new Date(mockLeadResponse.follow_up_date),
        convertedToProjectId: mockLeadResponse.converted_to_project_id,
        lostReason: mockLeadResponse.lost_reason,
        notes: mockLeadResponse.notes,
        createdAt: new Date(mockLeadResponse.created_at),
        updatedAt: new Date(mockLeadResponse.updated_at),
      });
    });

    it('should throw error on failed fetch', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(leadsService.getById('lead-1')).rejects.toThrow('Failed to fetch lead');
    });

    it('should handle missing optional array fields and dates correctly', async () => {
      const mockLeadResponse = {
        id: 'lead-2',
        name: 'Test Lead 2',
        project_type: 'Bathroom Remodel',
        budget: '5000',
        timeline: '1 month',
        stage: 'new',
        score: 50,
        // no requirements, tags, last_contact_date, follow_up_date
        created_at: '2023-12-01T00:00:00.000Z',
        updated_at: '2023-12-02T00:00:00.000Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockLeadResponse }),
      });

      const lead = await leadsService.getById('lead-2');

      expect(lead.requirements).toEqual([]);
      expect(lead.tags).toEqual([]);
      expect(lead.lastContactDate).toBeUndefined();
      expect(lead.followUpDate).toBeUndefined();
    });
  });
});
