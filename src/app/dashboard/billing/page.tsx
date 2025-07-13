"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Pricing from "../../../components/Pricing";
import { useUser } from '../../../context/UserContext';
import { useRouter } from 'next/navigation';

// Types for fetched data
interface Plan {
  id: string;
  name: string;
  price: number;
  letter_limit: number;
  resume_limit: number;
}
interface UserPlan {
  name: string;
  lettersRemaining: number;
  totalLetters: number;
  resumesRemaining: number;
  totalResumes: number;
  cardBrand?: string; // added
  cardLast4?: string; // added
}
interface BillingHistoryRow {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  plans?: { name: string };
}

function useUserPlan() {
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/billing/plan').then(res => res.json()).then(data => {
      setPlan(data.plan);
      setLoading(false);
    });
  }, []);
  return { plan, loading };
}
function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/billing/plans').then(res => res.json()).then(data => {
      setPlans(data.plans);
      setLoading(false);
    });
  }, []);
  return { plans, loading };
}
function useBillingHistory() {
  const [history, setHistory] = useState<BillingHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/billing/history').then(res => res.json()).then(data => {
      setHistory(data.history);
      setLoading(false);
    });
  }, []);
  return { history, loading };
}

export default function BillingPage() {
  // FAQ state and faqs must be at the top before any early returns
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  // Grouped FAQ sections
  const faqSections = [
    {
      title: 'Account Access',
      faqs: [
        { q: 'Is this a subscription? Will I be charged monthly?', a: 'No. All our plans are one-time purchases. You’ll only pay once unless you choose to upgrade or buy an add-on later.' },
        { q: 'What do I get with each plan?', a: 'Each plan gives you a fixed number of professionally created resumes and/or cover letters. The Professional plans include both resumes and cover letters, while Student plans include resumes only.' },
        { q: 'Can I upgrade to a higher plan later?', a: 'Yes. You can upgrade at any time and the new plan will be added to your account immediately.' },
        { q: 'Do you offer refunds?', a: 'Due to the digital and personalized nature of the service, we do not offer refunds after a plan has been activated.' },
        { q: 'Do you offer bulk or team plans?', a: 'Not yet, but if you\'re representing an organization or need more than 200 applications, contact us.' },
      ],
    },
    {
      title: 'Top-up',
      faqs: [
        { q: 'What happens when I run out of letters or resumes?', a: 'You can purchase a top-up add-on anytime to get more resumes or letters added to your account.' },
        { q: 'Can I buy an add-on without a base plan?', a: 'No. Add-ons are available only after you purchase a base Student or Professional plan.' },
        { q: 'Do my unused applications expire?', a: 'No. Your purchased resumes and letters never expire. You can use them whenever you need.' },
      ],
    },
    {
      title: 'Security',
      faqs: [
        { q: 'Is payment secure?', a: 'Yes. All payments are processed securely through Stripe, a trusted global payment platform.' },
        { q: 'Will I receive an invoice or receipt?', a: 'Yes. A payment receipt will be emailed to you automatically after checkout.' },
      ],
    },
  ];
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { plan } = useUserPlan();
  const { plans } = usePlans();
  const { history } = useBillingHistory();

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/signup');
    }
  }, [user, userLoading, router]);

  // Removed global loading screen. Always render the main UI.

  // Mock currentPlan for card info (replace with real data as needed)
  const currentPlan = {
    cardBrand: plan?.cardBrand || 'VISA',
    cardLast4: plan?.cardLast4 || '1234',
  };

  // --- Three-state billing logic ---
  // Check if user has any billing history (from billing_history table)
  if (history.length === 0) {
    // State 1: User never bought a plan
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(203_213_225,0.15)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-12">
            <Link href="/dashboard" className="group flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium">
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Billing & Plans</h1>
          </div>
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 px-4 py-2 lg:px-6 lg:py-3">
              <Pricing showPayButton={true} />
            </div>
          </div>
          {/* FAQ Section for new users */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-10">
              {faqSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{section.title}</h3>
                  <div className="space-y-4">
                    {section.faqs.map((faq, i) => (
                      <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          className="w-full text-left px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors flex justify-between items-center"
                          onClick={() => setOpenFaq(`${section.title}-${i}` === openFaq ? null : `${section.title}-${i}`)}
                        >
                          <span className="font-semibold text-slate-900">{faq.q}</span>
                          <svg
                            className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === `${section.title}-${i}` ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openFaq === `${section.title}-${i}` && (
                          <div className="px-6 py-4 bg-white border-t border-slate-200">
                            <p className="text-slate-600">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!plan) {
    // State 2: User bought a plan before, but no active plan now
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(203_213_225,0.15)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-12">
            <Link href="/dashboard" className="group flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium">
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Billing & Plans</h1>
          </div>
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 px-4 py-2 lg:px-6 lg:py-3">
              <Pricing showPayButton={true} />
            </div>
          </div>
          {/* Billing History */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Billing History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {history.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{new Date(row.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{row.plans?.name || ''}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">${row.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Payment Method */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Payment Method</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-[#e61c71] rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold tracking-widest">{currentPlan.cardBrand}</span>
                  </div>
                  <span className="text-slate-600 font-mono">•••• •••• •••• {currentPlan.cardLast4}</span>
                </div>
              </div>
              <button className="px-6 py-2 bg-[#e61c71] text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 hover:scale-105 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-all duration-200">
                Update Card
              </button>
            </div>
          </div>
          {/* FAQ Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-10">
              {faqSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{section.title}</h3>
                  <div className="space-y-4">
                    {section.faqs.map((faq, i) => (
                      <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          className="w-full text-left px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors flex justify-between items-center"
                          onClick={() => setOpenFaq(`${section.title}-${i}` === openFaq ? null : `${section.title}-${i}`)}
                        >
                          <span className="font-semibold text-slate-900">{faq.q}</span>
                          <svg
                            className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === `${section.title}-${i}` ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openFaq === `${section.title}-${i}` && (
                          <div className="px-6 py-4 bg-white border-t border-slate-200">
                            <p className="text-slate-600">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // User has a plan: show current plan, upgrade options, billing history
  // Always show Student Basic (or next available student plan) and Professional Basic (or next available professional plan), skipping the current plan
  const studentPlans = plans
    .filter(p => p.name.toLowerCase().includes('student') && p.name !== plan.name)
    .sort((a, b) => a.price - b.price);
  const professionalPlans = plans
    .filter(p => p.name.toLowerCase().includes('professional') && p.name !== plan.name)
    .sort((a, b) => a.price - b.price);
  const studentUpgrade = studentPlans[0] || null;
  const professionalUpgrade = professionalPlans[0] || null;
  const upgradePlans = [studentUpgrade, professionalUpgrade].filter(Boolean);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(203_213_225,0.15)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          <Link href="/dashboard" className="group flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium">
            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Billing & Plans</h1>
        </div>
        {/* Current Plan Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Current Plan</h2>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">{plan.name || ''}</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30">Active</span>
                </div>
              </div>
              {/* Removed top-right stats display */}
            </div>
          </div>
          <div className="p-6">
            {/* Show both resumes and letters for professional plans, only resumes for student plans */}
            {plan.name && plan.name.toLowerCase().includes('professional') ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{plan.lettersRemaining ?? 0}</div>
                  <div className="text-sm text-slate-600">Letters Remaining</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{plan.totalLetters ?? 0}</div>
                  <div className="text-sm text-slate-600">Total Letters</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{plan.resumesRemaining ?? 0}</div>
                  <div className="text-sm text-slate-600">Resumes Remaining</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{plan.totalResumes ?? 0}</div>
                  <div className="text-sm text-slate-600">Total Resumes</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{plan.resumesRemaining ?? 0}</div>
                  <div className="text-sm text-slate-600">Resumes Remaining</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{plan.totalResumes ?? 0}</div>
                  <div className="text-sm text-slate-600">Total Resumes</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Options */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Upgrade Your Plan</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upgradePlans.map(up => up && (
              <div
                key={up.id}
                className={`group relative overflow-hidden rounded-xl p-8 text-white hover:shadow-2xl transition-all duration-300
                  ${up.name.toLowerCase().includes('professional')
                    ? 'bg-gradient-to-r from-pink-500 to-[#e61c71]'
                    : 'bg-gradient-to-br from-slate-900 to-slate-800'}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{up.name}</h3>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Upgrade</span>
                  </div>
                  <div className="mb-6">
                    {/* Show both resumes and letters for professional plans, only resumes for student plans */}
                    {up.name.toLowerCase().includes('professional') ? (
                      <>
                        <div className="text-3xl font-bold mb-2">{up.resume_limit} Resumes + {up.letter_limit} Cover Letters</div>
                        <div className="text-white/80 text-sm">Add to your plan</div>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold mb-2">{up.resume_limit} Custom Resumes</div>
                        <div className="text-white/80 text-sm">Add to your plan</div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${up.price.toFixed(2)}</span>
                    <button className="px-6 py-2 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors">Upgrade Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Billing History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {history.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{new Date(row.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{row.plans?.name || ''}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">${row.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Payment Method</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-[#e61c71] rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold tracking-widest">{currentPlan.cardBrand}</span>
                </div>
                <span className="text-slate-600 font-mono">•••• •••• •••• {currentPlan.cardLast4}</span>
              </div>
            </div>
            <button className="px-6 py-2 bg-[#e61c71] text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 hover:scale-105 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-all duration-200">
              Update Card
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-10">
            {faqSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{section.title}</h3>
                <div className="space-y-4">
                  {section.faqs.map((faq, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        className="w-full text-left px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors flex justify-between items-center"
                        onClick={() => setOpenFaq(`${section.title}-${i}` === openFaq ? null : `${section.title}-${i}`)}
                      >
                        <span className="font-semibold text-slate-900">{faq.q}</span>
                        <svg
                          className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === `${section.title}-${i}` ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openFaq === `${section.title}-${i}` && (
                        <div className="px-6 py-4 bg-white border-t border-slate-200">
                          <p className="text-slate-600">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}