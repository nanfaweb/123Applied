import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/server';

// Helper to get user from session
async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// GET: The _req parameter is required by Next.js but unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = await createClient();
  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', user.id)
    .single();
  // Fetch preferences
  const { data: companies } = await supabase
    .from('user_companies')
    .select('company_name')
    .eq('user_id', user.id);
  const { data: locations } = await supabase
    .from('user_locations')
    .select('location_name')
    .eq('user_id', user.id);
  const { data: jobRoles } = await supabase
    .from('user_jobs')
    .select('job_title')
    .eq('user_id', user.id);
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }
  return NextResponse.json({
    profile: {
      fullName: profile.full_name,
      email: profile.email,
      profilePicture: profile.avatar_url,
    },
    preferences: {
      companies: companies?.map((c: { company_name: string }) => c.company_name) || [],
      locations: locations?.map((l: { location_name: string }) => l.location_name) || [],
      jobRoles: jobRoles?.map((j: { job_title: string }) => j.job_title) || [],
    },
  });
}

// POST: The _req parameter is required by Next.js and used for req.json()
export async function POST(_req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = await createClient();
  const body = await _req.json();
  const { profile, preferences } = body;
  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: profile.fullName,
      avatar_url: profile.profilePicture,
    })
    .eq('id', user.id);
  // Replace preferences (delete old, insert new)
  // Companies
  await supabase.from('user_companies').delete().eq('user_id', user.id);
  if (preferences.companies?.length) {
    await supabase.from('user_companies').insert(
      preferences.companies.map((company: string) => ({ user_id: user.id, company_name: company }))
    );
  }
  // Locations
  await supabase.from('user_locations').delete().eq('user_id', user.id);
  if (preferences.locations?.length) {
    await supabase.from('user_locations').insert(
      preferences.locations.map((location: string) => ({ user_id: user.id, location_name: location }))
    );
  }
  // Job Roles
  await supabase.from('user_jobs').delete().eq('user_id', user.id);
  if (preferences.jobRoles?.length) {
    await supabase.from('user_jobs').insert(
      preferences.jobRoles.map((job: string) => ({ user_id: user.id, job_title: job }))
    );
  }
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 