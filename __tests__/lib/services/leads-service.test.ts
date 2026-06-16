import { leadsService } from '@/lib/services/leads-service';

// Mock fetch
global.fetch = jest.fn();

describe('leadsService', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getById', () => {
    it('should fetch a lead by id successfully', async () => {
      const mockLeadData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        project_type: 'Wedding',
        budget: 5000,
        timeline: '1-3 months',
        source: 'Website',
        stage: 'new',
        score: 85,
        budget_score: 80,
        timeline_score: 90,
        engagement_score: 85,
        location: 'NYC',
        requirements: ['Photo', 'Video'],
        tags: ['VIP'],
        referred_by: 'Jane Doe',
        last_contact_date: '2024-01-01T00:00:00.000Z',
        follow_up_date: '2024-01-05T00:00:00.000Z',
        converted_to_project_id: null,
        lost_reason: null,
        notes: 'Some notes',
        created_at: '2023-12-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockLeadData }),
      });

      const lead = await leadsService.getById('1');

      expect(lead).toBeDefined();
      expect(lead.id).toBe('1');
      expect(lead.name).toBe('John Doe');
      expect(lead.lastContactDate).toBeInstanceOf(Date);
      expect(global.fetch).toHaveBeenCalledWith('/api/leads/1');
    });

    it('should throw error when fetch response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(leadsService.getById('999')).rejects.toThrow('Failed to fetch lead');
      expect(global.fetch).toHaveBeenCalledWith('/api/leads/999');
    });
  });
});
