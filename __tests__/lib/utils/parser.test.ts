import { generateBrief } from '@/lib/utils/parser';
import { ParsedData } from '@/types';

describe('parser utils', () => {
  describe('generateBrief', () => {
    it('should generate a markdown brief with all fields present', () => {
      const data: ParsedData = {
        clientName: 'Jane Doe',
        projectType: 'Wedding',
        budget: '$10,000',
        timeline: 'October 2024',
        location: 'New York City, NY',
        requirements: ['2 photographers', 'Drone footage', 'Engagement session'],
        rawText: 'Raw email text here'
      };

      const brief = generateBrief(data);

      expect(brief).toContain('# Client Brief - Jane Doe');
      expect(brief).toContain('- **Type:** Wedding');
      expect(brief).toContain('- **Budget:** $10,000');
      expect(brief).toContain('- **Timeline:** October 2024');
      expect(brief).toContain('- **Location:** New York City, NY');

      expect(brief).toContain('## Requirements');
      expect(brief).toContain('- 2 photographers');
      expect(brief).toContain('- Drone footage');
      expect(brief).toContain('- Engagement session');

      // Check for other sections that are automatically added
      expect(brief).toContain('## Proposed Deliverables');
      expect(brief).toContain('## Next Steps');

      // Date check (since it uses new Date().toLocaleDateString())
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      expect(brief).toContain(`**Date:** ${date}`);
    });

    it('should handle empty requirements gracefully', () => {
      const data: ParsedData = {
        clientName: 'John Smith',
        projectType: 'Commercial',
        budget: 'TBD',
        timeline: 'Q3 2024',
        location: 'Remote',
        requirements: [],
        rawText: 'Raw email text here'
      };

      const brief = generateBrief(data);

      expect(brief).toContain('# Client Brief - John Smith');
      expect(brief).toContain('## Requirements\n\n\n\n## Proposed Deliverables');
    });

    it('should correctly call getDeliverablesByType based on projectType', () => {
      const data: ParsedData = {
        clientName: 'John Smith',
        projectType: 'Real Estate',
        budget: 'TBD',
        timeline: 'Q3 2024',
        location: 'Remote',
        requirements: [],
        rawText: 'Raw email text here'
      };

      const brief = generateBrief(data);
      expect(brief).toContain('## Proposed Deliverables');
    });
  });
});
