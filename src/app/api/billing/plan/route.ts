import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ plan: null });
  const supabase = await createClient();
  const { data: userPlan } = await supabase
    .from('user_plans')
    .select('*, plans(*)')
    .eq('user_id', user.id)
    .order('activated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!userPlan || !userPlan.plans) return NextResponse.json({ plan: null });
  return NextResponse.json({
    plan: {
      name: userPlan.plans.name,
      lettersRemaining: userPlan.letters_remaining,
      totalLetters: userPlan.plans.letter_limit,
      resumesRemaining: userPlan.resumes_remaining,
      totalResumes: userPlan.plans.resume_limit,
    }
  });
} 