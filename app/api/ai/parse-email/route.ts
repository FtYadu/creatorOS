import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// POST /api/ai/parse-email - Parse inquiry email and score lead
export async function POST(request: NextRequest) {
  let emailText = '';

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    emailText = body.emailText;

    if (!emailText) {
      return NextResponse.json({ error: 'Email text is required' }, { status: 400 });
    }

    // Use Anthropic Claude to parse the email
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are an AI assistant helping photographers and videographers parse client inquiry emails. Extract the following information from this email and return it as a JSON object:

{
  "clientName": "extracted client name or 'Unknown'",
  "projectType": "Wedding|Corporate|Event|Portrait|Product|Commercial|Real Estate|Fashion|Other",
  "budget": "specific amount mentioned or estimate range",
  "timeline": "when they need the work done",
  "location": "where the shoot will take place",
  "requirements": ["array", "of", "specific", "requirements"]
}

Email:
${emailText}

Respond ONLY with the JSON object, no other text.`
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '{}';
    let parsed;

    try {
      parsed = JSON.parse(responseText);
    } catch (e) {
      // Fallback to basic parsing if AI response isn't valid JSON
      parsed = {
        clientName: 'Unknown',
        projectType: 'Other',
        budget: 'Not specified',
        timeline: 'Not specified',
        location: 'Not specified',
        requirements: [],
      };
    }

    // Calculate lead score
    const score = calculateLeadScore(parsed);

    return NextResponse.json({
      parsed,
      score,
      rawText: emailText,
    });
  } catch (error: any) {
    console.error('AI Parse Error:', error);

    // Fallback to rule-based parsing if AI fails
    if (error.status === 401 || !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        parsed: fallbackParse(emailText),
        score: { budget: 50, timeline: 50, requirements: 50, location: 50, total: 50 },
        rawText: emailText,
        warning: 'Using fallback parsing (AI unavailable)',
      });
    }

    return NextResponse.json({ error: 'Failed to parse email' }, { status: 500 });
  }
}

function calculateLeadScore(parsed: any): any {
  let budgetScore = 0;
  let timelineScore = 0;
  let requirementsScore = 0;
  let locationScore = 0;

  // Budget scoring (0-100)
  const budgetText = parsed.budget?.toLowerCase() || '';
  if (budgetText.includes('$') || budgetText.match(/\d+/)) {
    const amount = parseInt(budgetText.match(/\d+/)?.[0] || '0');
    if (amount > 5000) budgetScore = 100;
    else if (amount > 2000) budgetScore = 75;
    else if (amount > 1000) budgetScore = 50;
    else if (amount > 0) budgetScore = 25;
  } else if (budgetText.includes('flexible') || budgetText.includes('open')) {
    budgetScore = 70;
  } else {
    budgetScore = 30;
  }

  // Timeline scoring
  const timelineText = parsed.timeline?.toLowerCase() || '';
  if (timelineText.includes('urgent') || timelineText.includes('asap') || timelineText.includes('soon')) {
    timelineScore = 90;
  } else if (timelineText.match(/\d+\s*(week|month)/)) {
    timelineScore = 70;
  } else if (timelineText.includes('flexible')) {
    timelineScore = 50;
  } else {
    timelineScore = 40;
  }

  // Requirements scoring
  requirementsScore = Math.min(100, (parsed.requirements?.length || 0) * 20);

  // Location scoring
  if (parsed.location && parsed.location !== 'Not specified') {
    locationScore = 80;
  } else {
    locationScore = 30;
  }

  const total = Math.round((budgetScore + timelineScore + requirementsScore + locationScore) / 4);

  return {
    budget: budgetScore,
    timeline: timelineScore,
    requirements: requirementsScore,
    location: locationScore,
    total,
  };
}

function fallbackParse(emailText: string): any {
  const lines = emailText.split('\n');
  const firstLine = lines.find(l => l.trim().length > 0) || '';

  return {
    clientName: extractName(emailText) || 'Unknown',
    projectType: extractProjectType(emailText),
    budget: extractBudget(emailText) || 'Not specified',
    timeline: extractTimeline(emailText) || 'Not specified',
    location: extractLocation(emailText) || 'Not specified',
    requirements: extractRequirements(emailText),
  };
}

function extractName(text: string): string {
  const nameMatch = text.match(/(?:my name is|i'm|i am)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
  return nameMatch ? nameMatch[1] : '';
}

function extractProjectType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('wedding')) return 'Wedding';
  if (lower.includes('corporate') || lower.includes('business')) return 'Corporate';
  if (lower.includes('event') || lower.includes('party')) return 'Event';
  if (lower.includes('portrait') || lower.includes('headshot')) return 'Portrait';
  if (lower.includes('product')) return 'Product';
  if (lower.includes('real estate') || lower.includes('property')) return 'Real Estate';
  if (lower.includes('fashion')) return 'Fashion';
  return 'Other';
}

function extractBudget(text: string): string {
  const budgetMatch = text.match(/\$[\d,]+/);
  return budgetMatch ? budgetMatch[0] : '';
}

function extractTimeline(text: string): string {
  const timelineMatch = text.match(/(next\s+\w+|in\s+\d+\s+\w+|\d+\/\d+\/\d+)/i);
  return timelineMatch ? timelineMatch[0] : '';
}

function extractLocation(text: string): string {
  const locationMatch = text.match(/(?:in|at|location:)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
  return locationMatch ? locationMatch[1] : '';
}

function extractRequirements(text: string): string[] {
  const requirements: string[] = [];
  const lower = text.toLowerCase();

  if (lower.includes('photo')) requirements.push('Photography');
  if (lower.includes('video')) requirements.push('Videography');
  if (lower.includes('edit')) requirements.push('Editing');
  if (lower.includes('drone') || lower.includes('aerial')) requirements.push('Drone/Aerial');
  if (lower.includes('album')) requirements.push('Photo Album');

  return requirements;
}
