"use client";

import React, { useState } from "react";
import Link from "next/link";
import Pricing from "../../../components/Pricing";

// Dummy data for UI demonstration (for when user HAS a plan)
const userHasPlan = true; // Change to true to preview the other state
// Use the first two proTiers from Pricing for simulation
const proTiers = [
  { submissions: 25, price: 79.99 },
  { submissions: 100, price: 299.99 },
];
const currentPlan = {
  name: `Pro (${proTiers[0].submissions} Letters)`,
  billingCycle: "Monthly",
  lettersRemaining: 14,
  lettersTotal: proTiers[0].submissions,
  renewalDate: "2025-08-01",
  status: "Active",
  cardBrand: "Visa",
  cardLast4: "4242",
};
const billingHistory = [
  { date: "2025-06-01", plan: "Pro", amount: "$19", status: "Paid" },
  { date: "2025-05-01", plan: "Pro", amount: "$19", status: "Paid" },
];
const faqs = [
  { q: "How do I upgrade my plan?", a: "Select a new plan above and follow the checkout process." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel or downgrade from your dashboard." },
];

export default function BillingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(203_213_225,0.15)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
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
          
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Billing & Plans
          </h1>
        </div>

        {/* Pricing Plans - When user has no plan */}
        {!userHasPlan && (
          <div className="mb-16">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 p-8 lg:p-12">
              <Pricing showPayButton={true} />
            </div>
          </div>
        )}

        {/* Main Content - When user has a plan */}
        {userHasPlan && (
          <div className="space-y-8">
            {/* Current Plan Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Current Plan</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white">{currentPlan.name}</span>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30">
                        {currentPlan.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/80 text-sm mb-1">Next renewal</div>
                    <div className="text-white font-semibold">{currentPlan.renewalDate}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{currentPlan.lettersRemaining}</div>
                    <div className="text-sm text-slate-600">Letters Remaining</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{currentPlan.lettersTotal}</div>
                    <div className="text-sm text-slate-600">Total Letters</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{currentPlan.billingCycle}</div>
                    <div className="text-sm text-slate-600">Billing Cycle</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Options */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Upgrade Your Plan</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upgrade Plan */}
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Pro Plus</h3>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                        Upgrade
                      </span>
                    </div>
                    <div className="mb-6">
                      <div className="text-3xl font-bold mb-2">{proTiers[1].submissions} Letters</div>
                      <div className="text-white/80 text-sm">Perfect for growing businesses</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${proTiers[1].price}</span>
                      <button className="px-6 py-2 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add-on Pack */}
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 p-8 text-white hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Letter Pack</h3>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                        Add-on
                      </span>
                    </div>
                    <div className="mb-6">
                      <div className="text-3xl font-bold mb-2">+{proTiers[0].submissions} Letters</div>
                      <div className="text-white/80 text-sm">One-time purchase</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${proTiers[0].price}</span>
                      <button className="px-6 py-2 bg-white text-rose-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
                        Add Pack
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {billingHistory.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.date}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{row.plan}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            row.status === "Paid" 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "bg-slate-100 text-slate-800"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-slate-400 hover:text-slate-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">Payment Method</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{currentPlan.cardBrand}</span>
                    </div>
                    <span className="text-slate-600 font-mono">•••• •••• •••• {currentPlan.cardLast4}</span>
                  </div>
                </div>
                <button className="px-6 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                  Update Card
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4 mb-8">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full text-left px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors flex justify-between items-center"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-semibold text-slate-900">{faq.q}</span>
                      <svg 
                        className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className="px-6 py-4 bg-white border-t border-slate-200">
                        <p className="text-slate-600">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <button className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}