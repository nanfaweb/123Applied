"use client";
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Camera, MapPin, Building, Briefcase, User, Mail, Save, LogOut, Trash2, X } from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';
import { useUser } from '../../../context/UserContext';
import { signout } from '../../../../lib/auth-actions';
import { useRouter } from 'next/navigation';


type Profile = {
  fullName: string;
  email: string;
  profilePicture: string | ArrayBuffer | null;
};

type Preferences = {
  companies: string[];
  locations: string[];
  jobRoles: string[];
};

type PreferenceType = keyof Preferences;

// Move PreferenceSection and its interface to the top level
interface PreferenceSectionProps {
  title: string;
  icon: React.ElementType;
  items: string[];
  type: PreferenceType;
  newValue: string;
  setNewValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  maxItems: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
  addPreference: (
    type: PreferenceType,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => Promise<void>;
  removePreference: (type: PreferenceType, index: number) => Promise<void>;
  preferenceLoading: { [key in PreferenceType]?: boolean };
  preferenceError: { [key in PreferenceType]?: string | null };
  preferenceRemoveLoading: { [key in PreferenceType]?: number | null };
  preferenceRemoveError: { [key in PreferenceType]?: string | null };
}

const PreferenceSection: React.FC<PreferenceSectionProps> = ({
  title,
  icon: Icon,
  items,
  type,
  newValue,
  setNewValue,
  placeholder,
  maxItems,
  inputRef,
  addPreference,
  removePreference,
  preferenceLoading,
  preferenceError,
  preferenceRemoveLoading,
  preferenceRemoveError,
}) => {
  const handleAdd = async () => {
    if (newValue.trim() && items.length < maxItems) {
      await addPreference(type, newValue, setNewValue);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">({items.length}/{maxItems})</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {items.map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <span className="text-sm text-gray-700">{item}</span>
            <button
              onClick={() => removePreference(type, index)}
              className={`text-gray-400 hover:text-red-500 transition-colors ${preferenceRemoveLoading[type] === index ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="button"
              disabled={preferenceRemoveLoading[type] === index}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-black placeholder-black"
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await handleAdd();
            }
          }}
          disabled={items.length >= maxItems || preferenceLoading[type]}
        />
        <button
          onClick={handleAdd}
          disabled={!newValue.trim() || items.length >= maxItems || preferenceLoading[type]}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          style={{ backgroundColor: '#e61c71' }}
          type="button"
        >
          {preferenceLoading[type] ? 'Adding...' : 'Add'}
        </button>
      </div>
      {preferenceError[type] && (
        <div className="text-red-500 text-xs mt-2">{preferenceError[type]}</div>
      )}
      {preferenceRemoveError[type] && (
        <div className="text-red-500 text-xs mt-2">{preferenceRemoveError[type]}</div>
      )}
    </div>
  );
};

export default function ProfileSettings() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    fullName: '',
    email: '',
    profilePicture: null,
  });
  const [preferences, setPreferences] = useState<Preferences>({
    companies: [],
    locations: [],
    jobRoles: [],
  });
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [newCompany, setNewCompany] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newJobRole, setNewJobRole] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [preferenceLoading, setPreferenceLoading] = useState<{ [key in PreferenceType]?: boolean }>({});
  const [preferenceError, setPreferenceError] = useState<{ [key in PreferenceType]?: string | null }>({});
  const [preferenceRemoveLoading, setPreferenceRemoveLoading] = useState<{ [key in PreferenceType]?: number | null }>({});
  const [preferenceRemoveError, setPreferenceRemoveError] = useState<{ [key in PreferenceType]?: string | null }>({});

  // Add refs for each preference input
  const companyInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const jobRoleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signup');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchData() {
      setFetching(true);
      setFetchError(null);
      try {
        const res = await fetch('/dashboard/settings/api', { method: 'GET' });
        if (!res.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await res.json();
        setProfile(data.profile);
        setPreferences(data.preferences);
      } catch (err: unknown) {
        setFetchError(
          err instanceof Error ? err.message : typeof err === 'string' ? err : 'Error fetching settings'
        );
      } finally {
        setFetching(false);
      }
    }
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          setProfile((prev) => ({ ...prev, profilePicture: e.target!.result as string | ArrayBuffer | null }));
          setHasChanges(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addPreference = async (
    type: PreferenceType,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (
      value.trim() &&
      preferences[type].length < (type === 'companies' || type === 'jobRoles' ? 10 : 5)
    ) {
      setPreferenceLoading((prev) => ({ ...prev, [type]: true }));
      setPreferenceError((prev) => ({ ...prev, [type]: null }));
      try {
        const res = await fetch('/dashboard/settings/api/preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, value: value.trim() }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to add preference');
        }
        setPreferences((prev) => ({
          ...prev,
          [type]: [...prev[type], value.trim()],
        }));
        setter('');
        setHasChanges(true);
      } catch (err: unknown) {
        setPreferenceError((prev) => ({
          ...prev,
          [type]: err instanceof Error ? err.message : typeof err === 'string' ? err : 'Error adding preference',
        }));
      } finally {
        setPreferenceLoading((prev) => ({ ...prev, [type]: false }));
      }
    }
  };

  const removePreference = async (type: PreferenceType, index: number) => {
    const value = preferences[type][index];
    setPreferenceRemoveLoading((prev) => ({ ...prev, [type]: index }));
    setPreferenceRemoveError((prev) => ({ ...prev, [type]: null }));
    try {
      const res = await fetch('/dashboard/settings/api/preference', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to remove preference');
      }
      setPreferences((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
      setHasChanges(true);
    } catch (err: unknown) {
      setPreferenceRemoveError((prev) => ({
        ...prev,
        [type]: err instanceof Error ? err.message : typeof err === 'string' ? err : 'Error removing preference',
      }));
    } finally {
      setPreferenceRemoveLoading((prev) => ({ ...prev, [type]: null }));
    }
  };

  const handleSave = async () => {
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const res = await fetch('/dashboard/settings/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, preferences }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save settings');
      }
      setHasChanges(false);
      setSaveSuccess(true);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : typeof err === 'string' ? err : 'Error saving settings'
      );
    }
  };

  const handleSignOut = async () => {
    await signout();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Deleting account...');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4">
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </Link>
        </div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Error/Loading/Success States */}
        {fetching && (
          <div className="mb-4 text-center text-gray-500">Loading settings...</div>
        )}
        {fetchError && (
          <div className="mb-4 text-center text-red-500">{fetchError}</div>
        )}
        {saveSuccess && (
          <div className="mb-4 text-center text-green-600">Settings saved successfully!</div>
        )}
        {saveError && (
          <div className="mb-4 text-center text-red-500">{saveError}</div>
        )}

        <div className="space-y-8">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>

            <div className="flex items-start gap-6">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profile.profilePicture ? (
                    <Image
                      src={typeof profile.profilePicture === 'string' ? profile.profilePicture : ''}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#e61c71' }}
                  type="button"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName ?? ""}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-black placeholder-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email ?? ""}
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-black cursor-not-allowed"
                    />
                    <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>

            {hasChanges && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 font-medium"
                  style={{ backgroundColor: '#e61c71' }}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Job Preferences */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900" id="preferences">Job Application Preferences</h2>
            
            <PreferenceSection
              title="Preferred Companies"
              icon={Building}
              items={preferences.companies}
              type="companies"
              newValue={newCompany}
              setNewValue={setNewCompany}
              placeholder="Enter company name..."
              maxItems={5}
              inputRef={companyInputRef}
              addPreference={addPreference}
              removePreference={removePreference}
              preferenceLoading={preferenceLoading}
              preferenceError={preferenceError}
              preferenceRemoveLoading={preferenceRemoveLoading}
              preferenceRemoveError={preferenceRemoveError}
            />

            <PreferenceSection
              title="Preferred Locations"
              icon={MapPin}
              items={preferences.locations}
              type="locations"
              newValue={newLocation}
              setNewValue={setNewLocation}
              placeholder="Enter location..."
              maxItems={5}
              inputRef={locationInputRef}
              addPreference={addPreference}
              removePreference={removePreference}
              preferenceLoading={preferenceLoading}
              preferenceError={preferenceError}
              preferenceRemoveLoading={preferenceRemoveLoading}
              preferenceRemoveError={preferenceRemoveError}
            />

            <PreferenceSection
              title="Job Roles"
              icon={Briefcase}
              items={preferences.jobRoles}
              type="jobRoles"
              newValue={newJobRole}
              setNewValue={setNewJobRole}
              placeholder="Enter job role..."
              maxItems={10}
              inputRef={jobRoleInputRef}
              addPreference={addPreference}
              removePreference={removePreference}
              preferenceLoading={preferenceLoading}
              preferenceError={preferenceError}
              preferenceRemoveLoading={preferenceRemoveLoading}
              preferenceRemoveError={preferenceRemoveError}
            />
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
            
            <div className="space-y-4">
              {/* Billing & Subscription */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">Billing & Subscription</h3>
                  <p className="text-sm text-gray-600">Manage your subscription and billing information</p>
                </div>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => window.location.href = '/dashboard/billing'}
                  type="button"
                >
                  Manage
                </button>
              </div>

              <hr className="my-6" />

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>

              {/* Delete Account */}
              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>

          {/* Footer Save Button */}
          {hasChanges && (
            <div className="sticky bottom-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">You have unsaved changes</p>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 font-medium"
                  style={{ backgroundColor: '#e61c71' }}
                >
                  <Save className="w-4 h-4" />
                  Save All Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
