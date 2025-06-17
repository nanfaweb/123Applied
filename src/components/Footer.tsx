'use client'

import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'

const Footer: FC = () => {
  return (
    <footer className="bg-black/90 backdrop-blur-xl pt-12 pb-8 px-8 text-white mt-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-4 gap-8">
        {/* Logo and Description Column */}
        <div className="flex flex-col items-start">
          <div className="relative w-full h-[100px] max-w-[200px] mb-4">
            <Image 
              src="/logo2.png"
              alt="123Applied Logo"
              fill
              className="object-contain"
              sizes="200px"
            />
          </div>
          <p className="text-white/70 text-sm leading-relaxed max-w-[300px]">
            Revolutionizing job applications with AI-powered automation and intelligent matching.
          </p>
          <div className="flex gap-4 mt-5">
            <a href="#" className="text-white/70 text-xl hover:text-[#e61c71] transition-colors duration-300" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="text-white/70 text-xl hover:text-[#e61c71] transition-colors duration-300" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="#" className="text-white/70 text-xl hover:text-[#e61c71] transition-colors duration-300" aria-label="GitHub">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </div>

        {/* Product Column */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">Features</Link></li>
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">Pricing</Link></li>
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">Templates</Link></li>
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">API</Link></li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">About Us</Link></li>
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">Careers</Link></li>
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">Blog</Link></li>
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">Press</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">Help Center</Link></li>
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">Contact Us</Link></li>
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">Privacy Policy</Link></li>
            <li><Link href="#" className="text-white/70 hover:text-[#e61c71] transition-colors duration-300">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto pt-8 mt-12 border-t border-white/10 text-center">
        <p className="text-white/50 text-sm">&copy; 2025 Applied. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
