"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function ScrollManager() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
      smoothWheel: true,
       // keep this off for mobile if not needed
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      // Optional: cleanup if you hot-reload during dev
      lenis.destroy();
    };
  }, []);

  return null;
}
