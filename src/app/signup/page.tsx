'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

const inter = Inter({ subsets: ['latin'] });

export default function SignUp() {
  const [isRegister, setIsRegister] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1 for initial form, 2 for password step
  const [isTransitioning, setIsTransitioning] = useState(false);
  // New state for Register/Login fade
  const [isAuthTransitioning, setIsAuthTransitioning] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Student' | 'Professional'>('Student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleAttempted, setGoogleAttempted] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(2);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(1);
      setIsTransitioning(false);
    }, 300);
  };

  // Fade animation for Register/Login toggle
  const handleAuthToggle = (register: boolean) => {
    if (isRegister === register) return;
    setIsAuthTransitioning(true);
    setError(null); // Clear error when toggling
    setGoogleAttempted(false);
    setTimeout(() => {
      setIsRegister(register);
      setCurrentStep(1); // Reset to step 1 on toggle
      setIsAuthTransitioning(false);
    }, 300);
  };

  // Clear error on mount
  useEffect(() => {
    setError(null);
  }, []);

  // Clear googleAttempted on mount
  useEffect(() => { setGoogleAttempted(false); }, []);

  // Manual signup handler
  const handleManualSignup = async () => {
    setError(null);
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/dashboard');
  };

  // Manual login handler
  const handleManualLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message === 'Invalid login credentials') {
        setError('Your email or password is incorrect. Please try again.');
        return;
      }
      if (error.message === 'User not found' || error.message === 'Account does not exist') {
        setError("We couldn't find an account with that email. Please check your details or sign up.");
        return;
      }
      setError('Unable to sign in. Please check your details and try again.');
      return;
    }
    router.push('/dashboard');
  };

  // Google signup handler
  const handleGoogleSignup = async () => {
    setLoading(true);
    setGoogleAttempted(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } });
    setLoading(false);
    if (error) {
      setError(error.message);
    }
  };

  // Google OAuth handler (after redirect)
  useEffect(() => {
    let isMounted = true;
    const checkGoogleUser = async () => {
      // If access_token is present in hash, clean it up
      const hash = window.location.hash;
      if (hash.includes('access_token')) {
        window.location.hash = '';
      }
      let user = null;
      let tries = 0;
      // Wait for Supabase user to be available (sometimes takes a moment after OAuth)
      while (isMounted && !user && tries < 10) {
        // Supabase user fetching logic removed. File retained for reference.
        user = null; // Placeholder, replace with actual user fetching logic
        if (!user) {
          await new Promise(res => setTimeout(res, 300));
          tries++;
        }
      }
      if (user) {
        try {
          // Supabase user profile syncing logic removed. File retained for reference.
          router.push('/dashboard');
        } catch (err) {
          setError((err as Error).message || 'Error syncing Google user.');
        }
      } else if (googleAttempted) {
        setError('Google sign-in failed: user not found.');
      }
    };
    checkGoogleUser();
    return () => { isMounted = false; };
  }, [router, googleAttempted]);

  return (
    <div className={`min-h-screen flex ${inter.className}`}>
      {/* Left side - Decorative Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-400 via-white to-pink-400 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-blue-500/30 blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-pink-500/30 blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-blue-400/20 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-purple-400/25 blur-xl animate-pulse"></div>
        </div>
        <div className="relative w-full flex items-center justify-center">
          <div className="text-center text-black/90 z-10 px-8">
            <h1 className="text-7xl font-extrabold mb-8 drop-shadow-2xl shadow-black">Your Job Search, Automated.</h1>
            <p className="text-3xl opacity-90 drop-shadow-2xl shadow-black font-semibold">Upload once. Apply everywhere.</p>
            <p className="text-3xl opacity-90 drop-shadow-2xl shadow-black font-semibold">Let us handle the rest.</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center bg-white min-h-screen relative">
        {/* Header Section - Fixed */}
        <div className="w-full max-w-sm fixed top-6 bg-white z-10">
          <div className="text-center">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={180}
                height={48}
                className="mx-auto"
              />
            </Link>

            {/* Slider Option */}
            <div className="mb-8 relative" style={{ marginBottom: '30px' }}>
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-2.5 shadow-lg inline-flex relative w-[240px]">
                <div 
                  className={`absolute inset-y-2.5 rounded-full transition-all duration-500 ease-in-out ${
                    isRegister 
                    ? 'bg-gradient-to-r from-pink-500 to-[#e61c71] left-2.5 right-[50%]' 
                    : 'bg-gradient-to-r from-[#e61c71] to-pink-500 left-[50%] right-2.5'
                  }`}
                />
                <button
                  onClick={() => handleAuthToggle(true)}
                  className={`relative z-10 w-28 flex items-center justify-center py-2 text-sm font-semibold transition-colors duration-300 ${
                    isRegister ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  Register
                </button>
                <button
                  onClick={() => handleAuthToggle(false)}
                  className={`relative z-10 w-28 flex items-center justify-center py-2 text-sm font-semibold transition-colors duration-300 ${
                    !isRegister ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  Log In
                </button>
              </div>
            </div>

            {/* Dynamic Sign Up Flow */}
            <div className="w-full flex flex-col items-center">
              {/* Error message display */}
              {error && (
                <div className="w-full max-w-xs mb-4 px-4 py-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm text-center">
                  {error}
                </div>
              )}
              <div className={`w-full transition-opacity duration-300 ${isAuthTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}> 
                {isRegister && (
                  <div className="w-full">
                    {/* Step 1: Initial Form */}
                    {currentStep === 1 && (
                      <form className={`w-full flex flex-col gap-4 items-center transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                        style={{ marginBottom: 0 }}>
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="w-full max-w-xs px-5 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#e61c71] focus:border-transparent text-base text-gray-900"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full max-w-xs px-5 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#e61c71] focus:border-transparent text-base text-gray-900"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="w-full max-w-xs flex flex-col gap-2">
                          <label className="text-base font-medium text-gray-700 flex items-center gap-1">
                            I am a
                            <span className="relative group cursor-pointer">
                              <svg className="w-4 h-4 text-[#e61c71]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="16" x2="12" y2="12"/>
                                <line x1="12" y1="8" x2="12.01" y2="8"/>
                              </svg>
                              <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-900 text-white text-xs rounded shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                This information is only for data collection purposes and does not affect the purchasing options available.
                              </span>
                            </span>
                          </label>
                          <div className="flex flex-row gap-6 mt-1">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="userType"
                                value="Student"
                                className="accent-[#e61c71] h-5 w-5"
                                checked={role==='Student'}
                                onChange={() => setRole('Student')}
                              />
                              <span className="ml-2 text-base text-[#e61c71] font-semibold select-none">Student</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="userType"
                                value="Professional"
                                className="accent-[#e61c71] h-5 w-5"
                                checked={role==='Professional'}
                                onChange={() => setRole('Professional')}
                              />
                              <span className="ml-2 text-base text-[#e61c71] font-semibold select-none">Professional</span>
                            </label>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="w-full max-w-xs py-3 rounded-lg bg-[#e61c71] text-white font-semibold text-base mt-2 border-2 border-[#e61c71]/60 shadow-sm transition-all duration-400 flex items-center justify-center text-center relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:shadow-[#e61c71]/30"
                        >
                          Next
                          <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        </button>

                        {/* Divider */}
                        <div className="relative py-1 w-full max-w-xs mx-auto">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-gray-500">Or continue with</span>
                          </div>
                        </div>

                        {/* Google Button (restored, non-functional) */}
                        <button
                          type="button"
                          className="w-full max-w-xs mx-auto flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-700 font-normal text-sm h-10 transition-all duration-300 ease-in-out hover:bg-[#f8e7f0] hover:border-[#e61c71] hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-[#e61c71] focus:outline-none"
                          onClick={handleGoogleSignup}
                        >
                          <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                          <span className="text-sm">Sign up with Google</span>
                        </button>
                      </form>
                    )}

                    {/* Step 2: Password Form */}
                    {currentStep === 2 && (
                      <div className={`w-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                        <form className="w-full flex flex-col gap-4 items-center">
                          <input
                            type="password"
                            placeholder="Password"
                            className="w-full max-w-xs px-5 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#e61c71] focus:border-transparent text-base text-gray-900"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full max-w-xs px-5 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#e61c71] focus:border-transparent text-base text-gray-900"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </form>
                        
                        {/* Back and Sign Up buttons */}
                        <div className="w-full max-w-xs flex items-center justify-between mt-6 gap-x-4 mx-auto">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 flex items-center justify-center py-3 px-0 rounded-md border border-[#e61c71] text-[#e61c71] font-semibold text-base bg-white hover:bg-[#fce4ef] transition-all duration-200 focus:ring-2 focus:ring-[#e61c71]"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M19 12H5"/>
                              <path d="M12 19l-7-7 7-7"/>
                            </svg>
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handleManualSignup}
                            disabled={loading}
                            className="flex-1 py-3 px-0 rounded-lg bg-[#e61c71] text-white font-semibold text-base border-2 border-[#e61c71]/60 shadow-sm transition-all duration-400 flex items-center justify-center relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:shadow-[#e61c71]/30"
                          >
                            Sign Up
                            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                          </button>
                        </div>

                        {/* Divider */}
                        <div className="relative py-4 w-full max-w-xs mx-auto">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-gray-500">Or continue with</span>
                          </div>
                        </div>

                        {/* Google Button (restored, non-functional) */}
                        <button
                          type="button"
                          className="w-full max-w-xs mx-auto flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-700 font-normal text-sm h-10 transition-all duration-300 ease-in-out hover:bg-[#f8e7f0] hover:border-[#e61c71] hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-[#e61c71] focus:outline-none"
                          onClick={handleGoogleSignup}
                        >
                          <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                          <span className="text-sm">Sign up with Google</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {/* Log In Section */}
                {!isRegister && (
                  <form className="w-full flex flex-col gap-4 items-center transition-opacity duration-300">
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full max-w-xs px-5 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#e61c71] focus:border-transparent text-base text-gray-900"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full max-w-xs px-5 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#e61c71] focus:border-transparent text-base text-gray-900"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleManualLogin}
                      disabled={loading}
                      className="w-full max-w-xs py-3 rounded-lg bg-[#e61c71] text-white font-semibold text-base mt-2 border-2 border-[#e61c71]/60 shadow-sm transition-all duration-400 flex items-center justify-center text-center relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:shadow-[#e61c71]/30"
                    >
                      Sign In
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    </button>
                    {/* Divider */}
                    <div className="relative py-1 w-full max-w-xs mx-auto">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    {/* Google Button (restored, non-functional) */}
                    <button
                      type="button"
                      className="w-full max-w-xs mx-auto flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-700 font-normal text-sm h-10 transition-all duration-300 ease-in-out hover:bg-[#f8e7f0] hover:border-[#e61c71] hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-[#e61c71] focus:outline-none"
                      onClick={handleGoogleSignup}
                    >
                      <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span className="text-sm">Sign in with Google</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}