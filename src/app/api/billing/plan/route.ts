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

  // Auto-delete expired plans (letters_remaining = 0 AND resumes_remaining = 0)
  await supabase
    .from('user_plans')
    .delete()
    .eq('user_id', user.id)
    .eq('letters_remaining', 0)
    .eq('resumes_remaining', 0);

  try {
    // Get the user's most recent plan with remaining credits
    const { data: userPlans, error: userPlansError } = await supabase
      .from('user_plans')
      .select(`
        *,
        plans (
          id,
          name,
          price,
          letter_limit,
          resume_limit
        )
      `)
      .eq('user_id', user.id)
      .order('activated_at', { ascending: false });

    if (userPlansError) {
      console.error('Error fetching user plans:', userPlansError);
      return NextResponse.json({ error: userPlansError.message }, { status: 500 });
    }

    // Find the most recent plan with remaining credits
    const activePlan = userPlans?.find(up => 
      up.resumes_remaining > 0 || up.letters_remaining > 0
    );

    if (!activePlan) {
      return NextResponse.json({ plan: null });
    }

    // Calculate totals (remaining + used)
    const lettersUsed = activePlan.letters_remaining === 0 ? 
      (activePlan.plans?.letter_limit || 0) : 
      (activePlan.plans?.letter_limit || 0) - activePlan.letters_remaining;
    
    const resumesUsed = activePlan.resumes_remaining === 0 ? 
      (activePlan.plans?.resume_limit || 0) : 
      (activePlan.plans?.resume_limit || 0) - activePlan.resumes_remaining;

    const plan = {
      name: activePlan.plans?.name || 'Unknown Plan',
      lettersRemaining: activePlan.letters_remaining || 0,
      totalLetters: (activePlan.letters_remaining || 0) + lettersUsed,
      resumesRemaining: activePlan.resumes_remaining || 0,
      totalResumes: (activePlan.resumes_remaining || 0) + resumesUsed,
      cardBrand: 'VISA', // Default values - can be enhanced later
      cardLast4: '1234',
    };

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error in /api/billing/plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 