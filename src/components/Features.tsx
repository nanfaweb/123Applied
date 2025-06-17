'use client'

import { FC } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const Features: FC = () => {
  const features = [
    { src: '/card1.jpg', alt: 'Upload Profile' },
    { src: '/card2.jpg', alt: 'AI Generation' },
    { src: '/card3.jpg', alt: 'Expert Review' },
    { src: '/card4.jpg', alt: 'Manual Application' },
  ]

  return (
    <section className="py-16 px-8" id="features">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center text-5xl font-playfair text-[#1a1a1a] mb-16 max-w-[900px] mx-auto leading-tight"
      >
        In the era of <span className="text-[#ff1b7c] italic">AI</span>, our professional{' '}
        <span className="text-[#ff1b7c] italic">human</span> team ensures your applications stand out
      </motion.h2>

      <div className="grid grid-cols-4 gap-6 max-w-[1400px] mx-auto px-4 max-xl:grid-cols-2 max-md:grid-cols-1">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border-2 border-white/8 shadow-lg transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] group"
          >            <div className="relative aspect-square overflow-hidden">
              <Image
                src={feature.src}
                alt={feature.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-400 group-hover:scale-105"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Features
