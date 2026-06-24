"use client";

import {
  ArrowLeft,
  Award,
  Cpu,
  Database,
  ExternalLink,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePreloader } from "@/components/PreloaderContext";
import { PixelButton } from "@/components/ui/PixelButton";
import { TextReveal } from "@/components/ui/TextReveal";

interface ProjectDetailsType {
  title: string;
  subtitle: string;
  num: string;
  challenge: string;
  solution: string;
  schemaTitle: string;
  tables: { name: string; columns: string[] }[];
  codeSnippet: string;
  metrics: { label: string; value: string }[];
  livePreviewUrl?: string | null;
  githubUrl?: string | null;
  imageUrl?: string | null;
}

interface ProjectDetailClientProps {
  project: ProjectDetailsType;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const { isCompleted } = usePreloader();

  return (
    <main className="min-h-screen w-full pt-28 sm:pt-36 pb-20 px-4 sm:px-8 md:px-16 lg:px-24 select-none relative overflow-hidden bg-background">
      {/* Background decoration grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-[0.03] border-x border-foreground">
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
      </div>

      {/* Return Navigation & Outbound Action links */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10 w-full border-b border-border/10 pb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={
            isCompleted ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
          }
          viewport={{ once: false, margin: "-80px" }}
        >
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 font-mono text-xs text-foreground hover:text-accent font-bold uppercase transition-colors"
          >
            <ArrowLeft size={14} /> [ BACK TO ARCHIVE ]
          </Link>
        </motion.div>

        {/* Live Preview and Source links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={
            isCompleted ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
          }
          viewport={{ once: false, margin: "-80px" }}
          className="flex flex-wrap gap-4 font-mono text-xs font-bold uppercase"
        >
          {project.livePreviewUrl && (
            <a
              href={project.livePreviewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-accent hover:underline border border-accent/20 bg-accent/5 px-3 py-1.5 rounded-sm"
            >
              <ExternalLink size={12} /> [ LIVE_PREVIEW ]
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-foreground hover:text-accent hover:underline border border-foreground/20 bg-secondary/10 px-3 py-1.5 rounded-sm"
            >
              <svg className="w-3 h-3 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg> [ GITHUB_REPOS ]
            </a>
          )}
        </motion.div>
      </div>

      {/* Giant Editorial Header */}
      <div className="border-b border-border/30 pb-12 mb-16 relative z-10 w-full overflow-hidden">
        <div className="font-sans font-black text-4xl sm:text-7xl md:text-[8vw] uppercase tracking-tighter leading-[0.85] flex flex-col gap-2">
          <TextReveal text={project.title} />
          <TextReveal text={project.subtitle} outline />
        </div>
      </div>

      {/* Project Image Viewport */}
      {project.imageUrl && (
        <div className="w-full border-2 border-foreground mb-16 relative shadow-[8px_8px_0px_var(--color-accent)] max-h-[500px] overflow-hidden select-none z-10 bg-secondary/5 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* 2-Column Split: Challenge Details & Database Schematic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full mb-16 relative z-10">
        {/* Left Column: Challenge Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
          className="lg:col-span-6 space-y-6"
        >
          <div className="border-l-4 border-accent pl-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block mb-1">
              {project.num} THE CHALLENGE
            </span>
            <p className="font-mono text-xs sm:text-sm text-foreground leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="border-l-4 border-foreground/30 pl-4">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground font-bold block mb-1">
              THE SOLUTIONS ENGINE
            </span>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {project.solution}
            </p>
          </div>
        </motion.div>

        {/* Right Column: Database Schematic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
          className="lg:col-span-6 relative border border-border/20 bg-transparent backdrop-blur-[6px] p-6 shadow-[6px_6px_0px_var(--color-accent)] rounded-none flex flex-col gap-6"
        >
          <div className="flex justify-between items-center border-b border-border/30 pb-3">
            <div className="flex gap-2 items-center text-accent">
              <Database size={14} />
              <span className="font-mono text-[10px] tracking-wider uppercase font-bold">
                {project.schemaTitle}
              </span>
            </div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase">
              [SCHEMA_BLUEPRINT]
            </div>
          </div>

          {/* Styled Schema Diagram Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.tables.map((table) => (
              <div
                key={table.name}
                className="border border-border/20 bg-secondary/5 p-4 rounded-none font-mono text-[10px] space-y-2 select-all"
              >
                <div className="border-b border-border/20 pb-1 text-foreground font-bold uppercase flex items-center justify-between">
                  <span>[{table.name}]</span>
                  <span className="text-[8px] text-accent/50 font-normal">
                    TABLE
                  </span>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  {table.columns.map((col) => (
                    <div key={col} className="truncate">
                      {col}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 2-Column Split: Code Optimization & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch w-full mb-16 relative z-10">
        {/* Left Column: syntax-highlighted code snippet */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
          className="lg:col-span-8 border border-border/20 bg-transparent backdrop-blur-[6px] p-4 sm:p-6 shadow-[6px_6px_0px_var(--color-accent)] rounded-none flex flex-col justify-between"
        >
          <div className="flex justify-between items-center border-b border-border/30 pb-3 mb-4">
            <div className="flex gap-2 items-center text-accent">
              <Terminal size={14} />
              <span className="font-mono text-[10px] tracking-wider uppercase font-bold">
                ENGINEERING_REFACTOR.ts
              </span>
            </div>
            <span className="text-[8px] font-mono text-muted-foreground uppercase">
              [SERVER_COMPILER]
            </span>
          </div>

          <pre className="font-mono text-[10px] sm:text-xs text-foreground/80 overflow-x-auto p-4 bg-secondary/10 border border-border/10 select-all leading-relaxed whitespace-pre scrollbar-thin">
            <code>{project.codeSnippet}</code>
          </pre>
        </motion.div>

        {/* Right Column: Performance Audit Blueprint */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
          className="lg:col-span-4 border border-border/20 bg-transparent backdrop-blur-[6px] p-6 shadow-[6px_6px_0px_var(--color-accent)] rounded-none flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent border-b border-border/30 pb-3">
              <Award size={14} />
              <span className="font-mono text-[10px] tracking-wider uppercase font-bold">
                PERFORMANCE BLUEPRINT
              </span>
            </div>

            <div className="space-y-6">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                    {metric.label}
                  </span>
                  <span className="font-mono text-3xl font-black text-accent tracking-tighter block uppercase">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-dashed border-border/20 text-[9px] font-mono text-muted-foreground flex gap-1.5 items-center">
            <Cpu size={12} />
            <span>AUDITED VIA NEXT.JS TURBOCHECK</span>
          </div>
        </motion.div>
      </div>

      {/* Full-bleed mock layout visual section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
        className="w-full border border-border/20 bg-transparent backdrop-blur-[6px] p-8 sm:p-12 shadow-[8px_8px_0px_var(--color-accent)] rounded-none flex flex-col items-center justify-center text-center gap-6 relative z-10"
      >
        <ShieldAlert size={28} className="text-accent animate-pulse" />
        <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tighter leading-none text-foreground">
          PRODUCTION ENGINE STABILIZED
        </h3>
        <p className="font-mono text-xs text-muted-foreground max-w-xl leading-relaxed">
          Case deployments are running at the edge. The integrity protection
          framework is locked and monitoring operational sockets constantly.
        </p>

        <div className="mt-4">
          <PixelButton href="/archive">[ RETURN TO ARCHIVE ]</PixelButton>
        </div>
      </motion.div>
    </main>
  );
}
