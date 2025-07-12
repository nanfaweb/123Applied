"use client";

import React, { useState, useEffect } from 'react';
import { Search, User, FileText, Plus, Edit3, Eye, CreditCard, Minus } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

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
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
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
}

interface NewApplication {
  company: string;
  role: string;
  salary: string;
  status: string;
  date: string;
}

const AdminPortal = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  const [userData, setUserData] = useState<User[]>([]);
  const [resumeSignedUrls, setResumeSignedUrls] = useState<{ [key: string]: string }>({});

  // Check authentication and admin status
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signup');
    } else if (!loading && user && user.email !== '123applied.info@gmail.com') {
      // If user is not admin, redirect to dashboard
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return; // Don't fetch if not authenticated
      
      try {
        setDataLoading(true);
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        
        if (response.ok) {
          setUserData(data.users);
        } else {
          setError(data.error || 'Failed to fetch users');
        }
      } catch {
        setError('Failed to fetch users');
      } finally {
        setDataLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);
  const [newApplication, setNewApplication] = useState<NewApplication>({
    company: '',
    role: '',
    salary: '',
    status: 'Applied',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredUsers = userData.filter(user => 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    user.email !== '123applied.info@gmail.com' // Additional frontend filter to exclude admin
  );



  const handleDecrementLetters = async (userId: string) => {
    const user = userData.find(u => u.id === userId);
    if (!user) return;

    const newLettersRemaining = Math.max(0, user.lettersRemaining - 1);
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lettersRemaining: newLettersRemaining,
          resumesRemaining: user.resumesRemaining
        })
      });

      if (response.ok) {
        setUserData(prev => prev.map(u => 
          u.id === userId ? { ...u, lettersRemaining: newLettersRemaining } : u
        ));
        if (selectedUser?.id === userId) {
          setSelectedUser(prev => prev ? { ...prev, lettersRemaining: newLettersRemaining } : null);
        }
      }
    } catch (error) {
      console.error('Failed to update letters:', error);
    }
  };

  const handleDecrementResumes = async (userId: string) => {
    const user = userData.find(u => u.id === userId);
    if (!user) return;

    const newResumesRemaining = Math.max(0, user.resumesRemaining - 1);
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lettersRemaining: user.lettersRemaining,
          resumesRemaining: newResumesRemaining
        })
      });

      if (response.ok) {
        setUserData(prev => prev.map(u => 
          u.id === userId ? { ...u, resumesRemaining: newResumesRemaining } : u
        ));
        if (selectedUser?.id === userId) {
          setSelectedUser(prev => prev ? { ...prev, resumesRemaining: newResumesRemaining } : null);
        }
      }
    } catch (error) {
      console.error('Failed to update resumes:', error);
    }
  };

  const handleIncrementLetters = async (userId: string) => {
    const user = userData.find(u => u.id === userId);
    if (!user) return;

    const newLettersRemaining = user.lettersRemaining + 1;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lettersRemaining: newLettersRemaining,
          resumesRemaining: user.resumesRemaining
        })
      });

      if (response.ok) {
        setUserData(prev => prev.map(u => 
          u.id === userId ? { ...u, lettersRemaining: newLettersRemaining } : u
        ));
        if (selectedUser?.id === userId) {
          setSelectedUser(prev => prev ? { ...prev, lettersRemaining: newLettersRemaining } : null);
        }
      }
    } catch (error) {
      console.error('Failed to update letters:', error);
    }
  };

  const handleIncrementResumes = async (userId: string) => {
    const user = userData.find(u => u.id === userId);
    if (!user) return;

    const newResumesRemaining = user.resumesRemaining + 1;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lettersRemaining: user.lettersRemaining,
          resumesRemaining: newResumesRemaining
        })
      });

      if (response.ok) {
        setUserData(prev => prev.map(u => 
          u.id === userId ? { ...u, resumesRemaining: newResumesRemaining } : u
        ));
        if (selectedUser?.id === userId) {
          setSelectedUser(prev => prev ? { ...prev, resumesRemaining: newResumesRemaining } : null);
        }
      }
    } catch (error) {
      console.error('Failed to update resumes:', error);
    }
  };

  const handleAddApplication = async () => {
    if (selectedUser && newApplication.company && newApplication.role) {
      try {
        const response = await fetch(`/api/admin/users/${selectedUser.id}/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: newApplication.company,
            role: newApplication.role,
            salary: newApplication.salary,
            status: newApplication.status,
            date: newApplication.date
          })
        });

        if (response.ok) {
          const { application } = await response.json();
          const updatedUser: User = {
            ...selectedUser,
            applications: [...selectedUser.applications, {
              id: application.id,
              company: application.company,
              role: application.role_title,
              salary: application.salary || 'Not specified',
              status: application.status,
              date: application.date_applied?.split('T')[0] || 'Unknown'
            }],
            totalApplications: selectedUser.totalApplications + 1
          };
          
          setUserData(prev => prev.map(user => 
            user.id === selectedUser.id ? updatedUser : user
          ));
          setSelectedUser(updatedUser);
          setNewApplication({
            company: '',
            role: '',
            salary: '',
            status: 'Applied',
            date: new Date().toISOString().split('T')[0]
          });
          setShowAddApplication(false);
        }
      } catch (error) {
        console.error('Failed to add application:', error);
      }
    }
  };

  const getPlanColor = (plan: string) => {
    switch(plan) {
      case 'Basic': return 'bg-gray-100 text-gray-800';
      case 'Premium': return 'bg-blue-100 text-blue-800';
      case 'Enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Applied': return 'bg-yellow-100 text-yellow-800';
      case 'Interview': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Offer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fetch signed URLs for resume documents when selectedUser changes
  useEffect(() => {
    const fetchSignedUrls = async () => {
      setResumeSignedUrls({});
      if (!selectedUser) return;
      const newUrls: { [key: string]: string } = {};
      for (const doc of selectedUser.documents) {
        if (doc.type === 'resume' && doc.url) {
          if (doc.url.startsWith('http')) {
            newUrls[doc.url] = doc.url;
          } else {
            const path = doc.url.replace(/^\//, '');
            const { data } = await supabase.storage.from('resumes').createSignedUrl(path, 60 * 60); // 1 hour
            if (data?.signedUrl) {
              newUrls[doc.url] = data.signedUrl;
            }
          }
        }
      }
      setResumeSignedUrls(newUrls);
    };
    fetchSignedUrls();
  }, [selectedUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">123Applied</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {setActiveTab('dashboard'); setSelectedUser(null);}}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-pink-500 text-white' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dataLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading users...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400 text-lg">{error}</div>
          </div>
        ) : !selectedUser ? (
          /* Main Dashboard */
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <User className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900">{userData.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Documents Uploaded</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userData.reduce((sum, user) => sum + user.documents.length, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Revenue Generated</p>
                    <p className="text-2xl font-bold text-slate-900">
                      ${userData.reduce((sum, user) => {
                        const planPrices: { [key: string]: number } = { 'Basic': 39.99, 'Premium': 79.99, 'Enterprise': 299.99 };
                        return sum + (planPrices[user.plan] || 0);
                      }, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Edit3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userData.filter(user => user.lettersRemaining > 0 || user.resumesRemaining > 0).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">All Users</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Letters</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resumes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                            <div className="text-sm text-slate-500">{user.email || 'No email'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(user.plan)}`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleIncrementLetters(user.id)}
                              className="p-1 text-green-500 hover:text-green-700"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <span>{user.lettersRemaining}</span>
                            <button
                              onClick={() => handleDecrementLetters(user.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleIncrementResumes(user.id)}
                              className="p-1 text-green-500 hover:text-green-700"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <span>{user.resumesRemaining}</span>
                            <button
                              onClick={() => handleDecrementResumes(user.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.totalApplications}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.lastActive}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                          >
                            <Eye className="h-4 w-4 mr-1" />
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
        ) : (
          /* User Detail View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedUser(null)}
                className="text-white hover:text-pink-200 text-sm font-medium"
              >
                ← Back to Dashboard
              </button>
              <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">User Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-medium text-slate-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Plan</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(selectedUser.plan)}`}>
                      {selectedUser.plan}
                    </span>
                  </div>
                  {selectedUser.linkedInUrl && (
                    <div>
                      <p className="text-sm text-slate-600">LinkedIn</p>
                      <a 
                        href={selectedUser.linkedInUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-pink-500 hover:text-pink-700"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-600">Last Active</p>
                    <p className="font-medium text-slate-900">{selectedUser.lastActive}</p>
                  </div>
                </div>
              </div>

              {/* Credits */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Credits Remaining</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Cover Letters</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleIncrementLetters(selectedUser.id)}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      >
                        +1
                      </button>
                      <span className="font-medium text-slate-900">{selectedUser.lettersRemaining}</span>
                      <button
                        onClick={() => handleDecrementLetters(selectedUser.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        -1
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Resume Reviews</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleIncrementResumes(selectedUser.id)}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      >
                        +1
                      </button>
                      <span className="font-medium text-slate-900">{selectedUser.resumesRemaining}</span>
                      <button
                        onClick={() => handleDecrementResumes(selectedUser.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        -1
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Documents</h3>
                <div className="space-y-3">
                  {selectedUser.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {doc.type === 'resume' ? doc.name : 'LinkedIn Profile'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {doc.type === 'resume' ? doc.uploadDate : doc.addedDate}
                          </p>
                        </div>
                      </div>
                      {doc.type === 'resume' && (
                        resumeSignedUrls[doc.url || ''] ? (
                          <a
                            href={resumeSignedUrls[doc.url || '']}
                            download
                            className="px-3 py-1 bg-pink-500 text-white rounded text-xs hover:bg-pink-600"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">Loading...</span>
                        )
                      )}
                      {doc.type === 'linkedin' && doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-700 text-sm"
                        >
                          View
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                {/* LinkedIn URL below document */}
                {selectedUser.linkedInUrl && (
                  <div className="mt-6">
                    <span className="text-sm text-slate-600 mb-1 block">LinkedIn URL</span>
                    <a
                      href={selectedUser.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-700 break-all"
                    >
                      {selectedUser.linkedInUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Applications</h3>
                  <button
                    onClick={() => setShowAddApplication(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Application
                  </button>
                </div>
              </div>

              {showAddApplication && (
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h4 className="text-md font-medium text-slate-900 mb-3">Add New Application</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input
                      type="text"
                      placeholder="Company"
                      className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      value={newApplication.company}
                      onChange={(e) => setNewApplication({...newApplication, company: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      value={newApplication.role}
                      onChange={(e) => setNewApplication({...newApplication, role: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Salary"
                      className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      value={newApplication.salary}
                      onChange={(e) => setNewApplication({...newApplication, salary: e.target.value})}
                    />
                    <select
                      className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      value={newApplication.status}
                      onChange={(e) => setNewApplication({...newApplication, status: e.target.value})}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddApplication}
                        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddApplication(false)}
                        className="px-4 py-2 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
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
                    {selectedUser.applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{app.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{app.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{app.salary}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.date}</td>
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