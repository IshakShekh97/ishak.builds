"use client";

import { ArrowUpRight, Cpu, ShieldCheck, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePreloader } from "@/components/PreloaderContext";
import { PixelButton } from "@/components/ui/PixelButton";
import { cn } from "@/lib/utils";

// Typography Variants for the Staggered Letter Reveal
const wordVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
} as const;

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 12,
      stiffness: 150,
    },
  },
} as const;

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const { isCompleted } = usePreloader();

  const mockLogs = [
    "SYS // INITIATING TRUST PROTOCOLS...",
    "SEC // CODES_AUTHENTICATED: OK",
    "PERF // LIGHTHOUSE SCORE: 100/100",
    "DEPL // SHIELD PROTECTION: ACTIVE",
    "EXEC // OUTCLASSING_THE_COMPETITION: TRUE",
    "DONE // SYSTEM READY FOR PRODUCTION",
  ];

  useEffect(() => {
    setIsMounted(true);

    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev < mockLogs.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(logTimer);
  }, []);

  if (!isMounted) return null;

  // Split word into animated span characters
  const splitWord = (word: string) => {
    return word.split("").map((char, i) => (
      <motion.span
        // biome-ignore lint/suspicious/noArrayIndexKey: Letters order never changes
        key={i}
        variants={letterVariants}
        className="inline-block"
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ));
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      whileInView={isCompleted ? { opacity: 1 } : { opacity: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen mx-auto w-full p-4 sm:p-6 md:p-12 pt-28 sm:pt-32 md:pt-36 flex flex-col justify-center items-stretch text-foreground gap-8 md:gap-12"
    >
      {/* Top Layout Block: Side-by-Side (Headline Columns & Specs Sidebar) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full relative z-20">
        {/* Left Headline Area (Spans 8 columns) - Framed by left accent border */}
        <div className="lg:col-span-8 flex flex-col justify-between py-4 pr-0 lg:pr-8 border-l-4 md:border-l-12px border-accent pl-6 md:pl-10 relative gap-8">
          {/* Top Diagnostics Kicker Row */}
          <div className="flex justify-between items-center border-b border-border/30 pb-4 mb-2 w-full">
            <div className="font-mono text-[9px] text-muted-foreground">
              {"[ 01 // OVERVIEW ]"}
            </div>
          </div>

          {/* Main Title Stack */}
          <div className="w-full">
            <div className="font-sans font-black text-6xl sm:text-8xl md:text-[8vw] lg:text-[8.5vw] tracking-tighter leading-none uppercase flex flex-col gap-4">
              {/* Word 1: BUILT */}
              <motion.div
                variants={wordVariants}
                initial="hidden"
                whileInView={isCompleted ? "visible" : "hidden"}
                viewport={{ once: false, margin: "-100px" }}
                className="text-foreground"
              >
                {splitWord("BUILT")}
              </motion.div>

              {/* Tagline & CTAs Sandwiched Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 my-2 border-y border-border/30 w-full normal-case font-normal tracking-normal">
                {/* Sub text: Tagline */}
                <span className="font-serif italic font-light text-xl sm:text-2xl lg:text-3xl text-accent capitalize">
                  {"outclassing the competition."}
                </span>

                {/* Blocky Call to Actions */}
                <div className="flex flex-wrap gap-3 items-center z-10 pointer-events-auto">
                  <PixelButton
                    href="/archive"
                    className="flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-3"
                  >
                    EXPLORE ARTIFACTS <ArrowUpRight size={14} />
                  </PixelButton>
                  <PixelButton
                    href="/book"
                    className="border-accent text-accent shadow-[4px_4px_0px_var(--color-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--color-primary)] px-3 py-2 sm:px-5 sm:py-3"
                  >
                    [ CONNECT ]
                  </PixelButton>
                </div>
              </div>

              {/* Word 2: DIFFRENT (Outline styling) */}
              <motion.div
                variants={wordVariants}
                initial="hidden"
                whileInView={isCompleted ? "visible" : "hidden"}
                viewport={{ once: false, margin: "-100px" }}
                className="text-foreground"
              >
                {splitWord("DIFFERENT")}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Area (Spans 4 columns) */}
        <div className="lg:col-span-4 flex flex-col justify-between py-4 pl-0 lg:pl-8 border-t lg:border-t-0 lg:border-l border-border/30 gap-8">
          {/* Top Telemetry Header */}
          <div className="hidden lg:flex justify-between items-center border-b border-border/30 pb-4">
            <span className="font-mono text-[9px] text-accent uppercase font-extrabold tracking-widest flex items-center gap-2">
              <Cpu size={12} />
              SYSTEM_LIVE_STREAM
            </span>
            <div className="font-mono text-[9px] text-muted-foreground">
              {"[ 02 // TELEMETRY ]"}
            </div>
          </div>

          {/* Specs List Block */}
          <div className="space-y-4 bg-transparent p-5 backdrop-blur border border-accent/10 relative overflow-hidden">
            <div className="absolute top-1 bg-amber-500 size-20 blur-[40rem]" />

            <h3 className="font-sans font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} className="text-accent" />
              ENGINEERING_SPECS
            </h3>

            <div className="font-mono text-[10px] sm:text-xs space-y-2.5">
              <div className="flex justify-between border-b border-border/20 pb-1">
                <span className="text-muted-foreground">FRAMEWORK</span>
                <span className="font-bold">NEXT.JS 16</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-1">
                <span className="text-muted-foreground">ANIMATIONS</span>
                <span className="font-bold">MOTION</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-1">
                <span className="text-muted-foreground">STYLING</span>
                <span className="font-bold">TAILWIND v4</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-1">
                <span className="text-muted-foreground">COMPILER</span>
                <span className="font-bold">TURBOPACK</span>
              </div>
            </div>
          </div>

          {/* Compiler Log Output Block */}
          <div className="space-y-3 flex-1 flex flex-col justify-end">
            <h3 className="font-sans font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              INTEGRITY_CHECK
            </h3>

            <div className="font-mono text-[10px] border border-accent/30 p-3.5 flex flex-col gap-2 min-h-[140px] justify-start text-muted-foreground leading-snug relative bg-card/30 backdrop-blur-3xl overflow-hidden">
              <div className="absolute bottom-0 right-0 size-20 bg-amber-600 blur-[200rem]"></div>

              {mockLogs.slice(0, logIndex + 1).map((log, index) => {
                const isDone = log.startsWith("DONE");
                const isSec = log.startsWith("SEC") || log.startsWith("PERF");
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: Order is static
                    key={index}
                    className={cn(
                      "transition-all duration-300",
                      isDone
                        ? "text-accent font-bold"
                        : isSec
                          ? "text-emerald-500 dark:text-emerald-400 font-bold"
                          : "text-foreground/80",
                    )}
                  >
                    {log}
                  </div>
                );
              })}
              {logIndex < mockLogs.length - 1 && (
                <div className="flex items-center gap-1 text-accent animate-pulse font-bold">
                  <span>COMPILE_SEQUENCE_RUNNING</span>
                  <span className="w-1.5 h-3 bg-accent inline-block" />
                </div>
              )}
              {logIndex === mockLogs.length - 1 && (
                <div className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <span>ishakshekh@built_different %</span>
                  <span className="w-1.5 h-3 bg-emerald-500 dark:bg-emerald-400 inline-block animate-[pulse_1s_infinite]" />
                </div>
              )}
            </div>
          </div>

          {/* Live status footer */}
          <div className="pt-3 border-t border-border/30 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
            <span>BUILD: V2.1.0</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </section>

      {/* Bottom Layout Block: Side-by-Side Details (Intro and Sometext) - Animates on viewport enter */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={isCompleted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-border/30 w-full relative z-20"
      >
        {/* Intro Section */}
        <div className="space-y-3">
          <span className="font-mono text-[9px] text-accent uppercase font-bold tracking-widest block">
            {"// SPECIFICATION //"}
          </span>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Hi, I&apos;m Ishak Shekh. I compile high-performance, raw brutalist
            digital interfaces. We reject standard cookie-cutter layouts. Our
            custom code is structured for speed and built with absolute pixel
            precision.
          </p>
        </div>

        {/* Some Text Section (Trust Assurance) */}
        <div className="space-y-3">
          <span className="font-mono text-[9px] text-accent uppercase font-bold tracking-widest block">
            {"// AUDITED_SECURITY //"}
          </span>
          <p className="font-serif italic font-light text-base sm:text-lg text-foreground leading-relaxed">
            {
              "*A standard of engineering designed to be audit-proof, performance-optimized, and built to scale.*"
            }
          </p>
        </div>
      </motion.section>
    </motion.main>
  );
}
