"use client";

import { Clock, Cpu, GitBranch, Shield, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePreloader } from "./PreloaderContext";
import { PixelButton } from "./ui/PixelButton";
import { TextReveal } from "./ui/TextReveal";

const navigationLinks = [
  { label: "[ CONNECT ]", url: "/book" },
  { label: "[ ARCHIVE ]", url: "/archive" },
  {
    label: "[ SOURCE_CODE ]",
    url: "https://github.com/IshakShekh97/ishak.builds",
  },
];

const socialLinks = [
  { label: "[ GITHUB ]", url: "https://github.com/IshakShekh97" },
  { label: "[ LINKEDIN ]", url: "https://linkedin.com" },
  { label: "[ INSTAGRAM ]", url: "https://instagram.com" },
];

export default function Footer() {
  const { isCompleted } = usePreloader();
  const [systime, setSystime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const ms = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      setSystime(`${new Date().toLocaleTimeString()}::${ms}`);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={isCompleted ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
      className="w-full bg-background border-t-2 border-foreground relative z-20 select-none py-16 px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col gap-12 md:gap-18 font-mono text-xs text-muted-foreground overflow-hidden"
    >
      {/* 1. Giant Brutalist Typographic Header Block */}
      <div className="border-b border-border/30 pb-12 w-full overflow-hidden">
        <div className="font-sans font-black text-5xl sm:text-7xl md:text-[8.5vw] uppercase tracking-tighter leading-[0.85] flex flex-col gap-2">
          <TextReveal text="LET'S BUILD" className="text-foreground" />
          <TextReveal text="SOMETHING" className="text-accent" />
          <TextReveal text="DIFFERENT" className="text-orange-600" />
        </div>
      </div>

      {/* 2. Asymmetric Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full border-b border-dashed border-border/30 pb-12">
        {/* CLI Branding (Column 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 border-l-2 border-accent pl-4 py-1">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Terminal size={14} />
              <span className="font-sans font-black tracking-widest text-foreground">
                {"ISHAK.BUILDS // CORE_V2"}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-md text-muted-foreground">
              Hi, I&apos;m Ishak Shekh. I compile high-performance, raw
              brutalist digital interfaces. We reject standard cookie-cutter
              layouts. Our custom code is structured for speed and built with
              absolute pixel precision.
            </p>
          </div>
          <div className="text-[9px] text-muted-foreground/50 uppercase">
            {"[ DESIGNED_TO_OUTCLASS ]"}
          </div>
        </div>

        {/* Directory Links Dashboard Block - Split into Navigation and Social without Title (Column 4) */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          {/* Navigation Links Column */}
          <div className="flex flex-col gap-2">
            {navigationLinks.map((link) => (
              <PixelButton
                key={link.label}
                href={link.url}
                className="w-full text-center border-border/30 hover:border-accent/40 font-bold"
              >
                {link.label}
              </PixelButton>
            ))}
          </div>

          {/* Social Links Column */}
          <div className="flex flex-col gap-2">
            {socialLinks.map((link) => (
              <PixelButton
                key={link.label}
                href={link.url}
                className="w-full text-center border-border/30 hover:border-accent/40 font-bold"
              >
                {link.label}
              </PixelButton>
            ))}
          </div>
        </div>

        {/* Console Diagnostics Telemetry (Column 3) */}
        <div className="lg:col-span-3 flex flex-col gap-4 border border-border/30 p-4 bg-secondary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/30" />
          <span className="text-[10px] uppercase font-bold text-foreground">
            {"// CORE_STATUS"}
          </span>
          <div className="space-y-2 text-[10px]">
            <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>SYSTEM</span>
              </span>
              <span className="text-emerald-500 font-bold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Cpu size={12} className="text-muted-foreground" />
                <span>CPU_LOAD</span>
              </span>
              <span className="text-foreground font-bold">MINIMAL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield size={12} className="text-muted-foreground" />
                <span>SHIELD_SYS</span>
              </span>
              <span className="text-accent font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Status Ticker Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full text-[9px] tracking-wider uppercase">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span className="flex items-center gap-1.5">
            <GitBranch size={10} />
            <span>BRANCH: MAIN</span>
          </span>
          <span>BUILD: V2.1.0-PRODUCTION</span>
          <span>DEPLOY: VERCEL_EDGE</span>
        </div>
        <div className="flex items-center gap-1.5 text-right w-full sm:w-auto justify-between sm:justify-end">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock size={10} />
            <span>TICKER:</span>
          </span>
          <span className="tabular-nums text-foreground font-bold bg-secondary/30 px-2 py-0.5 border border-border/20">
            {systime}
          </span>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="text-[8px] uppercase tracking-widest text-center text-muted-foreground/30 border-t border-border/10 pt-4 mt-2">
        {"© "}
        {new Date().getFullYear()}
        {" ISHAK SHEKH // ALL RIGHTS RESERVED // CODE STRUCTURED TO OUTCLASS"}
      </div>
    </motion.footer>
  );
}
