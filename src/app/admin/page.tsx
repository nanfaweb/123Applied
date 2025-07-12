"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, User, FileText, Plus, Edit3, Eye, CreditCard } from 'lucide-react';

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
  work_status: 'not_started' | 'in_progress' | 'completed'; // Added
}

interface NewApplication {
  company: string;
  role: string;
  salary: string;
  status: string;
  date: string;
}

// Placeholder data for users
const placeholderUsers: User[] = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    plan: 'Premium',
    lettersRemaining: 5,
    resumesRemaining: 2,
    totalApplications: 3,
    lastActive: '2024-06-01',
    linkedInUrl: 'https://linkedin.com/in/janedoe',
    documents: [
      { type: 'resume', name: 'Resume.pdf', uploadDate: '2024-05-20', url: '/resume.pdf', addedDate: undefined },
      { type: 'linkedin', name: undefined, uploadDate: undefined, url: 'https://linkedin.com/in/janedoe', addedDate: '2024-05-21' }
    ],
    applications: [
      { id: 1, company: 'Acme Corp', role: 'Software Engineer', salary: '$120,000', status: 'Applied', date: '2024-05-22' },
      { id: 2, company: 'Beta Inc', role: 'Frontend Developer', salary: '$110,000', status: 'Interview', date: '2024-05-25' },
      { id: 3, company: 'Gamma LLC', role: 'Full Stack Dev', salary: '$130,000', status: 'Offer', date: '2024-05-28' }
    ],
    work_status: 'not_started', // Added
  },
  // Add more placeholder users as needed
];

const AdminPortal = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<User[]>(placeholderUsers);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  const [newApplication, setNewApplication] = useState<NewApplication>({
    company: '',
    role: '',
    salary: '',
    status: 'Applied',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredUsers = userData.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Replace backend handlers with frontend state updates
  const handleDecrementLetters = (userId: string) => {
    setUserData(prev => prev.map(u =>
      u.id === userId ? { ...u, lettersRemaining: Math.max(0, u.lettersRemaining - 1) } : u
    ));
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, lettersRemaining: Math.max(0, prev.lettersRemaining - 1) } : null);
    }
  };

  const handleDecrementResumes = (userId: string) => {
    setUserData(prev => prev.map(u =>
      u.id === userId ? { ...u, resumesRemaining: Math.max(0, u.resumesRemaining - 1) } : u
    ));
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, resumesRemaining: Math.max(0, prev.resumesRemaining - 1) } : null);
    }
  };

  const handleIncrementLetters = (userId: string) => {
    setUserData(prev => prev.map(u =>
      u.id === userId ? { ...u, lettersRemaining: u.lettersRemaining + 1 } : u
    ));
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, lettersRemaining: prev.lettersRemaining + 1 } : null);
    }
  };

  const handleIncrementResumes = (userId: string) => {
    setUserData(prev => prev.map(u =>
      u.id === userId ? { ...u, resumesRemaining: u.resumesRemaining + 1 } : u
    ));
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, resumesRemaining: prev.resumesRemaining + 1 } : null);
    }
  };

  const handleAddApplication = () => {
    if (selectedUser && newApplication.company && newApplication.role) {
      const newApp = {
        id: selectedUser.applications.length + 1,
        company: newApplication.company,
        role: newApplication.role,
        salary: newApplication.salary,
        status: newApplication.status as Application['status'],
        date: newApplication.date
      };
      const updatedUser: User = {
        ...selectedUser,
        applications: [...selectedUser.applications, newApp],
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

  const workStatusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const handleWorkStatusChange = (userId: string, newStatus: 'not_started' | 'in_progress' | 'completed') => {
    setUserData(prev => prev.map(u =>
      u.id === userId ? { ...u, work_status: newStatus } : u
    ));
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, work_status: newStatus } : null);
    }
  };

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
              <div className="relative" ref={profileMenuRef}>
                <button
                  className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center focus:outline-none"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                >
                  <User className="h-4 w-4 text-slate-600" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-full -mr-2 mt-2 w-40 bg-white border border-slate-200 rounded shadow-lg z-50">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-pink-100 hover:text-pink-700"
                      onClick={() => { setProfileMenuOpen(false); /* Add sign out logic here if needed */ }}
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
        {/* Only show user detail view if a user is selected */}
        {selectedUser ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="focus:outline-none"
                  aria-label="Back"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">User Information</h3>
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Full Name</p>
                    <p className="font-medium text-slate-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Email</p>
                    <p className="font-medium text-slate-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Plan</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(selectedUser.plan)}`}>
                      {selectedUser.plan}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Last Active</p>
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
                        +
                      </button>
                      <span className="font-medium text-slate-900">{selectedUser.lettersRemaining} / 10</span>
                      <button
                        onClick={() => handleDecrementLetters(selectedUser.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        -
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Resumes</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleIncrementResumes(selectedUser.id)}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      >
                        +
                      </button>
                      <span className="font-medium text-slate-900">{selectedUser.resumesRemaining} / 5</span>
                      <button
                        onClick={() => handleDecrementResumes(selectedUser.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        -
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
                        <a
                          href={doc.url || ''}
                          download
                          className="px-3 py-1 bg-pink-500 text-white rounded text-xs hover:bg-pink-600 text-center w-24 inline-block"
                        >
                          Download
                        </a>
                      )}
                      {doc.type === 'linkedin' && doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-pink-500 text-white rounded text-xs hover:bg-pink-600 text-center w-24 inline-block"
                        >
                          Visit
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Applications</h3>
                <button
                  onClick={() => setShowAddApplication(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Application
                </button>
              </div>

              {showAddApplication && (
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input
                      type="text"
                      placeholder="Company"
                      className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-slate-500 text-black"
                      value={newApplication.company}
                      onChange={(e) => setNewApplication({...newApplication, company: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-slate-500 text-black"
                      value={newApplication.role}
                      onChange={(e) => setNewApplication({...newApplication, role: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Salary"
                      className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-slate-500 text-black"
                      value={newApplication.salary}
                      onChange={(e) => setNewApplication({...newApplication, salary: e.target.value})}
                    />
                    <select
                      className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-slate-500 text-black"
                      value={newApplication.status}
                      onChange={(e) => setNewApplication({...newApplication, status: e.target.value})}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <div className="flex justify-end w-35.5 space-x-2 ml-auto">
                      <button
                        onClick={handleAddApplication}
                        className="w-1/2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddApplication(false)}
                        className="w-1/2 px-4 py-2 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 flex justify-center items-center"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
        ) : (
          <>
            {/* Main Dashboard */}
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
                      <p className="text-sm font-medium text-slate-600">Applications Submitted</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {userData.reduce((sum, user) => sum + user.applications.length, 0)}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Letters</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resumes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applications</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Work Status</th>
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
                            <span>{user.lettersRemaining}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            <span>{user.resumesRemaining}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.totalApplications}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            <select
                              className="border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                              value={user.work_status}
                              onChange={e => handleWorkStatusChange(user.id, e.target.value as 'not_started' | 'in_progress' | 'completed')}
                            >
                              {workStatusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </td>
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;