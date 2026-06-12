"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PixelButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function PixelButton({
  children,
  className,
  href,
  onClick,
}: PixelButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const GRID_SIZE = 8; // 8 block segments

  const content = (
    <>
      {/* Staggered Pixel Hover Grid Overlay */}
      <div className="absolute inset-0 grid grid-cols-8 pointer-events-none z-0 bg-transparent">
        {Array.from({ length: GRID_SIZE }).map((_, i) => {
          const delay = Math.abs(Math.sin(i * 1.5)) * 0.12;
          return (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: Static hover grid cells order never changes
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isHovered ? 1 : 0 }}
              transition={{
                duration: 0.2,
                ease: [0.19, 1, 0.22, 1],
                delay: isHovered ? delay : 0.12 - delay,
              }}
              style={{ originY: i % 2 === 0 ? 0 : 1 }}
              className="bg-foreground w-full h-full"
            />
          );
        })}
      </div>

      {/* Content wrapper */}
      <span className="relative z-10 flex items-center justify-center gap-1.5 transition-colors duration-200">
        {children}
      </span>
    </>
  );

  const buttonClasses = cn(
    "relative overflow-hidden border-2 border-foreground font-mono text-[10px] sm:text-xs uppercase px-4 sm:px-6 py-2.5 sm:py-3 font-bold transition-all duration-300 active:translate-x-[2px] active:translate-y-[2px] select-none",
    isHovered
      ? "text-background border-foreground shadow-[2px_2px_0px_var(--color-accent)]"
      : "text-foreground bg-transparent shadow-[4px_4px_0px_var(--color-accent)]",
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className={buttonClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={buttonClasses}
    >
      {content}
    </button>
  );
}
