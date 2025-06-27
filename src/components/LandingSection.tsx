"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

const cardImages = [
  "/cards/card1.jpg",
  "/cards/card2.jpg",
  "/cards/card3.jpg",
  "/cards/card4.jpg",
  "/cards/card5.jpg",
];

// 👇 helper to animate on scroll (fade in)
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
      {
        threshold: 0.2,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
};

export default function LandingSection() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 2.5,
      spacing: 16,
    },
  });

  const headingRef = useFadeInOnScroll();
  const carouselRef = useFadeInOnScroll();
  const imageRef = useFadeInOnScroll();

  return (
    <section className="w-full bg-white py-16 px-4 flex flex-col items-center">
      {/* 🔥 Heading */}
      <h2
        ref={headingRef}
        className="opacity-0 text-4xl font-bold text-gray-800 mb-10 transition-all duration-700"
      >
        Our Recent Hires
      </h2>

      {/* 🔁 Carousel */}
      <div
        ref={(node) => {
          carouselRef.current = node;
          if (sliderRef) sliderRef(node);
        }}
        className="keen-slider w-full max-w-6xl mb-10 opacity-0 transition-all duration-700"
      >
        {cardImages.map((src, index) => (
          <div
            key={index}
            className="keen-slider__slide relative h-[13.5rem] rounded-xl overflow-hidden shadow-md"
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

      {/* 📊 Dashboard Image */}
      <div
        ref={imageRef}
        className="w-full max-w-5xl h-[60vh] relative opacity-0 transition-all duration-700"
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
