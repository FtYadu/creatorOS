import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// POST /api/ai/generate-caption - Generate social media caption
export async function POST(request: NextRequest) {
  let platform = 'instagram';
  let projectType = 'Photography';

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    platform = body.platform;
    projectType = body.projectType;
    const tone = body.tone;
    const keywords = body.keywords;

    if (!platform || !projectType) {
      return NextResponse.json(
        { error: 'Platform and project type are required' },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022', // Use Haiku for faster, cheaper responses
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `You are a social media expert for photographers and videographers. Generate an engaging ${platform} caption for a ${projectType} project.

${tone ? `Tone: ${tone}` : 'Tone: Professional but friendly'}
${keywords && keywords.length > 0 ? `Include these keywords: ${keywords.join(', ')}` : ''}

Requirements:
- Platform: ${platform}
- Project Type: ${projectType}
- Include appropriate emojis (but don't overdo it)
- Keep it engaging and authentic
- Suggest 5-10 relevant hashtags

Return as JSON:
{
  "caption": "the caption text",
  "hashtags": ["hashtag1", "hashtag2", ...]
}

Respond ONLY with the JSON object.`
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '{}';
    let result;

    try {
      result = JSON.parse(responseText);
    } catch (e) {
      // Fallback
      result = {
        caption: `Check out this amazing ${projectType} project! 📸✨`,
        hashtags: generateFallbackHashtags(platform, projectType),
      };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Caption Error:', error);

    if (error.status === 401 || !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        caption: `Excited to share this ${projectType} project! 📸`,
        hashtags: generateFallbackHashtags(platform, projectType),
        warning: 'Using fallback generation (AI unavailable)',
      });
    }

    return NextResponse.json({ error: 'Failed to generate caption' }, { status: 500 });
  }
}

function generateFallbackHashtags(platform: string, projectType: string): string[] {
  const base = ['photography', 'photographer', 'photooftheday'];
  const typeSpecific: Record<string, string[]> = {
    Wedding: ['weddingphotography', 'weddingday', 'bride', 'groom'],
    Corporate: ['corporatephotography', 'businessphotography', 'professional'],
    Event: ['eventphotography', 'events', 'eventplanner'],
    Portrait: ['portraitphotography', 'portraits', 'portraitmood'],
    Product: ['productphotography', 'productstyling', 'ecommerce'],
    Fashion: ['fashionphotography', 'fashionshoot', 'model'],
  };

  return [...base, ...(typeSpecific[projectType] || ['creative'])];
}
