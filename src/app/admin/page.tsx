"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, User, FileText, Edit3, CreditCard, Plus, ArrowLeft, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabase/client';
import { useUser } from '../../context/UserContext';

// Type definitions
interface Document {
  type: 'resume' | 'linkedin';
  name?: string;
  uploadDate?: string;
  url?: string;
  addedDate?: string;
}

interface Application {
  id: number;
  company: string;
  role: string;
  salary: string;
  status: 'submitted' | 'in_review' | 'interview' | 'offer' | 'rejected' | 'not_selected';
  date: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  lettersRemaining: number;
  resumesRemaining: number;
  totalApplications: number;
  lastActive: string;
  linkedInUrl: string | null;
  documents: Document[];
  applications: Application[];
  work_status: 'not_started' | 'in_progress' | 'completed'; // Added
}

// Remove placeholderUsers and related logic
// Use users and filteredUsers for the table

type Profile = {
  id: string;
  full_name: string;
  email: string;
  // The following are mock/placeholder fields for now
  plan?: string;
  applications?: number;
  status?: string;
};

// Detailed user info type
type UserDetails = {
  plan: string;
  lettersRemaining: number;
  resumesRemaining: number;
  letterLimit: number;
  resumeLimit: number;
  documents: Document[];
  applications: Application[];
};

