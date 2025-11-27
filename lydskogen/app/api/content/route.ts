import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('*');

    if (error) {
      // If table doesn't exist or other error, fallback to default content
      console.warn('Error fetching site content (using defaults):', error.message);
      return NextResponse.json({
        hero_tagline: 'Når vi lytter til naturen, åpner den for detaljer vi ellers ville gått forbi. De samme nyansene prøver vi å fange i kunsten'
      });
    }

    // Convert array to object { key: value }
    const content = (data || []).reduce((acc: Record<string, string>, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    // Ensure defaults if keys are missing
    if (!content['hero_tagline']) {
        content['hero_tagline'] = 'Når vi lytter til naturen, åpner den for detaljer vi ellers ville gått forbi. De samme nyansene prøver vi å fange i kunsten';
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Server error fetching content:', error);
    return NextResponse.json({
      hero_tagline: 'Når vi lytter til naturen, åpner den for detaljer vi ellers ville gått forbi. De samme nyansene prøver vi å fange i kunsten'
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, section, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('site_content')
      .upsert({ 
        key, 
        value, 
        section: section || 'general',
        description: description || '',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating content:', error);
      return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error updating content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

