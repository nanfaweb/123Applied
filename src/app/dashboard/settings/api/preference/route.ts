import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../../utils/supabase/server';

const TABLE_MAP = {
  companies: 'user_companies',
  locations: 'user_locations',
  jobRoles: 'user_jobs',
};
const COLUMN_MAP = {
  companies: 'company_name',
  locations: 'location_name',
  jobRoles: 'job_title',
};

type PreferenceType = keyof typeof TABLE_MAP;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { type, value } = await req.json();
  if (!type || !value || !(type in TABLE_MAP) || !(type in COLUMN_MAP)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const table = TABLE_MAP[type as PreferenceType];
  const column = COLUMN_MAP[type as PreferenceType];
  // Insert, ignore duplicates
  const { error } = await supabase
    .from(table)
    .insert({ user_id: user.id, [column]: value })
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { type, value } = await req.json();
  if (!type || !value || !(type in TABLE_MAP) || !(type in COLUMN_MAP)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const table = TABLE_MAP[type as PreferenceType];
  const column = COLUMN_MAP[type as PreferenceType];
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('user_id', user.id)
    .eq(column, value);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 