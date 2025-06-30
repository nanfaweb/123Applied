"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const cardImages = [
  "/cards/card1.jpg",
  "/cards/card2.jpg",
  "/cards/card3.jpg",
  "/cards/card4.jpg",
  "/cards/card5.jpg",
];

// 🔽 Fade-in on scroll hook
const useFadeInOnScroll = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("fade-in-up");
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
};

export default function LandingSection() {
  const headingRef = useFadeInOnScroll();
  const carouselRef = useFadeInOnScroll();
  const imageRef = useFadeInOnScroll();

  return (
    <section className="w-full bg-white py-16 px-4 flex flex-col items-center">
      {/* 🔥 Heading */}
      <h2
        ref={headingRef}
        className="fade-hidden text-4xl font-bold text-gray-800 mb-10 transition-all duration-700 font-playfair"
      >
        Our Recent Hires
      </h2>

      {/* 🔁 Auto-scrolling Carousel */}
      <div
        ref={carouselRef}
        className="w-full overflow-hidden mb-10 fade-hidden transition-all duration-700"
      >
        <div className="flex w-max animate-scroll-left gap-4">
          {[...cardImages, ...cardImages].map((src, index) => (
            <div
              key={index}
              className="relative h-[160px] w-[280px] rounded-xl overflow-hidden shadow-md flex-shrink-0"
            >
              <Image
                src={src}
                alt={`Card ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 📊 Dashboard Image */}
      <div
        ref={imageRef}
        className="w-full max-w-5xl h-[50vh] relative opacity-0 transition-all duration-700"
      >
        <Image
          src="/dashboardimg.png"
          alt="Dashboard Preview"
          fill
          className="object-contain rounded-xl shadow-xl"
        />
      </div>
    </section>
  );
}
