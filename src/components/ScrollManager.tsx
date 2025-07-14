"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

interface ScrollManagerProps {
  scrollContainerSelector?: string;
}

export default function ScrollManager({ scrollContainerSelector }: ScrollManagerProps) {
  useEffect(() => {
    let scrollContainer: HTMLElement | undefined;
    if (scrollContainerSelector) {
      scrollContainer = document.querySelector(scrollContainerSelector) as HTMLElement | undefined;
    }
    const lenis = new Lenis({
      wrapper: scrollContainer || undefined,
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [scrollContainerSelector]);

  return null;
}
