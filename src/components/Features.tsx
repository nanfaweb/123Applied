'use client'

import { FC } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const Features: FC = () => {
  const features = [
    {
      title: "" ,
      src: '/card1.png', // replace with actual LinkedIn UI image
      
    },
    {
      title: '',
      src: '/2ndcard.png',
      gradient: '',
    },
    {
      title: '',
      src: '/3rdcard.png', // dashboard UI
    
    },
  ]

  return (
    <section className="py-20 px-8" id="features">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center text-5xl font-playfair text-[#1a1a1a] mb-20 max-w-[900px] mx-auto leading-tight"
      >
        In the era of <span className="text-[#ff1b7c] italic">AI</span>, our professional{' '}
        <span className="text-[#ff1b7c] italic">human</span> team ensures your applications stand out
      </motion.h2>

      <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto max-lg:grid-cols-2 max-md:grid-cols-1">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`rounded-3xl p-6 text-white flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] `}
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-2xl mb-6">
              <Image
                src={feature.src}
                alt={feature.title}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-lg text-center font-medium leading-snug">{feature.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Features
