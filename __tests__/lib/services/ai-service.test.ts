import { aiService } from '@/lib/services/ai-service';

// Mock fetch
global.fetch = jest.fn();

describe('aiService', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('generateMoodBoard', () => {
    it('should successfully generate a mood board with suggestions and keywords', async () => {
      const mockResponse = {
        suggestions: ['Suggestion 1', 'Suggestion 2'],
        keywords: ['keyword1', 'keyword2'],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const prompt = 'Test prompt';
      const style = 'Test style';
      const result = await aiService.generateMoodBoard(prompt, style);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/ai/generate-moodboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });
    });

    it('should throw an error if the API request fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const prompt = 'Test prompt';
      const style = 'Test style';

      await expect(aiService.generateMoodBoard(prompt, style)).rejects.toThrow('Failed to generate mood board');
    });
  });
});
