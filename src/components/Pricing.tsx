'use client'

import { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePricing } from '@/context/PricingContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faBriefcase } from '@fortawesome/free-solid-svg-icons'

interface PricingTier {
  submissions: number
  price: number
  features: string[]
}

const Pricing: FC = () => {
  const { activePlan: activeTab, setActivePlan: setActiveTab } = usePricing()

  const studentTiers: PricingTier[] = [
    { 
      submissions: 25,
      price: 39.99,
      features: [
        "Role-Customized Resumes",
        "Industry Specific",
        "Priority Support"
      ]
    },
    { 
      submissions: 50,
      price: 69.99,
      features: [
        "Role-Customized Resumes",
        "Industry Specific",
        "Priority Support"
      ]
    },
    { 
      submissions: 100,
      price: 99.99,
      features: [
        "Role-Customized Resumes",
        "Industry Specific",
        "Priority Support"
      ]
    }
  ]

  const proTiers: PricingTier[] = [
    { 
      submissions: 25,
      price: 79.99,
      features: [
        "Resume + Cover Letter",
        "ATS Optimization",
        "Dedicated Support"
      ]
    },
    { 
      submissions: 100,
      price: 299.99,
      features: [
        "Resume + Cover Letter",
        "ATS Optimization",
        "Dedicated Support"
      ]
    },
    { 
      submissions: 200,
      price: 399.99,
      features: [
        "Resume + Cover Letter",
        "ATS Optimization",
        "Dedicated Support"
      ]
    }
  ]

  const currentTiers = activeTab === 'student' ? studentTiers : proTiers

  return (
    <section className="py-24 px-8 relative overflow-hidden" id="pricing">

      <div className="relative">
        <div className="text-center font-playfair">
          <span className={`block text-2xl font-semibold mb-4 ${
            activeTab === 'student' ? 'text-[#e61c71]' : 'text-violet-500'
          }`}>Pricing Plans</span>
          <span className="block text-5xl font-bold text-[#1a1a1a] mb-4">Choose Your Path</span>
          <span className="block text-gray-700 max-w-2xl mx-auto text-xl font-bold font-sans leading-relaxed">Select the perfect plan for your job application needs.</span>
        </div>

        {/* Plan Toggle */}
        <div className="flex justify-center mt-12 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg inline-flex relative">
            <div 
              className={`absolute inset-y-2 rounded-full transition-all duration-500 ease-in-out ${
                activeTab === 'student' 
                ? 'bg-gradient-to-r from-pink-500 to-[#e61c71] left-2 right-[50%]' 
                : 'bg-gradient-to-br from-violet-500 to-purple-500 left-[50%] right-2'
              }`} 
            />
            <button 
              onClick={() => setActiveTab('student')}
              className={`w-[160px] px-6 py-2 rounded-full font-semibold transition-all duration-300 relative z-10 cursor-pointer hover:cursor-pointer flex items-center justify-center ${
                activeTab === 'student' 
                ? 'text-white' 
                : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Students
            </button>
            <button 
              onClick={() => setActiveTab('pro')}
              className={`w-[160px] px-6 py-2 rounded-full font-semibold transition-all duration-300 relative z-10 cursor-pointer hover:cursor-pointer flex items-center justify-center ${
                activeTab === 'pro' 
                ? 'text-white' 
                : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Professionals
            </button>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-8 px-4 max-lg:grid-cols-1">
          {currentTiers.map((tier, index) => (
            <div
              key={index}              className={`group relative min-h-[400px] pt-4 ${
                activeTab === 'student' 
                ? 'bg-white/80' 
                : 'bg-[#1a1a1a]'
              } backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-xl transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:-translate-y-1 ${
                activeTab === 'student'
                ? 'hover:shadow-[0_8px_30px_rgba(230,28,113,0.3)] hover:border-pink-300/30'
                : 'hover:shadow-[0_8px_30px_rgba(139,92,246,0.5)] hover:border-violet-300/30'
              }`}
            >
              <AnimatePresence mode="wait">
                {((activeTab === 'student' && index === 0) || (activeTab === 'pro' && index === 1)) && (
                  <motion.div
                    key={`popular-${activeTab}-${index}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute top-0 left-1/2 -translate-x-1/2 px-4 py-2 rounded-b-xl z-10 ${
                      activeTab === 'student'
                      ? 'bg-gradient-to-r from-pink-500 to-[#e61c71]'
                      : 'bg-gradient-to-br from-violet-500 to-purple-500'
                    }`}
                  >
                    <p className="text-white text-sm font-semibold whitespace-nowrap">Most Popular</p>
                  </motion.div>
                )}
              </AnimatePresence>              <div className="relative p-6">
                <div className={`absolute top-1 left-6 w-10 h-10 rounded-xl flex items-center justify-center ${
                  activeTab === 'student'                  ? 'bg-gradient-to-br from-pink-100 to-pink-200'
                  : 'bg-gradient-to-br from-violet-500/30 to-purple-500/30'
                }`}>
                  <FontAwesomeIcon 
                    icon={activeTab === 'student' ? faGraduationCap : faBriefcase} 
                    className={`text-xl ${
                      activeTab === 'student' 
                      ? 'text-[#e61c71]' 
                      : 'text-violet-500'
                    }`}
                  />
                </div>
                <div className="text-center mb-6">
                  <div className="mt-2.5">
                    <p className={`text-4xl font-bold mb-2.5 ${
                      activeTab === 'student' ? 'text-[#1a1a1a]' : 'text-white'
                    }`}>${tier.price}</p>
                    <p className={
                      activeTab === 'student' ? 'text-gray-600' : 'text-gray-400'
                    }>{tier.submissions} Custom Resumes</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className={`flex items-center ${
                      activeTab === 'student' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-3 ${
                        activeTab === 'student' 
                        ? 'bg-[#e61c71]' 
                        : 'bg-violet-400'
                      }`}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => window.location.href = '/signup'}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-500 ease-in-out cursor-pointer transform hover:scale-[1.02] hover:-translate-y-0.5 ${
                    activeTab === 'student'
                    ? 'bg-gradient-to-r from-pink-500 to-[#e61c71] text-white hover:shadow-lg hover:shadow-[#e61c71]/20'
                    : 'bg-gradient-to-br from-violet-500 to-purple-500 text-white hover:shadow-lg hover:shadow-violet-500/20'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg">Need a custom solution? <a href="#contact" className={`font-semibold transition-colors duration-300 ${
            activeTab === 'student' 
            ? 'text-[#e61c71] hover:text-[#ff1b7c]' 
            : 'text-violet-500 hover:text-violet-400'
          }`}>Contact us</a></p>
        </div>
      </div>
    </section>
  )
}

export default Pricing