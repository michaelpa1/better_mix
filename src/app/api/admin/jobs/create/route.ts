import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';

interface JobCreateRequest {
  filename: string;
  size: number;
  service: string;
  mode: string;
  estimatedCredits: number;
  resultUrl?: string;
  analysisSummary?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: JobCreateRequest = await request.json();
    
    // Validate required fields
    if (!body.filename || !body.size || !body.service || !body.mode || !body.estimatedCredits) {
      return NextResponse.json(
        { error: 'Missing required fields: filename, size, service, mode, estimatedCredits' },
        { status: 400 }
      );
    }

    // Insert job record
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        user_id: user.id,
        filename: body.filename,
        size_bytes: body.size,
        service: body.service,
        mode: body.mode,
        estimated_credits: body.estimatedCredits,
        result_url: body.resultUrl || null,
        analysis_summary: body.analysisSummary || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      return NextResponse.json(
        { error: 'Failed to create job record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      job: data 
    }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}