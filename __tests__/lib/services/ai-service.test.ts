import { aiService, ParsedEmailData } from '@/lib/services/ai-service';

// Mock fetch
global.fetch = jest.fn();

describe('aiService', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('parseEmail', () => {
    it('should successfully parse email', async () => {
      const mockResponse = {
        parsed: {
          clientName: 'John Doe',
          projectType: 'Wedding',
          budget: '5000',
          timeline: '3 months',
          location: 'NYC',
          requirements: ['Photos', 'Video']
        },
        score: {
          budget: 10,
          timeline: 8,
          requirements: 9,
          location: 10,
          total: 37
        }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.parseEmail('Test email content');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/ai/parse-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailText: 'Test email content' }),
      });
    });

    it('should throw an error on failed parse', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(aiService.parseEmail('Test email content')).rejects.toThrow('Failed to parse email');
    });
  });

  describe('scoreLoad', () => {
    const mockParsedData: ParsedEmailData = {
      clientName: 'John Doe',
      projectType: 'Wedding',
      budget: '5000',
      timeline: '3 months',
      location: 'NYC',
      requirements: ['Photos']
    };

    it('should successfully score a lead', async () => {
      const mockScore = {
        budget: 10,
        timeline: 8,
        requirements: 9,
        location: 10,
        total: 37
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ score: mockScore }),
      });

      const result = await aiService.scoreLoad(mockParsedData);

      expect(result).toEqual(mockScore);
      expect(global.fetch).toHaveBeenCalledWith('/api/ai/score-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parsedData: mockParsedData }),
      });
    });

    it('should throw an error on failed score', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(aiService.scoreLoad(mockParsedData)).rejects.toThrow('Failed to score lead');
    });
  });

  describe('generateMoodBoard', () => {
    it('should successfully generate a mood board', async () => {
      const mockResponse = {
        suggestions: ['Bright colors', 'Vintage feel'],
        keywords: ['vintage', 'bright', 'cheerful']
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.generateMoodBoard('A cheerful wedding', 'vintage');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/ai/generate-moodboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'A cheerful wedding', style: 'vintage' }),
      });
    });

    it('should throw an error on failed mood board generation', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(aiService.generateMoodBoard('test', 'test style')).rejects.toThrow('Failed to generate mood board');
    });
  });

  describe('generateSocialCaption', () => {
    it('should successfully generate a social caption', async () => {
      const mockParams = {
        platform: 'Instagram',
        projectType: 'Wedding',
        tone: 'professional',
        keywords: ['wedding', 'love']
      };

      const mockResponse = {
        caption: 'Beautiful wedding today!',
        hashtags: ['#wedding', '#love']
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.generateSocialCaption(mockParams);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/ai/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockParams),
      });
    });

    it('should throw an error on failed caption generation', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(aiService.generateSocialCaption({
        platform: 'Instagram',
        projectType: 'Wedding'
      })).rejects.toThrow('Failed to generate caption');
    });
  });
});
