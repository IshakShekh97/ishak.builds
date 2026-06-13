"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePreloader } from "./PreloaderContext";

// Number of grid cells (16 columns by 10 rows on desktop, 8 columns by 20 rows on mobile)
const CELL_COUNT = 160;

const PHASES = [
  { min: 0, max: 15, text: "SYS_BOOT // INITIALIZING CORE PROCESSES" },
  { min: 16, max: 35, text: "LOAD_STACK // NEXT.JS v16 + MOTION v12" },
  { min: 36, max: 55, text: "LOAD_STYLES // TAILWIND v4 ENGINE ACTIVE" },
  { min: 56, max: 75, text: "GRID_ALIGN // INJECTING PIXELS TO VIEWPORT" },
  { min: 76, max: 90, text: "CONNECT_SOCKETS // ESTABLISHING DATA STREAM" },
  { min: 91, max: 99, text: "MOUNT_INTERFACE // FINAL DEPLOYMENT" },
  { min: 100, max: 100, text: "SYS_ONLINE // BOOT SEQUENCE COMPLETED" },
];

// Stagger exit delay formula based on cell index (deterministic pseudo-random scatter)
const getCellDelay = (index: number) => {
  return Math.abs(Math.sin(index * 42.12) * 0.7); // 0.0s to 0.7s delay
};

// Returns visual styling details for cells (border lines, indicators)
const getCellHighlights = (index: number) => {
  if (index % 17 === 0) return "border-t border-l border-accent/40";
  if (index % 23 === 0) return "border-b border-r border-accent/20";
  return "border border-border/10";
};

