"use client";

import {
  ArrowUpRight,
  Layers,
  Smartphone,
  Sparkles,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePreloader } from "@/components/PreloaderContext";

const linkItems = [
  {
    label: "[ VIEW PORTFOLIO // ]",
    desc: "Primary full-stack digital showcase archive.",
    url: "/",
    isExternal: false,
  },
  {
    label: "[ BOOK A DEVELOPMENT SCOPE // ]",
    desc: "Initialize a booking questionnaire session.",
    url: "/book",
    isExternal: false,
  },
  {
    label: "[ GITHUB (CODEBASE) // ]",
    desc: "Explore public repositories and source trees.",
    url: "https://github.com/IshakShekh97",
    isExternal: true,
  },
  {
    label: "[ LYNTBRUTT PLATFORM // ]",
    desc: "Case study of the sub-50ms data router.",
    url: "/archive/lyntbrutt",
    isExternal: false,
  },
];

export default function LinkBioRouter() {
  const { isCompleted } = usePreloader();

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center py-24 px-4 sm:px-6 relative select-none overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-transparent -z-20">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "24px 24px, 48px 48px, 48px 48px",
          }}
        />
      </div>

      {/* Main container: Centered and constrained for mobile-first layout */}
      <div className="w-full max-w-md flex flex-col gap-8 items-stretch relative z-10">
        {/* Profile Header Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={
            isCompleted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
          className="flex flex-col items-center text-center gap-3 border border-border/20 bg-transparent backdrop-blur-[6px] p-6 shadow-[4px_4px_0px_var(--color-accent)] rounded-none"
        >
          <div className="relative">
            {/* Blinking Beacon Indicator */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            {/* Mock avatar badge */}
            <div className="w-14 h-14 border-2 border-foreground bg-accent/10 flex items-center justify-center text-foreground font-black text-lg select-all uppercase">
              IS
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-sans font-black text-xl tracking-tight text-foreground uppercase">
              ISHAK.BUILDS
            </h1>
            <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-extrabold flex items-center gap-1 justify-center">
              <Terminal size={10} />
              SYSTEM_BIO_ROUTER_V2
            </span>
          </div>

          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
            Architecting raw, high-performance brutalist interfaces. Compiled
            for speed, engineered to scale.
          </p>
        </motion.div>

        {/* Links Stack */}
        <div className="flex flex-col gap-4 w-full">
          {linkItems.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{
                duration: 0.8,
                ease: [0.19, 1, 0.22, 1] as const,
                delay: idx * 0.1,
              }}
              className="w-full relative group block"
            >
              {item.isExternal ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-border/20 bg-transparent backdrop-blur-[6px] p-5 flex items-center justify-between gap-4 transition-all duration-300 group-hover:border-accent group-hover:shadow-[6px_6px_0px_var(--color-accent)] cursor-crosshair rounded-none"
                >
                  <div className="space-y-1 text-left">
                    <span className="font-sans font-black text-sm uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors block leading-none">
                      {item.label}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground block leading-none">
                      {item.desc}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                  />
                </a>
              ) : (
                <Link
                  href={item.url}
                  className="border border-border/20 bg-transparent backdrop-blur-[6px] p-5 flex items-center justify-between gap-4 transition-all duration-300 group-hover:border-accent group-hover:shadow-[6px_6px_0px_var(--color-accent)] cursor-crosshair rounded-none"
                >
                  <div className="space-y-1 text-left">
                    <span className="font-sans font-black text-sm uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors block leading-none">
                      {item.label}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground block leading-none">
                      {item.desc}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                  />
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Diagnostics HUD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{
            duration: 0.8,
            ease: [0.19, 1, 0.22, 1] as const,
            delay: 0.4,
          }}
          className="border-t border-dashed border-border/30 pt-6 text-[9px] font-mono text-muted-foreground flex justify-between items-center w-full"
        >
          <span className="flex items-center gap-1">
            <Smartphone size={10} /> MOBILE_PORTAL
          </span>
          <span className="flex items-center gap-1">
            <Layers size={10} /> SPEED_LATENCY: 8ms
          </span>
          <span className="flex items-center gap-1 text-accent animate-pulse font-bold">
            <Sparkles size={10} /> SSL_ACTIVE
          </span>
        </motion.div>
      </div>
    </main>
  );
}
