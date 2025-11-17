import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// GET /api/leads - Get all leads for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const source = searchParams.get('source');
    const minScore = searchParams.get('minScore');

    let query = supabase
      .from('leads')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (stage) {
      query = query.eq('stage', stage);
    }

    if (source) {
      query = query.eq('source', source);
    }

    if (minScore) {
      query = query.gte('score', parseInt(minScore));
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          user_id: session.user.id,
          name: body.name,
          email: body.email,
          phone: body.phone || '',
          project_type: body.projectType || '',
          budget: body.budget || '',
          timeline: body.timeline || '',
          source: body.source || 'website',
          stage: body.stage || 'new',
          score: body.score || 0,
          budget_score: body.budgetScore || 0,
          timeline_score: body.timelineScore || 0,
          engagement_score: body.engagementScore || 0,
          location: body.location || '',
          requirements: body.requirements || [],
          tags: body.tags || [],
          referred_by: body.referredBy || '',
          notes: body.notes || '',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
