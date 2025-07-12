import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../../../utils/supabase/server';

export async function PATCH(
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
    const { lettersRemaining, resumesRemaining } = body;

    // Update user plan credits
    const { error } = await supabase
      .from('user_plans')
      .update({
        letters_remaining: lettersRemaining,
        resumes_remaining: resumesRemaining
      })
      .eq('user_id', params.id)
      .order('activated_at', { ascending: false })
      .limit(1);

    if (error) {
      return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 