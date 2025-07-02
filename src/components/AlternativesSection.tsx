"use client";

import { useEffect, useRef } from "react";

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

export default function AlternativesSection() {
  const sectionRef = useFadeInOnScroll();

  const data = [
    { feature: "Auto-Applies to Jobs", applied: true, ai: false, diy: false },
    { feature: "Human-Reviewed", applied: true, ai: false, diy: false },
    { feature: "Saves 100+ Hours", applied: true, ai: true, diy: false },
    { feature: "Tracks Applications", applied: true, ai: false, diy: false },
    { feature: "Built for Hiring", applied: true, ai: false, diy: false },
    { feature: "Zero Effort Needed", applied: true, ai: false, diy: false },
    { feature: "Personalized to You", applied: true, ai: false, diy: false },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-20 px-6 flex flex-col items-center fade-hidden transition-all duration-700"
    >
      <h2 className="text-4xl font-bold mb-12 text-black font-playfair">
        Some Alternatives
      </h2>

      <div className="w-full max-w-6xl overflow-auto border-4 border-black rounded-2xl">
        <table className="min-w-full text-center text-sm md:text-base text-black font-semibold border-collapse rounded-2xl overflow-hidden">
          <thead className="bg-black text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="border-r border-white p-4">Features</th>
              <th className="border-r border-white p-4 text-white">123Applied</th>
              <th className="border-r border-white p-4 text-white">AI Tools</th>
              <th className="p-4 text-white">Do It Yourself</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t border-black">
                <td className="p-4 border-r border-black text-left">{row.feature}</td>
                <td className="p-4 border-r border-black">{row.applied ? "✅" : "❌"}</td>
                <td className="p-4 border-r border-black">{row.ai ? "✅" : "❌"}</td>
                <td className="p-4">{row.diy ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
