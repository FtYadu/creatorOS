import { leadsService } from '@/lib/services/leads-service';
import { Lead } from '@/types';

// Mock fetch
global.fetch = jest.fn();

describe('leadsService', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

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
        json: async () => ({ data: mockLead }),
      });

      const lead = await leadsService.getById('1');

      expect(lead.id).toBe('1');
      expect(lead.name).toBe('Test Lead');
      expect(global.fetch).toHaveBeenCalledWith('/api/leads/1');
    });

    it('should throw error on failed fetch', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(leadsService.getById('1')).rejects.toThrow('Failed to fetch lead');
    });
  });

  describe('create', () => {
    it('should create a new lead', async () => {
      const newLead = {
        name: 'New Lead',
        email: 'new@example.com',
        source: 'website' as const,
        stage: 'new' as const,
      };

      const mockResponse = {
        id: '2',
        name: 'New Lead',
        email: 'new@example.com',
        source: 'website',
        stage: 'new',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      });

      const lead = await leadsService.create(newLead);

      expect(lead.name).toBe('New Lead');
      expect(global.fetch).toHaveBeenCalledWith('/api/leads', expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/leads',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"name":"New Lead"'),
        })
      );
    });

    it('should throw error on failed creation', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(leadsService.create({})).rejects.toThrow('Failed to create lead');
    });
  });

  describe('update', () => {
    it('should update an existing lead', async () => {
      const updates = {
        name: 'Updated Lead',
        stage: 'contacted' as const,
      };

      const mockResponse = {
        id: '1',
        name: 'Updated Lead',
        stage: 'contacted',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      });

      const lead = await leadsService.update('1', updates);

      expect(lead.name).toBe('Updated Lead');
      expect(global.fetch).toHaveBeenCalledWith('/api/leads/1', expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/leads/1',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"name":"Updated Lead"'),
        })
      );
    });

    it('should throw error on failed update', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(leadsService.update('1', {})).rejects.toThrow('Failed to update lead');
    });
  });

  describe('delete', () => {
    it('should delete a lead', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await leadsService.delete('1');

      expect(global.fetch).toHaveBeenCalledWith('/api/leads/1', expect.objectContaining({ method: 'DELETE' }));
    });

    it('should throw error on failed deletion', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(leadsService.delete('1')).rejects.toThrow('Failed to delete lead');
      await expect(leadsService.getById('999')).rejects.toThrow('Failed to fetch lead');
      expect(global.fetch).toHaveBeenCalledWith('/api/leads/999');
    });
  });
});
