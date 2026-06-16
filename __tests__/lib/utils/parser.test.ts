import { calculateLeadScore } from '@/lib/utils/parser';
import { ParsedData } from '@/types';

describe('calculateLeadScore', () => {
  it('should return 0 for requirementsScore when requirements is an empty array', () => {
    const data: ParsedData = {
      clientName: 'Test Client',
      projectType: 'Wedding',
      budget: 'AED 1000',
      timeline: 'Flexible',
      location: 'Not specified',
      requirements: [],
      rawText: 'Test raw text',
    };

    const score = calculateLeadScore(data);

    expect(score.requirements).toBe(0);
  });
});
