"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function TerminalBackground() {
  const [isMounted, setIsMounted] = useState(false);
  const [systime, setSystime] = useState("");

  // Setup client side listeners and dynamic timestamp ticker
  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      const ms = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      setSystime(`${new Date().toLocaleTimeString()}::${ms}`);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 -z-10 w-screen h-screen overflow-hidden pointer-events-none select-none text-foreground">
      {/* 1. Subtle Dot Matrix Schematic Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* 2. CRT Line-raster scanlines */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* 3. CRT Screen Edge Glow + Micro Flicker Animation */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-transparent to-foreground/1.5 animate-flicker" />

      {/* 4. Division Coordinate Lines (Growing from 0 to 100% on boot) */}
      {/* Horizontal Line: Top division */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
        className="absolute top-[12%] left-0 right-0 h-px bg-border/30"
      />
      {/* Horizontal Line: Bottom division */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[10%] left-0 right-0 h-px bg-border/30"
      />
      {/* Vertical Line: Left division */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
        className="absolute left-[8%] top-0 bottom-0 w-px bg-border/30"
      />
      {/* Vertical Line: Right division */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.6 }}
        className="absolute right-[8%] top-0 bottom-0 w-px bg-border/30"
      />

      {/* 5. HUD Telemetry Coordinate Details (Fade-in on boot) */}
      <div className="absolute inset-0 p-6 font-mono text-[8px] sm:text-[9px] text-muted-foreground/30 flex flex-col justify-between">
        {/* Top Left Telemetry */}
        <div className="absolute top-[14%] left-[10%] flex flex-col gap-1">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            [GRID_LOC: 0x8F9A]
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-accent/40 font-bold"
          >
            [SYS_NODE: Active]
          </motion.span>
        </div>

        {/* Top Right Telemetry */}
        <div className="absolute top-[14%] right-[10%] text-right flex flex-col gap-1">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            [REFRESH_RATE: 120Hz]
          </motion.span>
          <span className="tabular-nums">[TIME: {systime}]</span>
        </div>

        {/* Bottom Left Telemetry */}
        <div className="absolute bottom-[12%] left-[10%] flex flex-col gap-1">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            [LATENCY: OPTIMAL]
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
          >
            [SEC: SHIELD_ON]
          </motion.span>
        </div>

        {/* Bottom Right Telemetry */}
        <div className="absolute bottom-[12%] right-[10%] text-right flex flex-col gap-1">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            [KERN_V: 16.2.9]
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2.0 }}
            className="text-accent/40 font-bold"
          >
            {"// BUILD_DIFFERENT //"}
          </motion.span>
        </div>
      </div>

      {/* 6. Dynamic glowing corner ticks (Brutalist grid junctions) */}
      <div className="absolute top-[12%] left-[8%] translate-x-[-50%] translate-y-[-50%] w-2 h-2 border border-accent/40 bg-background" />
      <div className="absolute top-[12%] right-[8%] translate-x-[50%] translate-y-[-50%] w-2 h-2 border border-accent/40 bg-background" />
      <div className="absolute bottom-[10%] left-[8%] translate-x-[-50%] translate-y-[50%] w-2 h-2 border border-accent/40 bg-background" />
      <div className="absolute bottom-[10%] right-[8%] translate-x-[50%] translate-y-[50%] w-2 h-2 border border-accent/40 bg-background" />
    </div>
  );
}
