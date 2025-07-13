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
    // Get user's billing history from billing_history table
    const { data: billingHistory, error: billingHistoryError } = await supabase
      .from('billing_history')
      .select(`
        id,
        created_at,
        amount,
        status,
        plans (
          id,
          name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (billingHistoryError) {
      console.error('Error fetching billing history:', billingHistoryError);
      return NextResponse.json({ error: billingHistoryError.message }, { status: 500 });
    }

    // Transform the data to match the expected format
    const history = billingHistory?.map(bh => {
      // Handle the plans object which could be an array or single object
      const planData = Array.isArray(bh.plans) ? bh.plans[0] : bh.plans;
      return {
        id: bh.id,
        created_at: bh.created_at,
        amount: bh.amount,
        status: bh.status,
        plans: {
          name: planData?.name || 'Unknown Plan'
        }
      };
    }) || [];

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error in /api/billing/history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 