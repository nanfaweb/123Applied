import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../../../utils/supabase/server';

// GET: Fetch applications for a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Authentication error:', authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is admin
  if (user.email !== '123applied.info@gmail.com') {
    console.error('Non-admin user attempted to access admin data:', user.email);
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }
  
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', params.id)
      .order('date_applied', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    return NextResponse.json({ applications: data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create new application
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Authentication error:', authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is admin
  if (user.email !== '123applied.info@gmail.com') {
    console.error('Non-admin user attempted to access admin data:', user.email);
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    const { company, role, salary, status, date } = body;

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: params.id,
        company,
        role_title: role,
        salary,
        status,
        date_applied: date
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
    }

    return NextResponse.json({ application: data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update application
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Authentication error:', authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is admin
  if (user.email !== '123applied.info@gmail.com') {
    console.error('Non-admin user attempted to access admin data:', user.email);
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    const { applicationId, company, role, salary, status, date } = body;

    const { data, error } = await supabase
      .from('applications')
      .update({
        company,
        role_title: role,
        salary,
        status,
        date_applied: date
      })
      .eq('id', applicationId)
      .eq('user_id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    return NextResponse.json({ application: data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Authentication error:', authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is admin
  if (user.email !== '123applied.info@gmail.com') {
    console.error('Non-admin user attempted to access admin data:', user.email);
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId)
      .eq('user_id', params.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 