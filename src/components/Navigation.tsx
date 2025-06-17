'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { motion } from 'framer-motion'

const Navigation: FC = () => {
  return (
    <nav className="group/nav fixed w-[35%] top-3 left-1/2 -translate-x-1/2 z-[1000] bg-transparent px-4 py-2 transition-all duration-500 ease-in-out rounded-[40px] hover:backdrop-blur-xl hover:bg-black/90 hover:px-[40px] max-md:w-auto max-md:mx-4 max-md:translate-x-0 max-md:left-0">
      <div className="flex items-center justify-center gap-6 relative">
        {/* Left Links */}
        <div className="flex-1 opacity-0 group-hover/nav:opacity-100 transition-all duration-500 ease-in-out">
          <ul className="flex gap-4 list-none translate-x-[-20px] group-hover/nav:translate-x-0 transition-all duration-500 max-md:flex-col max-md:gap-2 max-md:absolute max-md:top-[50px] max-md:left-1/2 max-md:-translate-x-1/2 max-md:bg-black/90 max-md:p-3 max-md:rounded-xl max-md:min-w-[130px]">
            <li>
              <Link href="#users" className="text-white/80 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-[16px] transition-all duration-300 font-semibold text-sm">Users</Link>
            </li>
            <li>
              <Link href="#features" className="text-white/80 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-[16px] transition-all duration-300 font-semibold text-sm">Features</Link>
            </li>
          </ul>
        </div>
        
        {/* Logo - Always Visible */}
        <Link href="/" className="flex items-center justify-center transition-all duration-300">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-[40px] h-[40px]"
          >
            <Image 
              src="/mascot.png"
              alt="Applied Mascot"
              fill
              priority
              className="object-contain rounded-lg animate-float"
            />
          </motion.div>
        </Link>
        
        {/* Right Links */}
        <div className="flex-1 opacity-0 group-hover/nav:opacity-100 transition-all duration-500 ease-in-out">
          <ul className="flex justify-end gap-4 list-none translate-x-[20px] group-hover/nav:translate-x-0 transition-all duration-500 max-md:flex-col max-md:gap-2 max-md:absolute max-md:top-[50px] max-md:right-5 max-md:bg-black/90 max-md:p-3 max-md:rounded-xl max-md:min-w-[130px]">
            <li>
              <Link href="#pricing" className="text-white/80 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-[16px] transition-all duration-300 font-semibold text-sm">Pricing</Link>
            </li>
            <li>
              <Link href="#contact" className="text-white/80 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-[16px] transition-all duration-300 font-semibold text-sm">Support</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
