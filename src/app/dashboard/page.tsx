"use client";

import React, { useState, useEffect } from 'react';

import { 
  Home, 
  FileText, 
  MessageCircle, 
  CreditCard, 
  Settings, 
  Filter,
  Upload,
  MapPin,
  Building2,
  User,
  LogOut,
  ChevronDown,
  Eye,
  Calendar,
  Briefcase
} from 'lucide-react';
import Image from "next/image";
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// Add types for Supabase data
interface Application {
  id: string;
  jobTitle: string;
  company: string;
  dateApplied: string;
  status: string;
  actions?: string;
  salary?: string | null;
}
interface Company {
  company: string;
  count?: number;
}
interface Location {
  city: string;
  count?: number;
}
interface Role {
  role: string;
  count?: number;
}
interface UserPlan {
  id: string;
  user_id: string;
  plan_id: string;
  resumes_remaining: number;
  letters_remaining: number;
  activated_at: string;
  stripe_checkout_id?: string;
  letters_used?: number;
  resumes_used?: number;
}

const Dashboard = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/signup');
    }
  }, [user, loading, router]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterSalary, setFilterSalary] = useState('');
  const [filterDate, setFilterDate] = useState('');
  // Profile/settings state removed

  const [applications, setApplications] = useState<Application[]>([]);
  const [preferredLocations, setPreferredLocations] = useState<Location[]>([]);
  const [preferredCompanies, setPreferredCompanies] = useState<Company[]>([]);
  const [preferredRoles, setPreferredRoles] = useState<Role[]>([]);
  const [stats, setStats] = useState({ totalApplications: 0, submitted: 0, progress: 0 });
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [planStats, setPlanStats] = useState<{ lettersTotal: number; lettersRemaining: number; resumesTotal: number; resumesRemaining: number; percent: number }>({ lettersTotal: 0, lettersRemaining: 0, resumesTotal: 0, resumesRemaining: 0, percent: 0 });
  const [showLinkedInInput, setShowLinkedInInput] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [linkedInLoading, setLinkedInLoading] = useState(false);
  const [linkedInSuccess, setLinkedInSuccess] = useState(false);
  const [linkedInError, setLinkedInError] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeRemoving, setResumeRemoving] = useState(false);

  // Fetch LinkedIn URL for user on mount
  useEffect(() => {
    const fetchLinkedIn = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('docs')
        .select('external_url')
        .eq('user_id', user.id)
        .single();
      if (data && data.external_url) setLinkedInUrl(data.external_url);
    };
    if (user) fetchLinkedIn();
  }, [user, supabase]);

  // Fetch resume file_url for user on mount
  useEffect(() => {
    const fetchResume = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('docs')
        .select('file_url')
        .eq('user_id', user.id)
        .single();
      if (data && data.file_url) setResumeUrl(data.file_url);
    };
    if (user) fetchResume();
  }, [user, supabase]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      // Fetch applications
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('date_applied', { ascending: false });
      if (appsError) {
        console.error('Error fetching applications:', appsError.message);
        setApplications([]);
      } else {
        setApplications((apps as Application[]) || []);
      }
      // Fetch preferences
      const { data: jobs, error: jobsError } = await supabase
        .from('user_jobs')
        .select('*')
        .eq('user_id', user.id);
      const { data: locations, error: locationsError } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id);
      const { data: companies, error: companiesError } = await supabase
        .from('user_companies')
        .select('*')
        .eq('user_id', user.id);
      if (jobsError || locationsError || companiesError) {
        setPreferredLocations([]);
        setPreferredCompanies([]);
        setPreferredRoles([]);
      } else {
        setPreferredLocations((locations as Location[]) || []);
        setPreferredCompanies((companies as Company[]) || []);
        setPreferredRoles((jobs as Role[]) || []);
      }
      // Fetch user plan
      const { data: plans, error: plansError } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('activated_at', { ascending: false });
      if (plansError) {
        setUserPlan(null);
        setPlanStats({ lettersTotal: 0, lettersRemaining: 0, resumesTotal: 0, resumesRemaining: 0, percent: 0 });
      } else {
        // Find the most recent plan with remaining credits
        const activePlan = (plans as UserPlan[] | null)?.find((p) => (p.letters_remaining > 0 || p.resumes_remaining > 0)) || (plans as UserPlan[] | null)?.[0] || null;
        setUserPlan(activePlan);
        if (activePlan) {
          const lettersTotal = activePlan.letters_remaining + (activePlan.letters_used || 0);
          const resumesTotal = activePlan.resumes_remaining + (activePlan.resumes_used || 0);
          const percent = lettersTotal > 0 ? Math.round(((lettersTotal - activePlan.letters_remaining) / lettersTotal) * 100) : 0;
          setPlanStats({
            lettersTotal,
            lettersRemaining: activePlan.letters_remaining,
            resumesTotal,
            resumesRemaining: activePlan.resumes_remaining,
            percent
          });
        } else {
          setPlanStats({ lettersTotal: 0, lettersRemaining: 0, resumesTotal: 0, resumesRemaining: 0, percent: 0 });
        }
      }
      // Stats
      setStats({
        totalApplications: apps?.length || 0,
        submitted: (apps?.filter((a: Application) => a.status === 'Submitted').length) || 0,
        progress: 0 // You can add more logic here
      });
    };
    if (user) fetchData();
  }, [user, supabase]);

  const recentApplications = applications.slice(0, 3);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown-menu');
      const button = document.getElementById('user-dropdown-btn');
      if (dropdown && !dropdown.contains(e.target as Node) && button && !button.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userDropdownOpen]);

  // Placeholder data
  // const stats = {
  //   totalApplications: 100,
  //   submitted: 32,
  //   progress: 32
  // };

  // const applications = [
  //   {
  //     id: 1,
  //     jobTitle: 'Software Engineer',
  //     company: 'ABC Corp',
  //     dateApplied: '04/11/2024',
  //     status: 'Submitted',
  //     actions: 'Edit',
  //     salary: 'USD 120,000'
  //   },
  //   {
  //     id: 2,
  //     jobTitle: 'Product Manager',
  //     company: 'XYZ Inc.',
  //     dateApplied: '06/11/2024',
  //     status: 'In Review',
  //     actions: 'Edit',
  //     salary: 'USD 110,000'
  //   },
  //   {
  //     id: 3,
  //     jobTitle: 'Data Analyst',
  //     company: 'Example Co.',
  //     dateApplied: '04/11/2025',
  //     status: 'Submitted',
  //     actions: 'Edit',
  //     salary: null
  //   }
  // ];

  // const recentApplications = applications.slice(0, 3);

  // const preferredLocations = [
  //   { city: 'San Francisco, CA', count: 8 },
  //   { city: 'New York, NY', count: 10 },
  //   { city: 'Seattle, WA', count: 14 },
  //   { city: 'Austin, TX', count: 5 },
  //   { city: 'Chicago, IL', count: 7 }
  // ];

  // const preferredCompanies = [
  //   { company: 'Google', count: 12 },
  //   { company: 'Microsoft', count: 7 },
  //   { company: 'Apple', count: 15 },
  //   { company: 'Amazon', count: 9 },
  //   { company: 'Meta', count: 8 },
  //   { company: 'Netflix', count: 6 },
  //   { company: 'Tesla', count: 10 },
  //   { company: 'Adobe', count: 5 },
  //   { company: 'Salesforce', count: 4 },
  //   { company: 'IBM', count: 3 }
  // ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }
    if (!user) return;
    setResumeLoading(true);
    setResumeError('');
    setResumeSuccess(false);
    // Upload to Supabase Storage (assume bucket 'resumes')
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, file, { upsert: true });
    if (uploadError) {
      setResumeLoading(false);
      setResumeError('Failed to upload file: ' + uploadError.message);
      return;
    }
    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl || '';
    // Upsert file_url in docs table
    const { error: upsertError } = await supabase
      .from('docs')
      .upsert({ user_id: user.id, file_url: publicUrl }, { onConflict: 'user_id' });
    setResumeLoading(false);
    if (upsertError) {
      setResumeError('Failed to save file URL.');
    } else {
      setResumeSuccess(true);
      setResumeUrl(publicUrl);
      setSelectedFile(file);
    }
  };

  const handleLinkedInConnect = () => {
    setShowLinkedInInput(true);
  };

  const handleLinkedInSave = async () => {
    if (!user) return;
    setLinkedInLoading(true);
    setLinkedInError('');
    setLinkedInSuccess(false);
    const { error } = await supabase
      .from('docs')
      .upsert({ user_id: user.id, external_url: linkedInUrl }, { onConflict: 'user_id' });
    setLinkedInLoading(false);
    if (error) {
      setLinkedInError('Failed to save LinkedIn URL.');
    } else {
      setLinkedInSuccess(true);
      setShowLinkedInInput(false);
    }
  };

  const handleRemoveResume = async () => {
    if (!user || !resumeUrl) return;
    setResumeRemoving(true);
    setResumeError('');
    setResumeSuccess(false);
    // Extract file path from public URL
    const urlParts = resumeUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'resumes');
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    // Remove from storage
    const { error: removeError } = await supabase.storage.from('resumes').remove([filePath]);
    if (removeError) {
      setResumeRemoving(false);
      setResumeError('Failed to remove file from storage.');
      return;
    }
    // Remove file_url from docs table
    const { error: upsertError } = await supabase
      .from('docs')
      .upsert({ user_id: user.id, file_url: null }, { onConflict: 'user_id' });
    setResumeRemoving(false);
    if (upsertError) {
      setResumeError('Failed to update database.');
    } else {
      setResumeUrl('');
      setSelectedFile(null);
      setResumeSuccess(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'in review':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const LinkedInIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
    </svg>
  );

  // White LinkedIn icon for button only, with gradient "in"
  const LinkedInWhiteIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="linkedin-in-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f172a" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="white"/>
      <g>
        <path d="M6.94 17h2.31v-6.2H6.94V17z" fill="url(#linkedin-in-gradient)"/>
        <path d="M8.1 9.5c.74 0 1.2-.49 1.2-1.1-.01-.62-.46-1.1-1.18-1.1-.72 0-1.2.48-1.2 1.1 0 .61.46 1.1 1.17 1.1h.01z" fill="url(#linkedin-in-gradient)"/>
        <path d="M11.13 17h2.31v-3.47c0-.19.01-.39.07-.53.16-.39.52-.8 1.13-.8.8 0 1.12.6 1.12 1.48V17h2.31v-3.73c0-2-1.07-2.93-2.5-2.93-1.15 0-1.66.64-1.94 1.09h.02v-.94h-2.31c.03.62 0 6.2 0 6.2z" fill="url(#linkedin-in-gradient)"/>
      </g>
    </svg>
  );

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
    } else {
      console.log('User signed out successfully');
      router.replace('/signup');
    }
  };

  const filteredApplications = applications.filter(app => {
    const statusMatch = filterStatus ? app.status.toLowerCase().includes(filterStatus.toLowerCase()) : true;
    const companyMatch = filterCompany ? app.company.toLowerCase().includes(filterCompany.toLowerCase()) : true;
    const titleMatch = filterTitle ? app.jobTitle.toLowerCase().includes(filterTitle.toLowerCase()) : true;
    const salaryMatch = filterSalary ? (app.salary && app.salary.replace(/[^0-9]/g, '').includes(filterSalary.replace(/[^0-9]/g, ''))) : true;
    const dateMatch = filterDate
      ? (app.dateApplied && app.dateApplied.replace(/\s+/g, '').toLowerCase().includes(filterDate.replace(/\s+/g, '').toLowerCase()))
      : true;
    return statusMatch && companyMatch && titleMatch && salaryMatch && dateMatch;
  });

  // Custom handler for date input to auto-insert slashes
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Only digits
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
    setFilterDate(value.slice(0, 10));
  };

  // Profile/settings handler removed

  // Profile/settings handler removed

  // Profile/settings handler removed

  // Profile/settings state removed

  // Profile/settings component removed





