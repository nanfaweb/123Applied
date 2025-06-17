"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const CustomerCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollContainer = carouselRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        // When we reach the duplicate set, seamlessly jump back to the first set
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 30);
    
    // Reset scroll position on mount
    scrollContainer.scrollLeft = 0;

    return () => clearInterval(intervalId);
  }, []);  const customers = Array.from({ length: 25 }, (_, i) => i + 1);
  // Create two sets with unique identifiers
  const duplicatedCustomers = [
    ...customers.map(num => ({ id: `set1-${num}`, num })),
    ...customers.map(num => ({ id: `set2-${num}`, num }))
  ];
  return (    <section className="pb-8 pt-2 bg-transparent relative z-10">
      <div className="container mx-auto px-4 relative">
        <div 
          ref={carouselRef}
          className="flex overflow-hidden space-x-8 whitespace-nowrap"
          style={{ 
            willChange: 'scroll-position',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            background: 'linear-gradient(to right, rgba(56, 189, 248, 0), rgba(56, 189, 248, 0))'
          }}
        >
          {duplicatedCustomers.map(({ id, num }) => (            <div key={id} className="inline-flex flex-col items-center flex-shrink-0 group">              <div className="w-24 h-24 mb-8 relative transition-transform duration-300 ease-in-out hover:scale-110 rounded-full">
                <div className="absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-sm"></div>
                <Image
                  src={`/custs/${num}/logo.png`}
                  alt={`Company ${num} logo`}
                  fill
                  className="object-contain transition-transform duration-300 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                />
              </div>
              <div className="w-20 h-20 mb-6 rounded-full overflow-hidden relative transition-transform duration-300 ease-in-out hover:scale-110">
                <div className="absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-sm"></div>
                <Image
                  src={`/custs/${num}/${num}.jpg`}
                  alt={`Customer ${num}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerCarousel;
