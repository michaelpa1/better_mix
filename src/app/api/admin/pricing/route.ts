import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all pricing tiers
    const { data: pricingTiers, error: tiersError } = await supabase
      .from('pricing_tiers')
      .select('*')
      .order('created_at', { ascending: false });

    if (tiersError) {
      console.error('Error fetching pricing tiers:', tiersError);
      return NextResponse.json(
        { error: 'Failed to fetch pricing tiers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      pricingTiers: pricingTiers || [] 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse request body
    const { name, per_min_credit_cost, preview_free, active } = await request.json();
    
    if (!name || per_min_credit_cost === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, per_min_credit_cost' },
        { status: 400 }
      );
    }

    // Create pricing tier
    const { data, error } = await supabase
      .from('pricing_tiers')
      .insert({
        name,
        per_min_credit_cost,
        preview_free: preview_free ?? true,
        active: active ?? true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating pricing tier:', error);
      return NextResponse.json(
        { error: 'Failed to create pricing tier' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      pricingTier: data 
    }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse request body
    const { id, name, per_min_credit_cost, preview_free, active } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing pricing tier id' },
        { status: 400 }
      );
    }

    // Update pricing tier
    const { data, error } = await supabase
      .from('pricing_tiers')
      .update({
        name,
        per_min_credit_cost,
        preview_free,
        active
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pricing tier:', error);
      return NextResponse.json(
        { error: 'Failed to update pricing tier' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      pricingTier: data 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get id from URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing pricing tier id' },
        { status: 400 }
      );
    }

    // Delete pricing tier
    const { error } = await supabase
      .from('pricing_tiers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting pricing tier:', error);
      return NextResponse.json(
        { error: 'Failed to delete pricing tier' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}