return (
    <div className="flex h-screen bg-gray-50" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'auto' }}>
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-center">
            <Image src="/logo2.png" alt="JobTracker Logo" width={80} height={80} className="h-20 w-auto mx-auto" priority />
          </div>
        </div>
        
        <nav className="mt-8">
          <div className="px-6 space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-slate-100'
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'applications' 
                  ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-slate-100'
              }`}
            >
              <FileText size={20} />
              <span>Application Tracker</span>
            </button>
            
            
            <button type="button" className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-slate-100 transition-all duration-200 transform hover:scale-105">
              <MessageCircle size={20} />
              <span>Chat Support</span>
            </button>
            
            <a href="/dashboard/billing" className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-slate-100 transition-all duration-200 transform hover:scale-105">
              <CreditCard size={20} />
              <span>Billing</span>
            </a>
          </div>
        </nav>
        
        <div className="absolute bottom-6 left-6 w-52 z-50">
          <div className="relative">
            <button
              id="user-dropdown-btn"
              type="button"
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg hover:scale-105 transition-all duration-200`}
              aria-haspopup="true"
              aria-expanded={userDropdownOpen}
            >
              <div className="flex items-center space-x-3">
                <User size={20} />
                <span className="font-medium">{(() => {
                  const fullName = user?.user_metadata?.full_name;
                  if (fullName) {
                    const words = fullName.trim().split(/\s+/).slice(0, 2);
                    return words.join(' ');
                  }
                  return user?.email || 'User';
                })()}</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {userDropdownOpen && (
              <div id="user-dropdown-menu" className="absolute bottom-full mb-2 left-0 w-full bg-white rounded-lg shadow-lg border animate-in slide-in-from-bottom-2 duration-200 z-50">
                <a
                  href="/dashboard/settings"
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </a>
                <button type="button" className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-b-lg transition-colors border-t cursor-pointer" onClick={handleSignOut}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Header */}
              

              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Stats Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h2 className="font-playfair text-[2.4rem] font-bold text-black mb-2 flex items-center gap-2 max-md:text-[1.6rem] max-sm:text-[1.2rem] whitespace-nowrap italic bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          {(() => {
                            const fullName = user?.user_metadata?.full_name;
                            if (fullName) {
                              const words = fullName.trim().split(/\s+/).slice(0, 2);
                              return `Welcome back, ${words.join(' ')}.`;
                            }
                            return `Welcome back, ${user?.email || 'User'}.`;
                          })()}
                        </h2>
                        <p className="text-gray-600 mb-2">Track your job applications and manage your career journey</p>
                        <div className="text-sm text-black flex items-center gap-2 mt-1">
                          <Calendar size={16} className="text-black" />
                          <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="text-right mt-4 md:mt-0">
                        <div className="text-4xl font-bold text-black mb-1">
                          {userPlan ? (
                            <>
                              <span className="text-[#d1005f]">{planStats.lettersTotal - planStats.lettersRemaining}</span> of {planStats.lettersTotal} Letters Used
                            </>
                          ) : (
                            <span className="text-[#d1005f]">No plan active</span>
                          )}
                        </div>
                        {userPlan ? (
                          <>
                            <div className="text-sm text-black">{planStats.lettersRemaining} Letters Remaining</div>
                            <div className="text-lg font-semibold text-black mt-1">{planStats.percent}% Completed</div>
                          </>
                        ) : (
                          <div
                            className="text-sm text-black cursor-pointer hover:underline"
                            onClick={() => router.push('/dashboard/billing')}
                          >
                            Purchase a plan to get started!
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-pink-100 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-[#e61c71] h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${userPlan && planStats.lettersTotal > 0 ? Math.min(100, Math.round((stats.submitted / planStats.lettersTotal) * 100)) : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Quick Actions - Smaller Size */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    {/* CV Upload - Smaller */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                        <Upload size={18} className="mr-2 text-[#e61c71]" />
                        Upload Resume
                      </h3>
                      <div className="border-2 border-dashed border-[#e61c71] rounded-lg p-4 text-center hover:border-pink-400 transition-colors">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">PDF format</p>
                          {selectedFile && (
                            <p className="text-xs text-green-600">✓ {selectedFile.name}</p>
                          )}
                          {resumeUrl && !selectedFile && (
                            <p className="text-xs text-blue-600">Current: <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">View Resume</a>
                              <button
                                type="button"
                                className="ml-2 text-red-500 underline hover:text-red-700 disabled:opacity-50"
                                onClick={handleRemoveResume}
                                disabled={resumeLoading || resumeRemoving}
                              >
                                {resumeRemoving ? 'Removing...' : 'Remove'}
                              </button>
                            </p>
                          )}
                          {resumeLoading && <p className="text-xs text-gray-500">Uploading...</p>}
                          {resumeError && <p className="text-xs text-red-500">{resumeError}</p>}
                          {resumeSuccess && <p className="text-xs text-green-600">Resume uploaded!</p>}
                        </div>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="resume-upload"
                          disabled={resumeLoading || resumeRemoving}
                        />
                        <label
                          htmlFor="resume-upload"
                          className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-sm rounded-lg hover:from-slate-800 hover:to-slate-600 cursor-pointer transition-all duration-200 transform hover:scale-105"
                        >
                          <Upload size={14} className="mr-1" />
                          Choose File
                        </label>
                      </div>
                    </div>

                    {/* LinkedIn Connection - Smaller */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                        <LinkedInIcon />
                        <span className="ml-2">Connect LinkedIn</span>
                      </h3>
                      <div className="text-center min-h-[100px]">
                        <p className="text-sm text-gray-600 mb-3 mt-16">Import professional info</p>
                        {showLinkedInInput ? (
                          <div className="flex flex-col items-center gap-2">
                            <input
                              type="url"
                              placeholder="Enter LinkedIn profile URL"
                              value={linkedInUrl}
                              onChange={e => setLinkedInUrl(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-800 placeholder-gray-400 w-full max-w-xs"
                              disabled={linkedInLoading}
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={handleLinkedInSave}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-sm rounded-lg hover:from-slate-800 hover:to-slate-600 transition-all duration-200 transform hover:scale-105"
                                disabled={linkedInLoading || !linkedInUrl}
                              >
                                {linkedInLoading ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={() => setShowLinkedInInput(false)}
                                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-all duration-200"
                                disabled={linkedInLoading}
                              >
                                Cancel
                              </button>
                            </div>
                            {linkedInError && <div className="text-red-500 text-xs mt-1">{linkedInError}</div>}
                            {linkedInSuccess && <div className="text-green-600 text-xs mt-1">LinkedIn URL saved!</div>}
                          </div>
                        ) : (
                          <button
                            onClick={handleLinkedInConnect}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-sm rounded-lg hover:from-slate-800 hover:to-slate-600 transition-all duration-200 transform hover:scale-105"
                          >
                            <LinkedInWhiteIcon />
                            <span className="ml-2">{linkedInUrl ? 'Edit LinkedIn URL' : 'Connect'}</span>
                          </button>
                        )}
                        {linkedInUrl && !showLinkedInInput && (
                          <div className="mt-2 text-xs text-gray-600 break-all">Current: <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{linkedInUrl}</a></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Application Tracker Section */}
                  <div className="bg-white rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 h-[325px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Briefcase size={20} className="mr-2 text-[#e61c71]" />
                        Recent Applications
                      </h3>
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="text-[#e61c71] hover:text-pink-700 text-sm font-medium flex items-center transition-colors"
                      >
                        <Eye size={16} className="mr-1" />
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {recentApplications.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                          <Briefcase size={32} className="mx-auto mb-2 text-gray-300" />
                          <div className="font-semibold">No recent applications yet</div>
                          <div className="text-sm">Start applying to jobs and your recent applications will show up here.</div>
                        </div>
                      ) : (
                        recentApplications.map((app, index) => (
                          <div key={app.id} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-in slide-in-from-left-4 duration-500`} style={{animationDelay: `${index * 100}ms`}}>
                            <div>
                              <div className="font-medium text-gray-800">{app.jobTitle}</div>
                              <div className="text-sm text-gray-600">{app.company}</div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">{app.dateApplied}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Side Panels */}
                <div className="space-y-6">
                  {/* Preferred Locations */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl shadow-sm p-4 min-h-0 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                    <div className="flex items-center mb-4 justify-between">
                      <div className="flex items-center">
                        <MapPin size={18} className="text-[#e61c71] mr-2" />
                        <h3 className="text-[1.25rem] font-bold text-white">Preferred Locations</h3>
                      </div>
                      <button
                        className="text-[#e61c71] hover:text-pink-700 text-sm font-bold flex items-center transition-colors mr-2"
                        type="button"
                        onClick={() => router.push('/dashboard/settings#preferences')}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div
                        className={`space-y-3 pr-2`}
                        style={{ maxHeight: '92px', overflowY: 'auto' }}
                      >
                        {preferredLocations.length === 0 ? (
                          <div className="text-center text-gray-300 py-4">
                            <MapPin size={24} className="mx-auto mb-1" />
                            <div className="font-semibold">No preferred locations selected</div>
                            <div className="text-xs">Add locations to personalize your job search.</div>
                          </div>
                        ) : (
                          preferredLocations.map((location, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center group hover:bg-pink-900/30 p-2 rounded transition-colors"
                            >
                              <span className="text-sm text-white group-hover:text-pink-300">{index + 1}. {location.city}</span>
                              <span className="bg-pink-100 text-[#e61c71] px-2 py-1 rounded-full text-xs font-medium group-hover:bg-pink-200 group-hover:text-pink-700">
                                {location.count}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preferred Companies */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl shadow-sm p-4 min-h-0 animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
                    <div className="flex items-center mb-4 justify-between">
                      <div className="flex items-center">
                        <Building2 size={18} className="text-[#e61c71] mr-2" />
                        <h3 className="text-[1.25rem] font-bold text-white">Preferred Companies</h3>
                      </div>
                      <button
                        className="text-[#e61c71] hover:text-pink-700 text-sm font-bold flex items-center transition-colors mr-2"
                        type="button"
                        onClick={() => router.push('/dashboard/settings#preferences')}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-3 pr-2" style={{ maxHeight: '92px', overflowY: 'auto' }}>
                      {preferredCompanies.length === 0 ? (
                        <div className="text-center text-gray-300 py-4">
                          <Building2 size={24} className="mx-auto mb-1" />
                          <div className="font-semibold">No preferred companies selected</div>
                          <div className="text-xs">Add companies to personalize your job search.</div>
                        </div>
                      ) : (
                        preferredCompanies.map((company, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center group hover:bg-pink-900/30 p-2 rounded transition-colors"
                          >
                            <span className="text-sm text-white group-hover:text-pink-300">{index + 1}. {company.company}</span>
                            <span className="bg-pink-100 text-[#e61c71] px-2 py-1 rounded-full text-xs font-medium group-hover:bg-pink-200 group-hover:text-pink-700">
                              {company.count}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Preferred Roles */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl shadow-sm p-4 min-h-0 animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
                    <div className="flex items-center mb-4 justify-between">
                      <div className="flex items-center">
                        <Briefcase size={18} className="text-[#e61c71] mr-2" />
                        <h3 className="text-[1.25rem] font-bold text-white">Preferred Roles</h3>
                      </div>
                      <button
                        className="text-[#e61c71] hover:text-pink-700 text-sm font-bold flex items-center transition-colors mr-2"
                        type="button"
                        onClick={() => router.push('/dashboard/settings#preferences')}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-3 pr-2" style={{ maxHeight: '92px', overflowY: 'auto' }}>
                      {preferredRoles.length === 0 ? (
                        <div className="text-center text-gray-300 py-4">
                          <Briefcase size={24} className="mx-auto mb-1" />
                          <div className="font-semibold">No preferred roles selected</div>
                          <div className="text-xs">Add roles to personalize your job search.</div>
                        </div>
                      ) : (
                        preferredRoles.map((role, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center group hover:bg-pink-900/30 p-2 rounded transition-colors"
                          >
                            <span className="text-sm text-white group-hover:text-pink-300">{index + 1}. {role.role}</span>
                            {role.count !== undefined && (
                              <span className="bg-pink-100 text-[#e61c71] px-2 py-1 rounded-full text-xs font-medium group-hover:bg-pink-200 group-hover:text-pink-700">
                                {role.count}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Support Section - Button Bottom Left, Centered Text (Chat) */}
                  <div className="bg-gradient-to-br from-pink-500 via-[#e61c71] to-pink-400 rounded-2xl p-4 min-h-[230px] text-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative chat icon */}
                    <div className="absolute right-6 bottom-6 opacity-20 text-white pointer-events-none select-none">
                      <MessageCircle size={80} />
                    </div>
                    <div className="flex flex-col items-center z-10">
                      <h3 className="text-2xl font-bold mb-1 flex items-center gap-2 justify-center">
                        <span className="inline-block bg-white/20 rounded-full p-1">
                          <MessageCircle size={24} className="text-white" />
                        </span>
                        Need help?
                      </h3>
                      <p className="text-pink-100 text-base text-center">Chat with our support team.</p>
                      <p className="text-pink-100 text-base text-center">Here for your needs, 24/7.</p>
                    </div>
                    <button className="absolute left-6 bottom-6 bg-gradient-to-r from-white to-pink-400 text-pink-700 px-6 py-2 rounded-xl font-semibold shadow-md hover:from-pink-100 hover:to-pink-500 hover:text-pink-900 transition-all duration-200 transform hover:scale-105 text-lg z-10">
                      Chat Now
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'applications' && (
            <>
              {/* Application Tracker Header */}
              <div className="flex justify-between items-center mb-6 animate-in slide-in-from-top-4 duration-500">
                <h1 className="text-4xl font-bold text-gray-800 flex items-center font-playfair italic">
                  <FileText size={24} className="mr-2 text-[#e61c71]" />
                  Application Tracker
                </h1>
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg hover:from-slate-800 hover:to-slate-600 transition-all duration-200 transform hover:scale-105 font-semibold"
                  onClick={() => setFilterOpen((prev) => !prev)}
                >
                  <Filter size={16} />
                  <span>Filter</span>
                </button>
              </div>
              {filterOpen && (
                <div className="mb-6 bg-white rounded-lg shadow p-4 flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-col">
                    <label className="text-gray-800 text-xs font-semibold mb-1">Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Google, Microsoft"
                      value={filterCompany}
                      onChange={e => setFilterCompany(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-800 text-xs font-semibold mb-1">Role / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. AI Engineer"
                      value={filterTitle}
                      onChange={e => setFilterTitle(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-800 text-xs font-semibold mb-1">Date</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={filterDate}
                      onChange={handleDateInput}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-800 placeholder-gray-400"
                      maxLength={10}
                    />
                  </div>
                                    <div className="flex flex-col">
                    <label className="text-gray-800 text-xs font-semibold mb-1">Status</label>
                    <input
                      type="text"
                      placeholder="e.g. Submitted, Accepted"
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-800 text-xs font-semibold mb-1">Salary</label>
                    <input
                      type="text"
                      placeholder="Salary (in digits)"
                      value={filterSalary}
                      onChange={e => setFilterSalary(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <button
                    className="ml-auto bg-slate-100 text-slate-900 px-4 py-2 rounded font-semibold hover:bg-slate-200 transition self-end"
                    onClick={() => { setFilterCompany(''); setFilterTitle(''); setFilterStatus(''); setFilterSalary(''); setFilterDate(''); }}
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Applications Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Company</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Role / Title</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Date Applied</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredApplications.map((app, index) => (
                        <tr key={app.id} className={`hover:bg-gray-50 transition-colors animate-in slide-in-from-left-4 duration-500`} style={{animationDelay: `${index * 100}ms`}}>
                          <td className="px-6 py-4 text-sm text-gray-700">{app.company}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.jobTitle}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{app.dateApplied}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{app.salary ? app.salary : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Profile/settings page removed */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;