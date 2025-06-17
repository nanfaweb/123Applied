'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

const Hero: FC = () => {
  return (    <section className="px-8 max-w-[1400px] mx-auto text-center min-h-[60vh] flex flex-col justify-start items-center relative z-10 pt-24 pb-8">
      <div className="max-w-[1200px] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/15 text-black/90 px-4 py-1.5 rounded-full text-sm font-medium mb-5 backdrop-blur-md border border-white/20"
        >
          🚀 AI-Powered Career Acceleration
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-playfair text-[3.8rem] font-bold text-[#1a1a1a] leading-tight mb-5 max-md:text-[2.8rem] max-sm:text-[2.2rem] whitespace-nowrap"
        >
          Job Applications On <span className="text-[#e61c71] italic relative">Auto-Pilot</span>
        </motion.h1>
        
        <div className="flex flex-row justify-center gap-6 max-w-[1100px] mx-auto items-center mb-7 max-md:flex-col max-md:gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-2.5 text-base text-black/80"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 flex-shrink-0" />
            <span>Transform your search - apply to your dream roles automatically</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-2.5 text-base text-black/80"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5 flex-shrink-0" />
            <span>Get your applications handed in while you prepare for interviews</span>
          </motion.div>
        </div>        <div className="flex flex-col items-center gap-4 mt-15">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <a href="#" className="inline-flex items-center gap-2 bg-[#e61c71] text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#e61c71]/30 border-2 border-[#e61c71]/60 relative overflow-hidden group">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
              Get Hired Today
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="flex items-center -space-x-1.5">
              {['AS', 'PT', 'MJ'].map((initials, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-semibold text-white">
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">150+ Active Users</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero