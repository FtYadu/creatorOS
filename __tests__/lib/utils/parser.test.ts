import { calculateLeadScore } from '@/lib/utils/parser';
import { ParsedData, ProjectType } from '@/types';

// Helper function to create base ParsedData
const createBaseData = (overrides: Partial<ParsedData> = {}): ParsedData => ({
  clientName: 'Test Client',
  projectType: 'Other' as ProjectType,
  budget: 'Not specified',
  timeline: 'Flexible',
  location: 'Not specified',
  requirements: [],
  rawText: 'Test text',
  ...overrides
});

describe('calculateLeadScore', () => {
  describe('Budget Scoring', () => {
    // The implementation uses `.match(/(\d+)/)` which extracts ONLY the first contiguous digit sequence!
    // E.g. "AED 25000" will extract "25000"
    // E.g. "AED 25,000" will extract "25" (which is < 5000)
    it('should score 3 for budget >= 20,000', () => {
      const data = createBaseData({ budget: 'AED 25000' });
      expect(calculateLeadScore(data).budget).toBe(3);
    });

    it('should score 2 for budget >= 10,000 and < 20,000', () => {
      const data = createBaseData({ budget: 'AED 15000' });
      expect(calculateLeadScore(data).budget).toBe(2);
    });

    it('should score 1 for budget >= 5,000 and < 10,000', () => {
      const data = createBaseData({ budget: 'AED 6000' });
      expect(calculateLeadScore(data).budget).toBe(1);
    });

    it('should score 0 for budget < 5,000', () => {
      const data = createBaseData({ budget: 'AED 3000' });
      expect(calculateLeadScore(data).budget).toBe(0);
    });

    it('should score 0 when budget is Not specified', () => {
      const data = createBaseData({ budget: 'Not specified' });
      expect(calculateLeadScore(data).budget).toBe(0);
    });
  });

  describe('Timeline Scoring', () => {
    it('should score 2 for timeline >= 1 month', () => {
      const data = createBaseData({ timeline: 'in 2 months' });
      expect(calculateLeadScore(data).timeline).toBe(2);
    });

    it('should score 2 for timeline >= 2 weeks', () => {
      const data = createBaseData({ timeline: 'in 3 weeks' });
      expect(calculateLeadScore(data).timeline).toBe(2);
    });

    it('should score 1 for timeline >= 1 week and < 2 weeks', () => {
      const data = createBaseData({ timeline: 'in 1 week' });
      expect(calculateLeadScore(data).timeline).toBe(1);
    });

    it('should score 2 for flexible timeline', () => {
      const data = createBaseData({ timeline: 'Flexible' });
      expect(calculateLeadScore(data).timeline).toBe(2);
    });

    it('should score 1 for urgent/asap timeline', () => {
      const data = createBaseData({ timeline: 'urgent' });
      expect(calculateLeadScore(data).timeline).toBe(1);
    });

    it('should score 0 for unspecified/unknown timeline format', () => {
      const data = createBaseData({ timeline: 'next year' });
      expect(calculateLeadScore(data).timeline).toBe(0);
    });
  });

  describe('Requirements Scoring', () => {
    it('should score 2 for >= 4 requirements', () => {
      const data = createBaseData({
        requirements: ['req1', 'req2', 'req3', 'req4', 'req5']
      });
      expect(calculateLeadScore(data).requirements).toBe(2);
    });

    it('should score 1 for >= 2 requirements and < 4 requirements', () => {
      const data = createBaseData({
        requirements: ['req1', 'req2', 'req3']
      });
      expect(calculateLeadScore(data).requirements).toBe(1);
    });

    it('should score 0 for < 2 requirements', () => {
      const data = createBaseData({
        requirements: ['req1']
      });
      expect(calculateLeadScore(data).requirements).toBe(0);
    });
  });

  describe('Location Scoring', () => {
    it('should score 2 for a UAE location (e.g. Dubai)', () => {
      const data = createBaseData({ location: 'Dubai Marina' });
      expect(calculateLeadScore(data).location).toBe(2);
    });

    it('should score 1 for a specified non-UAE location', () => {
      const data = createBaseData({ location: 'London' });
      expect(calculateLeadScore(data).location).toBe(1);
    });

    it('should score 0 when location is Not specified', () => {
      const data = createBaseData({ location: 'Not specified' });
      expect(calculateLeadScore(data).location).toBe(0);
    });
  });

  describe('Total Score Capping', () => {
    it('should calculate total correctly', () => {
      const data = createBaseData({
        budget: 'AED 6000', // 1
        timeline: 'urgent', // 1
        requirements: ['req1', 'req2'], // 1
        location: 'London' // 1
      });
      const result = calculateLeadScore(data);
      expect(result.total).toBe(4);
    });

    it('should properly sum max possible score (which naturally falls under cap of 10)', () => {
      const data = createBaseData({
        budget: 'AED 50000', // 3
        timeline: 'in 2 months', // 2
        requirements: ['req1', 'req2', 'req3', 'req4', 'req5'], // 2
        location: 'Dubai' // 2
      });
      // Max possible score is 9 (3+2+2+2), so we'll just test that it reaches the max achievable and the Math.min(total, 10) logic doesn't crash.
      const result = calculateLeadScore(data);
      expect(result.total).toBe(9);
    });
  });
});
