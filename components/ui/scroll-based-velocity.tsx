"use client";

import type { MotionValue } from "motion/react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import React, { useContext, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ScrollVelocityRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  baseVelocity?: number;
  direction?: 1 | -1;
  scrollReactivity?: boolean;
  pauseOnHover?: boolean;
}

export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const ScrollVelocityContext = React.createContext<MotionValue<number> | null>(
  null,
);

export function ScrollVelocityContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });

  return (
    <ScrollVelocityContext.Provider value={velocityFactor}>
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </ScrollVelocityContext.Provider>
  );
}

export function ScrollVelocityRow({
  pauseOnHover,
  ...props
}: ScrollVelocityRowProps) {
  const sharedVelocityFactor = useContext(ScrollVelocityContext);
  if (sharedVelocityFactor) {
    return (
      <ScrollVelocityRowImpl
        {...props}
        pauseOnHover={pauseOnHover}
        velocityFactor={sharedVelocityFactor}
      />
    );
  }
  return <ScrollVelocityRowLocal {...props} pauseOnHover={pauseOnHover} />;
}

interface ScrollVelocityRowImplProps extends ScrollVelocityRowProps {
  velocityFactor: MotionValue<number>;
}

function ScrollVelocityRowImpl({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  velocityFactor,
  scrollReactivity = true,
  pauseOnHover = false,
  ...props
}: ScrollVelocityRowImplProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [numCopies, setNumCopies] = useState(1);
  const isHoveredRef = useRef(false);

  const baseX = useMotionValue(0);
  const baseDirectionRef = useRef<number>(direction >= 0 ? 1 : -1);
  const currentDirectionRef = useRef<number>(direction >= 0 ? 1 : -1);
  const unitWidth = useMotionValue(0);

  const isInViewRef = useRef(true);
  const isPageVisibleRef = useRef(true);
  const prefersReducedMotionRef = useRef(false);

  /* biome-ignore lint/correctness/useExhaustiveDependencies: Shadcn/magicui library dependency requirements */
  useEffect(() => {
    const container = containerRef.current;
    const block = blockRef.current;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    let mq: MediaQueryList | null = null;
    const handleVisibility = () => {
      isPageVisibleRef.current = document.visibilityState === "visible";
    };
    const handlePRM = () => {
      if (mq) {
        prefersReducedMotionRef.current = mq.matches;
      }
    };

    if (container && block) {
      const updateSizes = () => {
        const cw = container.offsetWidth || 0;
        const bw = block.scrollWidth || 0;
        unitWidth.set(bw);
        const nextCopies = bw > 0 ? Math.max(3, Math.ceil(cw / bw) + 2) : 1;
        setNumCopies((prev) => (prev === nextCopies ? prev : nextCopies));
      };

      updateSizes();

      ro = new ResizeObserver(updateSizes);
      ro.observe(container);
      ro.observe(block);

      io = new IntersectionObserver(([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      });
      io.observe(container);

      document.addEventListener("visibilitychange", handleVisibility, {
        passive: true,
      });
      handleVisibility();

      mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", handlePRM);
      handlePRM();
    }

    return () => {
      if (ro) {
        ro.disconnect();
      }
      if (io) {
        io.disconnect();
      }
      document.removeEventListener("visibilitychange", handleVisibility);
      if (mq) {
        mq.removeEventListener("change", handlePRM);
      }
    };
  }, [children, unitWidth]);

  const x = useTransform([baseX, unitWidth], ([v, bw]) => {
    const width = Number(bw) || 1;
    const offset = Number(v) || 0;
    return `${-wrap(0, width, offset)}px`;
  });

  useAnimationFrame((_, delta) => {
    if (
      !isInViewRef.current ||
      !isPageVisibleRef.current ||
      isHoveredRef.current
    )
      return;
    const dt = delta / 1000;
    const vf = scrollReactivity ? velocityFactor.get() : 0;
    const absVf = Math.min(5, Math.abs(vf));
    const speedMultiplier = prefersReducedMotionRef.current ? 1 : 1 + absVf;

    if (absVf > 0.1) {
      const scrollDirection = vf >= 0 ? 1 : -1;
      currentDirectionRef.current = baseDirectionRef.current * scrollDirection;
    }

    const bw = unitWidth.get() || 0;
    if (bw <= 0) return;
    const pixelsPerSecond = (bw * baseVelocity) / 100;
    const moveBy =
      currentDirectionRef.current * pixelsPerSecond * speedMultiplier * dt;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    /* biome-ignore lint/a11y/noStaticElementInteractions: Mouse listeners for hover pausing */
    <div
      ref={containerRef}
      onMouseEnter={() => {
        if (pauseOnHover) isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        if (pauseOnHover) isHoveredRef.current = false;
      }}
      className={cn("w-full overflow-hidden whitespace-nowrap", className)}
      {...props}
    >
      <motion.div
        className="inline-flex transform-gpu items-center will-change-transform select-none"
        style={{ x }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <div
            /* biome-ignore lint/suspicious/noArrayIndexKey: Static loop layout duplications */
            key={i}
            ref={i === 0 ? blockRef : null}
            aria-hidden={i !== 0}
            className="inline-flex shrink-0 items-center"
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function ScrollVelocityRowLocal({
  pauseOnHover,
  ...props
}: ScrollVelocityRowProps) {
  const { scrollY } = useScroll();
  const localVelocity = useVelocity(scrollY);
  const localSmoothVelocity = useSpring(localVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const localVelocityFactor = useTransform(localSmoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });
  return (
    <ScrollVelocityRowImpl
      {...props}
      pauseOnHover={pauseOnHover}
      velocityFactor={localVelocityFactor}
    />
  );
}