export default function PixelPreloader() {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isTransitionFinished, setIsTransitionFinished] = useState(false);
  const { complete } = usePreloader();

  const [diagnostics, setDiagnostics] = useState({
    res: "1920X1080",
    platform: "BROWSER_ENV",
    time: "12:00:00",
  });

  // Load diagnostics and run progress simulation on mount
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Gather client specs safely after mount
    let platform = "UNKNOWN";
    if (navigator.userAgent.indexOf("Chrome") !== -1) platform = "CHROME";
    else if (navigator.userAgent.indexOf("Firefox") !== -1)
      platform = "FIREFOX";
    else if (navigator.userAgent.indexOf("Safari") !== -1) platform = "SAFARI";
    else if (navigator.userAgent.indexOf("Edge") !== -1) platform = "EDGE";

    setDiagnostics({
      res: `${window.innerWidth}X${window.innerHeight}`,
      platform,
      time: new Date().toLocaleTimeString(),
    });

    const timeInterval = setInterval(() => {
      setDiagnostics((prev) => ({
        ...prev,
        time: new Date().toLocaleTimeString(),
      }));
    }, 1000);

    // Simulated cinematic loading progression
    let currentProgress = 0;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      if (currentProgress >= 100) {
        setProgress(100);
        return;
      }

      let increment = 1;
      let delay = 30;

      // Organic variable loading speed curves
      if (currentProgress < 15) {
        increment = Math.floor(Math.random() * 3) + 2; // Fast start
        delay = 40;
      } else if (currentProgress < 40) {
        increment = Math.floor(Math.random() * 2) + 1; // Slower handshake
        delay = 80;
      } else if (currentProgress < 65) {
        increment = Math.floor(Math.random() * 4) + 2; // Jump ahead
        delay = 40;
      } else if (currentProgress < 85) {
        increment = 1; // Slow crawl near the end
        delay = 100;
      } else if (currentProgress < 99) {
        increment = Math.random() > 0.75 ? 1 : 0; // Stalls at 98%-99%
        delay = 150;
      } else {
        increment = 1;
        delay = 200;
      }

      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);
      timeoutId = setTimeout(tick, delay);
    };

    tick();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(timeInterval);
      document.body.style.overflow = ""; // Safety fallback cleanup
    };
  }, []);

  // Control exit trigger when progress completes
  useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        complete();
      }, 700); // 700ms cinematic beat at 100%

      return () => clearTimeout(exitTimer);
    }
  }, [progress, complete]);

  // Clean up component after transition is fully complete
  useEffect(() => {
    if (isExiting) {
      const cleanupTimer = setTimeout(() => {
        setIsTransitionFinished(true);
        document.body.style.overflow = ""; // Restore scrolling
      }, 1200); // Wait for the longest staggered transition to finish (0.7s delay + 0.4s duration + buffer)

      return () => clearTimeout(cleanupTimer);
    }
  }, [isExiting]);

  if (isTransitionFinished) return null;

  // Select slogan based on current progress
  let activeSlogan = "ISHAK.BUILDS";
  if (progress >= 34 && progress < 67) {
    activeSlogan = "BUILD DIFFERENT";
  } else if (progress >= 67) {
    activeSlogan = "BEST OF BESTS";
  }

  // Find active diagnostic phase description
  const activePhase =
    PHASES.find((p) => progress >= p.min && progress <= p.max)?.text ||
    PHASES[0].text;

  // Cell variants for pixelated scale-down exit transition
  const cellVariants = {
    visible: {
      scale: 1.01, // Slightly overlap to prevent gaps
      opacity: 1,
    },
    hidden: {
      scale: 0,
      opacity: 0,
    },
  };

  return (
    <div className="fixed inset-0 z-9999 w-screen h-screen overflow-hidden select-none pointer-events-auto">
      {/* Grid of Pixels (Covers screen, responsive column counts to fit index exactly) */}
      <div className="grid grid-cols-8 md:grid-cols-16 grid-rows-20 md:grid-rows-10 w-full h-full absolute inset-0 bg-transparent">
        {Array.from({ length: CELL_COUNT }).map((_, i) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: Static grid cells order never changes
            key={i}
            variants={cellVariants}
            initial="visible"
            animate={isExiting ? "hidden" : "visible"}
            transition={{
              duration: 0.4,
              ease: [0.76, 0, 0.24, 1], // Snippy brutalist bezier curve
              delay: getCellDelay(i),
            }}
            className={cn(
              "bg-background relative flex items-center justify-center transition-colors duration-300",
              getCellHighlights(i),
            )}
          >
            {/* Embedded coordinate indicators inside pixels */}
            {i % 19 === 0 && !isExiting && (
              <span className="hidden sm:inline font-mono text-[8px] tracking-tighter text-accent/35 absolute bottom-1 right-1 uppercase select-none">
                [PX_{i.toString(16).toUpperCase()}]
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Massive Typographic Background Slogan Overlay */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-10">
        <AnimatePresence mode="wait">
          {!isExiting && (
            <motion.h1
              key={activeSlogan}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              animate={{ opacity: 0.15, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                WebkitTextStroke: "1.5px currentColor",
                color: "transparent",
              }}
              className="font-sans font-black text-4xl sm:text-7xl md:text-[9vw] tracking-tighter leading-none uppercase text-center select-none max-w-full px-4 text-foreground/15"
            >
              {activeSlogan}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Spacious Full-screen HUD Console Overlay */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 text-foreground pointer-events-none"
          >
            {/* Top HUD Row: Navigation & Beacon Indicators */}
            <div className="flex justify-between items-start w-full border-b border-border/30 pb-4 pointer-events-auto">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] sm:text-[10px] text-accent uppercase font-extrabold tracking-widest">
                  {"// INITIALIZING INTERFACE //"}
                </span>
                <h2 className="font-sans font-black text-lg sm:text-2xl tracking-tight uppercase leading-none">
                  ISHAK.BUILDS.CORE_V2.0
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest hidden sm:inline">
                  BOOT_DIAGNOSTIC_ACTIVE
                </span>
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                </div>
              </div>
            </div>

            {/* Central Progress HUD Widget */}
            <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-4 md:gap-6 pointer-events-auto my-auto">
              {/* Massive Percentage readout */}
              <div className="flex items-baseline justify-center">
                <span className="font-sans font-black text-7xl sm:text-9xl tracking-tighter text-accent leading-none select-all">
                  {progress.toString().padStart(3, "0")}%
                </span>
              </div>

              {/* Minimal Brutalist Progress Bar */}
              <div className="flex gap-0.5 sm:gap-1 h-3 sm:h-4 w-full bg-secondary/50 border border-border/40 p-0.5 sm:p-1 backdrop-blur-sm">
                {Array.from({ length: 20 }).map((_, idx) => {
                  const isFilled = progress >= (idx + 1) * 5;
                  return (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: Static progress bar elements
                      key={idx}
                      className={cn(
                        "h-full flex-1 transition-all duration-150",
                        isFilled ? "bg-accent" : "bg-transparent",
                      )}
                    />
                  );
                })}
              </div>

              {/* Running Status Log */}
              <div className="font-mono text-[10px] sm:text-xs border border-border/40 p-3 bg-background/60 backdrop-blur-md w-full flex items-center justify-between gap-4">
                <span className="text-foreground tracking-tight uppercase truncate">
                  {activePhase}
                </span>
                <span className="text-accent font-bold shrink-0 animate-pulse">
                  {progress === 100 ? "[OK]" : "[WAIT]"}
                </span>
              </div>
            </div>

            {/* Bottom HUD Row: Wide Diagnostics Parameter Grid */}
            <div className="w-full border-t border-border/30 pt-4 pointer-events-auto">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-y-3 gap-x-6 font-mono text-[9px] sm:text-[10px] text-muted-foreground">
                <div className="flex flex-col">
                  <span>VIEWPORT_RES</span>
                  <span className="text-foreground font-bold">
                    {diagnostics.res}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>ENGINE_PLATFORM</span>
                  <span className="text-foreground font-bold">
                    {diagnostics.platform}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>CLOCK_TIME</span>
                  <span className="text-foreground font-bold">
                    {diagnostics.time}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>CORE_LATENCY</span>
                  <span className="text-accent font-bold">
                    {(10 + Math.sin(progress) * 3).toFixed(1)}ms
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>DIAG_LOAD</span>
                  <span className="text-foreground font-bold">
                    {(40 + Math.cos(progress) * 15).toFixed(0)}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>CONNECTION_SEC</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">
                    VERIFIED_SSL
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
