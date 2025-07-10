import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ history: [] });
  const supabase = await createClient();
  const { data: history, error } = await supabase
    .from('billing_history')
    .select('*, plans(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ history: [] });
  return NextResponse.json({ history });
} 