const AdminPortal = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  // Dashboard stats
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [applicationsSubmitted, setApplicationsSubmitted] = useState<number>(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState<number>(0);
  const [users, setUsers] = useState<Profile[]>([]); // profiles with plan info
  const [usersLoading, setUsersLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // For user detail view
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  // For selected user details
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserDetails | null>(null);

  // 1. Add state for work status and add application modal
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [addAppForm, setAddAppForm] = useState({ company: '', role: '', salary: '', status: 'Applied', date: '' });

  // Add loading state to prevent double insert
  const [addAppLoading, setAddAppLoading] = useState(false);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setStatsLoading(true);
      setUsersLoading(true);
      // 1. Fetch all users from the view (minus admin)
      const { data: profiles } = await supabase
        .from('profile_with_email')
        .select('id, full_name, email');
      // The view should already filter out admin, but double-check in case
      const filteredProfiles = (profiles || []).filter((u: Profile) => u.email !== '123applied.info@gmail.com');

      // 1b. Fetch all user plans (including work_status)
      const { data: userPlans } = await supabase
        .from('user_plans')
        .select('user_id, plans(name), work_status');
      // Map user_id to plan name and work_status
      const planMap: Record<string, string> = {};
      const statusMap: Record<string, string> = {};
      if (userPlans) {
        for (const up of userPlans) {
          // up.plans may be null, an object, or an array
          let planName = 'No Plan';
          if (up.plans) {
            if (Array.isArray(up.plans)) {
              planName = up.plans[0]?.name || 'No Plan';
            } else if (typeof up.plans === 'object' && up.plans !== null && 'name' in up.plans) {
              planName = (up.plans as { name?: string }).name || 'No Plan';
            }
          }
          planMap[up.user_id] = planName;
          statusMap[up.user_id] = up.work_status || 'not_started';
        }
      }

      // 1c. Fetch application counts for each user
      const userIds = filteredProfiles.map(u => u.id);
      let applicationsCountMap: Record<string, number> = {};
      if (userIds.length > 0) {
        const { data: appCounts } = await supabase
          .from('applications')
          .select('user_id, id');
        if (appCounts) {
          applicationsCountMap = appCounts.reduce((acc: Record<string, number>, row: { user_id: string }) => {
            acc[row.user_id] = (acc[row.user_id] || 0) + 1;
            return acc;
          }, {});
        }
      }

      // Merge plan info, work_status, and applications count into users
      const usersWithPlan = filteredProfiles.map((u: Profile) => ({
        ...u,
        plan: planMap[u.id] || 'No Plan',
        status: statusMap[u.id] || 'not_started',
        applications: applicationsCountMap[u.id] || 0,
      }));
      setUsers(usersWithPlan);
      setTotalUsers(usersWithPlan.length);
      setUsersLoading(false);

      // 2. Fetch all files in resumes bucket (may be in folders)
      let totalFiles = 0;
      try {
        // In fetchData, fix folder/file detection for Supabase Storage
        const { data: folders, error: foldersError } = await supabase.storage.from('resumes').list('', { limit: 1000 });
        if (!foldersError && folders) {
          for (const folder of folders) {
            // Supabase Storage FileObject: if .metadata is undefined, it's a folder
            if (!folder.metadata) {
              // It's a folder, list its files
              const { data: files, error: filesError } = await supabase.storage.from('resumes').list(folder.name, { limit: 1000 });
              if (!filesError && files) {
                totalFiles += files.filter(f => f.metadata).length;
              }
            } else {
              // It's a file
              totalFiles += 1;
            }
          }
        }
      } catch {
        // ignore
      }
      setApplicationsSubmitted(totalFiles);

      // 3. Fetch active subscriptions (user_plans count)
      const { count: plansCount } = await supabase
        .from('user_plans')
        .select('id', { count: 'exact', head: true });
      setActiveSubscriptions(plansCount || 0);
      setStatsLoading(false);
    };
    if (!loading && user && user.email === '123applied.info@gmail.com') {
      fetchData();
    }
  }, [user, loading]);

  // Authentication check (unchanged)
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signup');
      return;
    }
    if (!loading && user && user.email !== '123applied.info@gmail.com') {
      router.replace('/dashboard');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  // Use users and filteredUsers for the table
  const filteredUsers = users.filter(u =>
    (u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 1. Add handlers for increment/decrement wired to Supabase
  // Helper to refresh selected user details from DB
  const handleIncrementLetters = async (userId: string) => {
    if (!selectedUserDetails) return;
    if (selectedUserDetails.lettersRemaining >= (selectedUserDetails.letterLimit ?? 0)) return;
    // Optimistically update UI
    setSelectedUserDetails(prev => prev ? { ...prev, lettersRemaining: prev.lettersRemaining + 1 } : prev);
    const { error } = await supabase
      .from('user_plans')
      .update({ letters_remaining: selectedUserDetails.lettersRemaining + 1 })
      .eq('user_id', userId);
    if (error) {
      // Revert if error
      setSelectedUserDetails(prev => prev ? { ...prev, lettersRemaining: prev.lettersRemaining - 1 } : prev);
      alert('Failed to update letters remaining');
    }
  };
  const handleDecrementLetters = async (userId: string) => {
    if (!selectedUserDetails) return;
    if (selectedUserDetails.lettersRemaining <= 0) return;
    // Optimistically update UI
    setSelectedUserDetails(prev => prev ? { ...prev, lettersRemaining: prev.lettersRemaining - 1 } : prev);
    const { error } = await supabase
      .from('user_plans')
      .update({ letters_remaining: selectedUserDetails.lettersRemaining - 1 })
      .eq('user_id', userId);
    if (error) {
      // Revert if error
      setSelectedUserDetails(prev => prev ? { ...prev, lettersRemaining: prev.lettersRemaining + 1 } : prev);
      alert('Failed to update letters remaining');
    }
  };
  const handleIncrementResumes = async (userId: string) => {
    if (!selectedUserDetails) return;
    if (selectedUserDetails.resumesRemaining >= (selectedUserDetails.resumeLimit ?? 0)) return;
    // Optimistically update UI
    setSelectedUserDetails(prev => prev ? { ...prev, resumesRemaining: prev.resumesRemaining + 1 } : prev);
    const { error } = await supabase
      .from('user_plans')
      .update({ resumes_remaining: selectedUserDetails.resumesRemaining + 1 })
      .eq('user_id', userId);
    if (error) {
      // Revert if error
      setSelectedUserDetails(prev => prev ? { ...prev, resumesRemaining: prev.resumesRemaining - 1 } : prev);
      alert('Failed to update resumes remaining');
    }
  };
  const handleDecrementResumes = async (userId: string) => {
    if (!selectedUserDetails) return;
    if (selectedUserDetails.resumesRemaining <= 0) return;
    // Optimistically update UI
    setSelectedUserDetails(prev => prev ? { ...prev, resumesRemaining: prev.resumesRemaining - 1 } : prev);
    const { error } = await supabase
      .from('user_plans')
      .update({ resumes_remaining: selectedUserDetails.resumesRemaining - 1 })
      .eq('user_id', userId);
    if (error) {
      // Revert if error
      setSelectedUserDetails(prev => prev ? { ...prev, resumesRemaining: prev.resumesRemaining + 1 } : prev);
      alert('Failed to update resumes remaining');
    }
  };

  // 2. Add handler for Add Application (modal)
  const handleAddApplication = async () => {
    if (!selectedUser || addAppLoading) return;
    setAddAppLoading(true);
    // Ensure salary is null if empty string
    const salaryValue = addAppForm.salary && addAppForm.salary.trim() !== '' ? addAppForm.salary : null;
    // Defensive: ensure required fields are present
    if (!addAppForm.company || !addAppForm.role || !addAppForm.status) { setAddAppLoading(false); return; }
    // Map UI status to DB status
    const statusMap: Record<string, string> = {
      'Applied': 'submitted',
      'Interview': 'interview',
      'Offer': 'offer',
      'Rejected': 'rejected',
      'In Review': 'in_review',
      'Not Selected': 'not_selected',
    };
    const dbStatus = statusMap[addAppForm.status] || 'submitted';
    // Format date to yyyy-mm-dd
    let date_applied = addAppForm.date;
    if (!date_applied) {
      date_applied = new Date().toISOString().split('T')[0];
    }
    // Insert with correct column names and types
    const { error } = await supabase.from('applications').insert({
      user_id: selectedUser.id,
      company: addAppForm.company,
      role_title: addAppForm.role,
      salary: salaryValue,
      status: dbStatus,
      date_applied,
    });
    setAddAppLoading(false);
    if (error) {
      alert('Failed to add application: ' + error.message);
      console.error('Supabase insert error:', error);
      return;
    }
    setShowAddAppModal(false);
    setAddAppForm({ company: '', role: '', salary: '', status: 'Applied', date: '' });
    setSelectedUser(prev => prev ? { ...prev } : null); // Refresh user details
  };

  // Removed unused getPlanColor
  // Removed unused getStatusColor

  // Removed unused workStatusOptions
  // Removed unused handleWorkStatusChange

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
    } else {
      console.log('Admin signed out successfully');
      router.replace('/signup');
    }
  };

  // Fetch real user details when selectedUser changes
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!selectedUser) {
        setSelectedUserDetails(null);
        return;
      }
      // 1. Fetch plan and credits
      let plan = 'No Plan';
      let lettersRemaining = 0;
      let resumesRemaining = 0;
      let letterLimit = 0;
      let resumeLimit = 0;
      const { data: userPlans } = await supabase
        .from('user_plans')
        .select('letters_remaining, resumes_remaining, plans(id, name)')
        .eq('user_id', selectedUser.id)
        .order('activated_at', { ascending: false });
      if (userPlans && userPlans.length > 0) {
        const up = userPlans[0];
        if (up.plans) {
          if (Array.isArray(up.plans)) {
            plan = up.plans[0]?.name || 'No Plan';
            if (up.plans[0]?.id) {
              // Fetch plan limits from plans table
              const { data: planData } = await supabase
                .from('plans')
                .select('letter_limit, resume_limit')
                .eq('id', up.plans[0].id)
                .single();
              if (planData) {
                letterLimit = planData.letter_limit;
                resumeLimit = planData.resume_limit;
              }
            }
          } else if (typeof up.plans === 'object' && up.plans !== null && 'name' in up.plans) {
            plan = (up.plans as { name?: string }).name || 'No Plan';
            if ((up.plans as { id?: string }).id) {
              const { data: planData } = await supabase
                .from('plans')
                .select('letter_limit, resume_limit')
                .eq('id', (up.plans as { id: string }).id)
                .single();
              if (planData) {
                letterLimit = planData.letter_limit;
                resumeLimit = planData.resume_limit;
              }
            }
          }
        }
        lettersRemaining = up.letters_remaining ?? 0;
        resumesRemaining = up.resumes_remaining ?? 0;
      }
      // 2. Fetch documents (from docs table)
      const { data: docs } = await supabase
        .from('docs')
        .select('file_url, external_url, uploaded_at')
        .eq('user_id', selectedUser.id);
      const documents: Document[] = [];
      if (docs && docs.length > 0) {
        function isFullUrl(url: string) {
          return url.startsWith('http://') || url.startsWith('https://');
        }
        for (const doc of docs) {
          if (doc.file_url) {
            let url = doc.file_url;
            if (!isFullUrl(doc.file_url)) {
              const { data: signedUrlData } = await supabase.storage.from('resumes').createSignedUrl(doc.file_url, 60 * 60); // 1 hour expiry
              url = signedUrlData?.signedUrl || doc.file_url;
            }
            documents.push({ type: 'resume', name: 'Resume.pdf', uploadDate: doc.uploaded_at?.split('T')[0], url });
          }
          if (doc.external_url) {
            documents.push({ type: 'linkedin', url: doc.external_url, addedDate: doc.uploaded_at?.split('T')[0] });
          }
        }
      }
      // 3. Fetch applications
      const { data: apps } = await supabase
        .from('applications')
        .select('id, company, role_title, salary, status, date_applied')
        .eq('user_id', selectedUser.id)
        .order('date_applied', { ascending: false });
      type SupabaseAppRow = {
        id: number;
        company: string;
        role_title: string;
        salary?: string;
        status: 'submitted' | 'in_review' | 'interview' | 'offer' | 'rejected' | 'not_selected';
        date_applied: string;
      };
      const applications: Application[] = (apps || []).map((a: SupabaseAppRow, idx: number) => ({
        id: a.id || idx,
        company: a.company,
        role: a.role_title,
        salary: a.salary || '',
        status: a.status,
        date: a.date_applied,
      }));
      // Remove decrement logic for credits based on applications
      setSelectedUserDetails({
        plan,
        lettersRemaining,
        resumesRemaining,
        letterLimit,
        resumeLimit,
        documents,
        applications,
      });
    };
    if (selectedUser) fetchUserDetails();
  }, [selectedUser]);

  // Helper functions for plan type
  const isStudentPlan = (plan?: string) => plan?.toLowerCase().includes('student');
  const isProfessionalPlan = (plan?: string) => plan?.toLowerCase().includes('professional');

  // Add handler for status change
  const handleStatusChange = async (userId: string, newStatus: string) => {
    // Optimistically update UI
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    // Update in database
    const { error } = await supabase
      .from('user_plans')
      .update({ work_status: newStatus })
      .eq('user_id', userId);
    if (error) {
      alert('Failed to update status');
      // Optionally revert UI
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status } : u));
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show unauthorized message if not admin
  if (!user || user.email !== '123applied.info@gmail.com') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
        <div className="text-white text-xl">Unauthorized Access</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-[#0a0f1c]/95 to-[#1a2233]/95 backdrop-blur-md shadow-md border-b border-slate-900 rounded-b-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image src="/mascot.png" alt="Company Logo" width={36} height={36} className="rounded-full shadow" />
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight" style={{ fontFamily: 'Poppins, Montserrat, Arial, sans-serif' }}>
                Admin Portal
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={profileMenuRef}>
                <button
                  className="w-9 h-9 bg-white border border-slate-300 rounded-full flex items-center justify-center shadow-sm hover:border-pink-400 hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                >
                  <User className="h-5 w-5 text-slate-600" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 animate-fade-in">
                    <button
                      className="block w-full text-left px-3 py-1.5 text-sm text-slate-700 bg-white hover:bg-pink-100 hover:text-pink-700 rounded-lg transition-colors duration-150"
                      onClick={() => { 
                        setProfileMenuOpen(false); 
                        handleSignOut(); 
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedUser ? (
          <div className="space-y-6">
            {/* Back arrow and user name header */}
            <div className="mb-4">
              <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 text-slate-500 hover:text-pink-500 text-base font-semibold focus:outline-none">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Info */}
              <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4 min-h-0 transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:cursor-default">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {selectedUser.full_name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900 mb-1">{selectedUser.full_name}</div>
                  <div className="text-sm text-slate-500 mb-2">{selectedUser.email}</div>
                  <span className="inline-flex w-fit px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">{selectedUserDetails?.plan}</span>
                </div>
              </div>
              {/* Credits */}
              <div className="bg-white rounded-lg shadow p-4 min-h-0 flex flex-col justify-center transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:cursor-default">
                <h3 className="text-base font-semibold text-slate-900 mb-4 mt-1">Credits Remaining</h3>
                <div className="border-b border-slate-200 mb-3"></div>
                <div className="grid grid-cols-1 gap-3">
                  {selectedUserDetails?.plan === 'No Plan' ? (
                    <>
                      <div className="flex items-center justify-between bg-slate-50 rounded-lg opacity-60 min-h-[44px] py-2.5 px-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-slate-300" />
                          <span className="text-sm font-medium text-slate-400">No plan - resumes unavailable</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 rounded-lg opacity-60 min-h-[44px] py-2.5 px-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-slate-300" />
                          <span className="text-sm font-medium text-slate-400">No plan - cover letters unavailable</span>
                        </div>
                      </div>
                    </>
                  ) : isStudentPlan(selectedUserDetails?.plan) ? (
                    <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-slate-600 font-medium">Resumes</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleIncrementResumes(selectedUser.id)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-150 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer" disabled={!selectedUserDetails || selectedUserDetails.resumesRemaining >= (selectedUserDetails.resumeLimit ?? 0)}>+</button>
                        <span className="font-semibold text-slate-900 text-base">
                          {selectedUserDetails?.resumesRemaining ?? 0} <span className="text-slate-400">/ {selectedUserDetails?.resumeLimit ?? 0}</span>
                        </span>
                        <button onClick={() => handleDecrementResumes(selectedUser.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-150 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer" disabled={!selectedUserDetails || selectedUserDetails.resumesRemaining <= 0}>-</button>
                      </div>
                    </div>
                  ) : isProfessionalPlan(selectedUserDetails?.plan) ? (
                    <>
                      <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-sm text-slate-600 font-medium">Cover Letters</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleIncrementLetters(selectedUser.id)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-150 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer" disabled={!selectedUserDetails || selectedUserDetails.lettersRemaining >= (selectedUserDetails.letterLimit ?? 0)}>+</button>
                          <span className="font-semibold text-slate-900 text-base">
                            {selectedUserDetails?.lettersRemaining ?? 0} <span className="text-slate-400">/ {selectedUserDetails?.letterLimit ?? 0}</span>
                          </span>
                          <button onClick={() => handleDecrementLetters(selectedUser.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-150 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer" disabled={!selectedUserDetails || selectedUserDetails.lettersRemaining <= 0}>-</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-sm text-slate-600 font-medium">Resumes</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleIncrementResumes(selectedUser.id)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-150 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer" disabled={!selectedUserDetails || selectedUserDetails.resumesRemaining >= (selectedUserDetails.resumeLimit ?? 0)}>+</button>
                          <span className="font-semibold text-slate-900 text-base">
                            {selectedUserDetails?.resumesRemaining ?? 0} <span className="text-slate-400">/ {selectedUserDetails?.resumeLimit ?? 0}</span>
                          </span>
                          <button onClick={() => handleDecrementResumes(selectedUser.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-150 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer" disabled={!selectedUserDetails || selectedUserDetails.resumesRemaining <= 0}>-</button>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
              {/* Documents */}
              <div className="bg-white rounded-lg shadow p-4 min-h-0 flex flex-col justify-center transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:cursor-default">
                <h3 className="text-base font-semibold text-slate-900 mb-4 mt-1">Documents</h3>
                <div className="border-b border-slate-200 mb-3"></div>
                <div className="space-y-2">
                  {/* Resume Row */}
                  {selectedUserDetails?.documents.find(doc => doc.type === 'resume') ? (
                    selectedUserDetails.documents.filter(doc => doc.type === 'resume').map((doc, index) => (
                      <div key={"resume-"+index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg min-h-[44px] py-2.5">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">Resume.pdf</p>
                            <p className="text-xs text-slate-500">{doc.uploadDate}</p>
                          </div>
                        </div>
                        <a href={doc.url || ''} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-pink-500 text-white rounded text-xs hover:bg-pink-600 text-center w-20 inline-block cursor-pointer">Download</a>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg opacity-60 min-h-[44px] py-2.5">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-slate-300" />
                        <div>
                          <p className="text-sm font-medium text-slate-400">No resume uploaded</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* LinkedIn Row */}
                  {selectedUserDetails?.documents.find(doc => doc.type === 'linkedin') ? (
                    selectedUserDetails.documents.filter(doc => doc.type === 'linkedin').map((doc, index) => (
                      <div key={"linkedin-"+index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg min-h-[44px] py-2.5">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">LinkedIn Profile</p>
                            <p className="text-xs text-slate-500">{doc.addedDate}</p>
                          </div>
                        </div>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-pink-500 text-white rounded text-xs hover:bg-pink-600 text-center w-20 inline-block cursor-pointer">Visit</a>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg opacity-60 min-h-[44px] py-2.5">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-slate-300" />
                        <div>
                          <p className="text-sm font-medium text-slate-400">No LinkedIn profile added</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Applications Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Applications</h3>
                {selectedUserDetails?.plan === 'No Plan' ? (
                  <span className="ml-4 text-sm text-slate-400">User must have an active plan to add applications.</span>
                ) : (
                  <button
                    onClick={() => setShowAddAppModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Application
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 rounded-lg">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {selectedUserDetails?.applications.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-6 text-slate-400">No applications found.</td></tr>
                    ) : selectedUserDetails?.applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{app.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{app.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{app.salary}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-semibold rounded-full ${
                            app.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'interview' ? 'bg-green-100 text-green-800' :
                            app.status === 'offer' ? 'bg-blue-100 text-blue-800' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {(() => {
                              if (app.status === 'submitted') return <Clock className="w-4 h-4 mr-1 text-yellow-600" />;
                              if (app.status === 'interview') return <User className="w-4 h-4 mr-1 text-green-600" />;
                              if (app.status === 'offer') return <ThumbsUp className="w-4 h-4 mr-1 text-blue-600" />;
                              if (app.status === 'rejected') return <ThumbsDown className="w-4 h-4 mr-1 text-red-700" />;
                              return null;
                            })()}
                            {(() => {
                              const displayMap: Record<string, string> = {
                                'submitted': 'Applied',
                                'in_review': 'In Review',
                                'interview': 'Interview',
                                'offer': 'Offer',
                                'rejected': 'Rejected',
                                'not_selected': 'Not Selected',
                              };
                              return displayMap[app.status] || app.status.charAt(0).toUpperCase() + app.status.slice(1);
                            })()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Add Application Modal */}
            {showAddAppModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[400px] max-w-lg relative">
                  <button className="absolute top-2 right-2 text-slate-400 hover:text-pink-500 text-2xl font-bold" onClick={() => setShowAddAppModal(false)} aria-label="Close">×</button>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Application</h3>
                  <form onSubmit={async e => {
                    e.preventDefault();
                    await handleAddApplication();
                  }}>
                    <div className="mb-2">
                      <label className="block text-xs text-slate-500 mb-1">Company</label>
                      <input required className="w-full border border-slate-300 rounded-md px-2 py-1 placeholder-slate-500 text-black" value={addAppForm.company} onChange={e => setAddAppForm(f => ({ ...f, company: e.target.value }))} placeholder="Company" />
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs text-slate-500 mb-1">Role</label>
                      <input required className="w-full border border-slate-300 rounded-md px-2 py-1 placeholder-slate-500 text-black" value={addAppForm.role} onChange={e => setAddAppForm(f => ({ ...f, role: e.target.value }))} placeholder="Role" />
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs text-slate-500 mb-1">Salary</label>
                      <input className="w-full border border-slate-300 rounded-md px-2 py-1 placeholder-slate-500 text-black" value={addAppForm.salary} onChange={e => setAddAppForm(f => ({ ...f, salary: e.target.value }))} placeholder="Salary" />
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs text-slate-500 mb-1">Status</label>
                      <select className="w-full border border-slate-300 rounded-md px-2 py-1 placeholder-slate-500 text-black" value={addAppForm.status} onChange={e => setAddAppForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs text-slate-500 mb-1">Date</label>
                      <input type="date" className="w-full border border-slate-300 rounded-md px-2 py-1 placeholder-slate-500 text-black" value={addAppForm.date} onChange={e => setAddAppForm(f => ({ ...f, date: e.target.value }))} placeholder="Date" />
                    </div>
                    <div className="flex justify-end w-35.5 space-x-2 ml-auto">
                      <button
                        onClick={handleAddApplication}
                        className="w-1/2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 cursor-pointer"
                        type="submit"
                        disabled={addAppLoading}
                      >
                        {addAppLoading ? 'Adding...' : 'Add'}
                      </button>
                      <button
                        onClick={() => setShowAddAppModal(false)}
                        className="w-1/2 px-4 py-2 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 flex justify-center items-center cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6 transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:cursor-pointer">
                <div className="flex items-center">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <User className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900">{statsLoading ? '...' : totalUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:cursor-pointer">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Applications Submitted</p>
                    <p className="text-2xl font-bold text-slate-900">{statsLoading ? '...' : applicationsSubmitted}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:cursor-pointer">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Revenue Generated</p>
                    <p className="text-2xl font-bold text-slate-900">$0.00</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:cursor-pointer">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Edit3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-slate-900">{statsLoading ? '...' : activeSubscriptions}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">All Users</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-slate-500 text-black"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 rounded-lg">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {usersLoading ? (
                      <tr><td colSpan={6} className="text-center py-6 text-slate-400">Loading...</td></tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-6 text-slate-400">No users found.</td></tr>
                    ) : filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{u.full_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{u.plan || 'No Plan'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{u.applications ?? 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <select
                            className="border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            value={u.status || 'not_started'}
                            onChange={e => handleStatusChange(u.id, e.target.value)}
                          >
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;