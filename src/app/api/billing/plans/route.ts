import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: plans, error } = await supabase
    .from('plans')
    .select('*')
    .order('price', { ascending: true });
  if (error) return NextResponse.json({ plans: [] });
  return NextResponse.json({ plans });
} 