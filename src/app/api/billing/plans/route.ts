import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all available plans
    const { data: plans, error: plansError } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: true });

    if (plansError) {
      console.error('Error fetching plans:', plansError);
      return NextResponse.json({ error: plansError.message }, { status: 500 });
    }

    return NextResponse.json({ plans: plans || [] });
  } catch (error) {
    console.error('Error in /api/billing/plans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 