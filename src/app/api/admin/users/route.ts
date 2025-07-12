import { NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/server';

export async function GET() {
  // Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

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
    // Get all users from profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error('Profiles error:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch users: ' + profilesError.message }, { status: 500 });
    }

    // Get all user plans with plan details
    const { data: userPlans, error: plansError } = await supabase
      .from('user_plans')
      .select(`
        *,
        plans (
          name,
          price,
          letter_limit,
          resume_limit
        )
      `)
      .order('activated_at', { ascending: false });

    if (plansError) {
      console.error('Plans error:', plansError);
      return NextResponse.json({ error: 'Failed to fetch user plans: ' + plansError.message }, { status: 500 });
    }

    // Get all applications
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('*')
      .order('date_applied', { ascending: false });

    if (appsError) {
      console.error('Applications error:', appsError);
      return NextResponse.json({ error: 'Failed to fetch applications: ' + appsError.message }, { status: 500 });
    }

    // Get all documents
    const { data: documents, error: docsError } = await supabase
      .from('docs')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (docsError) {
      console.error('Documents error:', docsError);
      return NextResponse.json({ error: 'Failed to fetch documents: ' + docsError.message }, { status: 500 });
    }

    // Get last active data from auth.users (using service role)
    const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers();
    
    if (authUsersError) {
      console.error('Auth users error:', authUsersError);
      // Continue without last active data if we can't fetch it
    }

    // Combine data for each user
    const users = profiles?.map(profile => {
      const userPlan = userPlans?.find(up => up.user_id === profile.id);
      const userApplications = applications?.filter(app => app.user_id === profile.id) || [];
      const userDocuments = documents?.filter(doc => doc.user_id === profile.id) || [];
      const authUser = authUsers?.users?.find(au => au.id === profile.id);
      
      // Get LinkedIn URL
      const linkedInDoc = userDocuments.find(doc => doc.external_url && !doc.file_url);
      const linkedInUrl = linkedInDoc?.external_url || null;

      // Always use profile.email if it exists, otherwise use authUser.email
      const email = profile.email || authUser?.email || null;

      return {
        id: profile.id,
        name: profile.full_name || 'Unknown User',
        email: email, // never fallback to userID
        plan: userPlan?.plans?.name || 'No Plan',
        lettersRemaining: userPlan?.letters_remaining || 0,
        resumesRemaining: userPlan?.resumes_remaining || 0,
        totalApplications: userApplications.length,
        lastActive: authUser?.last_sign_in_at ? new Date(authUser.last_sign_in_at).toLocaleDateString() : 'Never',
        linkedInUrl: linkedInUrl,
        documents: userDocuments.map(doc => ({
          type: doc.file_url ? 'resume' : 'linkedin',
          name: doc.file_url ? 'Resume.pdf' : 'LinkedIn Profile',
          uploadDate: doc.uploaded_at?.split('T')[0] || 'Unknown',
          url: doc.external_url || doc.file_url
        })),
        applications: userApplications.map(app => ({
          id: app.id,
          company: app.company,
          role: app.role_title,
          salary: app.salary || 'Not specified',
          status: app.status,
          date: app.date_applied?.split('T')[0] || 'Unknown'
        }))
      };
    }) || [];

    // Filter out the admin user from the list
    const filteredUsers = users.filter(user => user.email !== '123applied.info@gmail.com');
    


    return NextResponse.json({ users: filteredUsers });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error as Error).message }, { status: 500 });
  }
} 