"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import "lenis/dist/lenis.css";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // syncTouch enables smooth scrolling on touch/mobile devices
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchMultiplier: 1.0,
      }}
    >
      {children}
    </ReactLenis>
  );
}
