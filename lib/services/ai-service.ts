const AI_API_BASE = '/api/ai';

export interface ParsedEmailData {
  clientName: string;
  projectType: string;
  budget: string;
  timeline: string;
  location: string;
  requirements: string[];
}

export interface LeadScoreBreakdown {
  budget: number;
  timeline: number;
  requirements: number;
  location: number;
  total: number;
}

export const aiService = {
  async parseEmail(emailText: string): Promise<{ parsed: ParsedEmailData; score: LeadScoreBreakdown }> {
    const response = await fetch(`${AI_API_BASE}/parse-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailText }),
    });

    if (!response.ok) throw new Error('Failed to parse email');

    const data = await response.json();
    return data;
  },

  async scoreLoad(parsedData: ParsedEmailData): Promise<LeadScoreBreakdown> {
    const response = await fetch(`${AI_API_BASE}/score-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parsedData }),
    });

    if (!response.ok) throw new Error('Failed to score lead');

    const data = await response.json();
    return data.score;
  },

  async generateMoodBoard(prompt: string, style: string): Promise<{ suggestions: string[]; keywords: string[] }> {
    const response = await fetch(`${AI_API_BASE}/generate-moodboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, style }),
    });

    if (!response.ok) throw new Error('Failed to generate mood board');

    const data = await response.json();
    return data;
  },

  async generateSocialCaption(params: {
    platform: string;
    projectType: string;
    tone?: string;
    keywords?: string[];
  }): Promise<{ caption: string; hashtags: string[] }> {
    const response = await fetch(`${AI_API_BASE}/generate-caption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) throw new Error('Failed to generate caption');

    const data = await response.json();
    return data;
  },
};
