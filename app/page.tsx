"use client";

import React from "react";
import { motion } from "motion/react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ArrowUpRight, Terminal, Cpu, LayoutGrid, Code2 } from "lucide-react";

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300"
    >
      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Bio Card */}
        <div className="lg:col-span-8 border-2 border-foreground p-8 flex flex-col justify-between relative overflow-hidden group bg-card">
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-muted-foreground">
            [01 / INTRO]
          </div>
          <div className="space-y-6">
            <div className="flex gap-2 text-accent">
              <Cpu size={18} />
              <Code2 size={18} />
            </div>
            <h1 className="text-5xl sm:text-7xl font-sans font-black tracking-tight leading-none uppercase">
              BUILT <br />
              <span className="text-accent underline decoration-4 underline-offset-4">
                DIFFERENT
              </span>
            </h1>
            <p className="font-mono text-sm sm:text-base max-w-xl text-muted-foreground leading-relaxed">
              Hi, I&apos;m Ishak Shekh. I craft high-performance, raw brutalist
              digital interfaces and engineering solutions. I reject boring UI
              paradigms. Focused on speed, structure, and extreme pixel
              precision.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 border-2 border-foreground bg-foreground text-background font-mono text-xs uppercase px-6 py-3 font-bold hover:bg-transparent hover:text-foreground transition-all duration-300 shadow-[4px_4px_0px_var(--color-accent)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--color-accent)]">
              EXPLORE ARCHIVE <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Diagnostic Sidebar Panels */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Panel 1: Tech Specs */}
          <div className="border-2 border-foreground p-6 flex flex-col justify-between bg-card flex-1 relative">
            <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-muted-foreground">
              [02 / STACK]
            </div>
            <div className="space-y-4">
              <h3 className="font-sans font-extrabold text-lg uppercase tracking-wide">
                ENGINEERING_STACK
              </h3>
              <div className="font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">FRAMEWORK</span>
                  <span className="font-bold">NEXT.JS 16</span>
                </div>
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">ANIMATIONS</span>
                  <span className="font-bold">MOTION</span>
                </div>
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">STYLING</span>
                  <span className="font-bold">TAILWIND v4</span>
                </div>
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">LINTER/FORMAT</span>
                  <span className="font-bold">BIOME</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-accent">
              <Terminal size={14} />
              <span>SYSTEM_HEALTH_OPTIMAL</span>
            </div>
          </div>

          {/* Panel 2: Live Build Status */}
          <div className="border-2 border-foreground p-6 flex flex-col justify-between bg-card flex-1 relative">
            <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-muted-foreground">
              [03 / SYS]
            </div>
            <div className="space-y-4">
              <h3 className="font-sans font-extrabold text-lg uppercase tracking-wide">
                LIVE_METRICS
              </h3>
              <div className="font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GRID STATUS</span>
                  <span className="text-accent">12X12 ONLINE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    VISUAL ARTICULATION
                  </span>
                  <span>STRICT BRUTALIST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    LOAD PERFORMANCE
                  </span>
                  <span className="text-emerald-500">99.8ms</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs font-mono">
              <span>DEPLOYED: V1.0.0</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout Grid Pattern Footer */}
      <footer className="border-t border-border p-6 mt-12 bg-card">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground">
          <span>DESIGNED AND CODED IN THE SHADOWS. © 2026 ISHAK SHEKH.</span>
          <span className="flex items-center gap-1">
            <LayoutGrid size={12} />
            <span>GRID: ENABLED</span>
          </span>
        </div>
      </footer>
    </motion.main>
  );
}
