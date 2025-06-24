'use client'

import { FC, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePricing } from '@/context/PricingContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const StickyButton: FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { activePlan } = usePricing()

  useEffect(() => {
    const handleScroll = () => {
      // Get the original button position (approximately 500px from top)
      const scrollPosition = window.scrollY
      setIsVisible(scrollPosition > 700)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <a
            href="/signup"
            className={`inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl after:content-[''] after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-300 after:bg-gradient-to-t after:from-white/20 after:to-transparent after:pointer-events-none relative overflow-hidden group animate-glow ${              activePlan === 'student'                ? 'bg-gradient-to-r from-pink-500 to-[#e61c71] hover:shadow-[#e61c71]/30 border-2 border-[#e61c71]/60 group-hover:animate-button-hover'
                : 'bg-gradient-to-br from-violet-500 to-purple-500 hover:shadow-violet-500/30 border-2 border-violet-400/60 group-hover:animate-button-hover'
            }`}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
            Get Hired Today
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StickyButton
