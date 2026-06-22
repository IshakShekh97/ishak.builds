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
import type { BioLink, BioProfile } from "@/lib/generated/prisma/client";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface BioLinksClientProps {
  profile: BioProfile & { links: BioLink[] };
}

export function BioLinksClient({ profile }: BioLinksClientProps) {
  return (
    <div className="w-full max-w-md flex flex-col gap-8 items-stretch relative z-10">
      <ThemeSwitcher className="fixed bottom-10 right-10" />

      {/* Profile Header Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
        className="flex flex-col items-center text-center gap-3 border border-border/20 bg-background/50 backdrop-blur-[6px] p-6 shadow-[4px_4px_0px_var(--color-accent)] rounded-none relative"
      >
        {/* Corner Decorators */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-accent" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-accent" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-accent" />

        <div className="relative">
          {/* Blinking Beacon Indicator */}
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          {/* Avatar Badge */}
          {profile.avatarUrl ? (
            <div className="w-14 h-14 border-2 border-foreground rounded-full overflow-hidden bg-secondary/15 flex items-center justify-center">
              {/* biome-ignore lint/performance/noImgElement: standard image tag needed for Cloudinary dynamic avatar */}
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 border-2 border-foreground bg-accent/10 flex items-center justify-center text-foreground font-black text-lg select-all uppercase">
              {profile.initials || "IS"}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h1 className="font-sans font-black text-xl tracking-tight text-foreground uppercase">
            {profile.name}
          </h1>
          <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-extrabold flex items-center gap-1 justify-center">
            <Terminal size={10} />
            {profile.beaconText || "SYSTEM_BIO_ROUTER_V2"}
          </span>
        </div>

        <p className="font-mono text-[10px] text-muted-foreground leading-relaxed normal-case">
          {profile.bio ||
            "Architecting raw, high-performance brutalist interfaces."}
        </p>
      </motion.div>

      {/* Links Stack */}
      <div className="flex flex-col gap-4 w-full">
        {profile.links.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.19, 1, 0.22, 1] as const,
              delay: idx * 0.08,
            }}
            className="w-full relative group block"
          >
            {item.isExternal ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="border border-border/20 bg-background/50 backdrop-blur-[6px] p-5 flex items-center justify-between gap-4 transition-all duration-300 group-hover:border-accent group-hover:shadow-[6px_6px_0px_var(--color-accent)] cursor-crosshair rounded-none"
              >
                <div className="space-y-1 text-left">
                  <span className="font-sans font-black text-sm uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors block leading-none">
                    {item.label}
                  </span>
                  {item.desc && (
                    <span className="font-mono text-[9px] text-muted-foreground block leading-none normal-case">
                      {item.desc}
                    </span>
                  )}
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                />
              </a>
            ) : (
              <Link
                href={item.url}
                className="border border-border/20 bg-background/50 backdrop-blur-[6px] p-5 flex items-center justify-between gap-4 transition-all duration-300 group-hover:border-accent group-hover:shadow-[6px_6px_0px_var(--color-accent)] cursor-crosshair rounded-none"
              >
                <div className="space-y-1 text-left">
                  <span className="font-sans font-black text-sm uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors block leading-none">
                    {item.label}
                  </span>
                  {item.desc && (
                    <span className="font-mono text-[9px] text-muted-foreground block leading-none normal-case">
                      {item.desc}
                    </span>
                  )}
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
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.19, 1, 0.22, 1] as const,
          delay: 0.35,
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
  );
}
