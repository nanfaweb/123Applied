"use client";

import { useEffect, useRef } from "react";

// Custom hook for fade-in-on-scroll
const useFadeInOnScroll = (stagger = false) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = stagger ? Array.from(el.children) : [el];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("fade-in-up");
            }, stagger ? idx * 100 : 0); // stagger effect
          }
        });
      },
      { threshold: 0.2 }
    );

    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [stagger]);

  return ref;
};

// List of specialities
const majors = [
  { name: "Finance", emoji: "💰" },
  { name: "Doctor", emoji: "🩺" },
  { name: "Investment Banking", emoji: "🏦" },
  { name: "Software Engineer", emoji: "💻" },
  { name: "Data Scientist", emoji: "📊" },
  { name: "Marketing", emoji: "📢" },
  { name: "UI/UX Design", emoji: "🎨" },
  { name: "Accounting", emoji: "📈" },
  { name: "Cybersecurity", emoji: "🔐" },
  { name: "Mechanical Eng.", emoji: "⚙️" },
  { name: "Product Manager", emoji: "🧠" },
  { name: "AI/ML", emoji: "🤖" },
  { name: "Graphic Design", emoji: "🖌️" },
  { name: "Civil Engineer", emoji: "🏗️" },
  { name: "Nursing", emoji: "🧑‍⚕️" },
  { name: "Economics", emoji: "📉" },
  { name: "Human Resources", emoji: "🧑‍💼" },
  { name: "Business Analyst", emoji: "📋" },
  { name: "Teacher", emoji: "👩‍🏫" },
  { name: "Game Dev", emoji: "🎮" },
  { name: "Entrepreneurship", emoji: "🚀" },
  { name: "Legal Studies", emoji: "⚖️" },
  { name: "Pharmacist", emoji: "💊" },
  { name: "Architecture", emoji: "📐" },
];

export default function SpecialitiesSection() {
  const sectionRef = useFadeInOnScroll();
  const headingRef = useFadeInOnScroll();
  const cardsRef = useFadeInOnScroll(true); // staggered

  return (
    <section className="w-full bg-white py-20 px-4 flex justify-center">
      <div
        ref={sectionRef}
        className="fade-hidden bg-black w-[90%] rounded-2xl py-16 px-6 text-white flex flex-col items-center shadow-xl"
      >
        {/* 🔥 Heading */}
        <h2
          ref={headingRef}
          className="fade-hidden text-4xl font-bold mb-12 font-playfair text-center transition-all duration-700"
        >
          Our Specialities
        </h2>

        {/* 🔳 Grid of Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl w-full"
        >
          {majors.map((major, index) => (
            <div
              key={index}
              className="opacity-0 translate-y-6 border border-white/20 bg-black text-white rounded-xl px-4 py-3 text-center shadow-md hover:scale-105 transition-transform duration-300"
            >
              <span className="text-lg">
                {major.emoji} {major.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
