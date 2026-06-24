"use client";

import { Code, Cpu, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePreloader } from "@/components/PreloaderContext";
import { TextReveal } from "@/components/ui/TextReveal";

interface ProjectWithTech {
  id: string;
  num: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  url: string;
  mockupType: string;
  imageUrl: string | null;
  livePreviewUrl: string | null;
  githubUrl: string | null;
  desc: string;
  sol: string;
  techs: { name: string }[];
}

interface ArchiveClientProps {
  projects: ProjectWithTech[];
}

export default function ArchiveClient({ projects }: ArchiveClientProps) {
  const { isCompleted } = usePreloader();
  const years = Array.from(new Set(projects.map((p) => p.year))).sort(
    (a, b) => Number(b) - Number(a)
  );

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

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={isCompleted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
        className="border-b border-border/30 pb-10 mb-16 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10"
      >
        <div className="space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block">
            {"// CORE_REPOSITORY // ARCHIVE_V2"}
          </span>
          <h1 className="font-sans font-black text-5xl sm:text-7xl md:text-[8vw] uppercase tracking-tighter leading-none text-foreground">
            <TextReveal text="PROJECT" />
            <TextReveal text="ARCHIVE" className="text-accent" />
          </h1>
        </div>
        <div className="font-mono text-xs text-muted-foreground md:text-right max-w-sm">
          A full historic registry of built digital frameworks, case
          deployments, and full-stack engineering prototypes.
        </div>
      </motion.div>

      {/* Redesigned Project Alternating List by Year */}
      <div className="space-y-36 relative z-10 w-full">
        {years.length === 0 ? (
          <div className="border border-dashed border-foreground/30 p-16 text-center text-muted-foreground font-mono text-sm uppercase">
            [ NO_ARCHIVED_PROJECTS_STABILIZED ]
          </div>
        ) : (
          years.map((year) => {
            const yearProjects = projects.filter((p) => p.year === year);
            return (
              <div
                key={year}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full border-t border-dashed border-border/30 pt-16 relative"
              >
                {/* Year Sticky Header (Spans 2 columns) */}
                <div className="lg:col-span-2 sticky top-36 z-0 pointer-events-none select-none">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.19, 1, 0.22, 1] as const,
                    }}
                    className="flex items-baseline gap-2"
                  >
                    <span className="font-sans font-black text-6xl sm:text-8xl md:text-[7vw] leading-none tracking-tighter text-accent">
                      {year}
                    </span>
                  </motion.div>
                  <div className="border-t-2 border-accent/40 w-full mt-4 max-w-[80px]" />
                </div>

                {/* Projects List (Spans 10 columns) */}
                <div className="lg:col-span-10 flex flex-col gap-24 sm:gap-32 w-full relative z-10">
                  {yearProjects.map((project, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <div
                        key={project.slug}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center w-full"
                      >
                        {/* Column A (Text Specs): Order 1 on Mobile, Left on Even, Right on Odd */}
                        <motion.div
                          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false, margin: "-80px" }}
                          transition={{
                            duration: 0.8,
                            ease: [0.19, 1, 0.22, 1] as const,
                          }}
                          className={`lg:col-span-6 flex flex-col justify-center ${
                            isEven ? "lg:order-1" : "lg:order-2"
                          } gap-4 bg-background/50 backdrop-blur-md border border-border/20 p-6 sm:p-8 shadow-xl relative z-10`}
                        >
                          <div className="font-mono text-xs text-accent font-bold uppercase flex items-center gap-1.5">
                            <Cpu size={12} /> {project.num} {project.category}
                          </div>
                          <h3 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-foreground leading-none">
                            {project.title}
                          </h3>
                          <div className="space-y-3 border-l-2 border-border/40 pl-4 py-1">
                            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                              <span className="text-foreground font-semibold uppercase block text-[10px] tracking-wider mb-1">
                                [ SYSTEM DESCRIPTION ]
                              </span>
                              {project.desc}
                            </p>
                            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                              <span className="text-foreground font-semibold uppercase block text-[10px] tracking-wider mb-1">
                                [ ARCHITECTURAL WIN ]
                              </span>
                              {project.sol}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.techs.map((tag) => (
                              <span
                                key={tag.name}
                                className="font-mono text-[9px] font-bold border border-accent/40 bg-accent/5 px-2 py-0.5 text-accent tracking-wider"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                          
                          {/* Live preview and github links */}
                          <div className="flex gap-4 font-mono text-[9px] font-bold uppercase text-accent mt-2">
                            {project.livePreviewUrl && (
                              <a
                                href={project.livePreviewUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:underline"
                              >
                                <ExternalLink size={10} /> Live Preview
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:underline text-foreground"
                              >
                                <svg className="w-2.5 h-2.5 inline mr-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                  <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg> Source Code
                              </a>
                            )}
                          </div>

                          <Link
                            href={`/archive/${project.slug}`}
                            className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground uppercase tracking-widest font-bold mt-4 hover:text-accent transition-colors w-fit border-b border-foreground hover:border-accent pb-0.5 cursor-crosshair"
                          >
                            OPEN CASE STUDY <ExternalLink size={12} />
                          </Link>
                        </motion.div>

                        {/* Column B (Visual Mockup): Order 2 on Mobile, Right on Even, Left on Odd */}
                        <motion.div
                          initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false, margin: "-80px" }}
                          transition={{
                            duration: 0.8,
                            ease: [0.19, 1, 0.22, 1] as const,
                          }}
                          className={`lg:col-span-6 ${
                            isEven ? "lg:order-2" : "lg:order-1"
                          } relative group`}
                        >
                          {/* Pop Out offset block behind */}
                          <div className="absolute inset-0 bg-blue-600 dark:bg-accent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 translate-y-0 group-hover:translate-x-4 group-hover:translate-y-4 -z-10 border-2 border-blue-600 dark:border-accent" />

                          <div className="relative group cursor-crosshair">
                            {/* Visual Background Offset Pop Block */}
                            <div className="absolute inset-0 bg-blue-600 dark:bg-accent border-2 border-blue-600 dark:border-accent transition-all duration-300 translate-x-0 translate-y-0 group-hover:translate-x-3 group-hover:translate-y-3 -z-10" />

                            {/* Browser Mockup Container */}
                            <div className="border-2 border-foreground bg-background p-4 sm:p-5 min-h-[220px] md:min-h-0 md:aspect-video flex flex-col justify-between transition-all duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:invert shadow-lg">
                              {/* Browser Control Header */}
                              <div className="flex justify-between items-center border-b border-border/30 pb-3 mb-3 w-full">
                                <div className="flex gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                                </div>
                                <div className="bg-secondary/40 border border-border/40 px-3 py-1 font-mono text-[9px] text-muted-foreground w-1/2 text-center rounded-sm truncate">
                                  {`https://${project.title.toLowerCase().replace(/\s+/g, "-")}.builds`}
                                </div>
                                <div className="w-10 flex justify-end">
                                  <Code
                                    size={11}
                                    className="text-muted-foreground"
                                  />
                                </div>
                              </div>

                              {/* Mockup Canvas Screen Content */}
                              <div className="flex-1 border border-dashed border-border/40 p-3 flex flex-col justify-between bg-card/10 relative overflow-hidden">
                                {project.imageUrl ? (
                                  /* If project has an uploaded screenshot, show it */
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                ) : project.mockupType === "terminal" ? (
                                  <div className="font-mono text-[10px] space-y-2 flex-1 flex flex-col justify-between">
                                    <div className="text-accent flex justify-between">
                                      <span>
                                        $ {project.title.toLowerCase().replace(/\s+/g, "-")} --init
                                      </span>
                                      <span className="text-muted-foreground">
                                        [READY]
                                      </span>
                                    </div>
                                    <div className="text-foreground/45 border-y border-border/20 py-1 flex-1 flex flex-col gap-1 justify-center">
                                      <div>
                                        {"CACHE_HIT: 8ms // REDIS_ESTABLISHED"}
                                      </div>
                                      <div>SERVERLESS_EDGE_ROUTING: ACTIVE</div>
                                      <div>ZERO_JS_HTML_RENDER: OK</div>
                                    </div>
                                    <div className="flex justify-between items-center text-[8px] text-muted-foreground">
                                      <span>PORT: 3000</span>
                                      <span>HOST: NEXT_EDGE</span>
                                    </div>
                                  </div>
                                ) : project.mockupType === "matrix" ? (
                                  <div className="font-mono text-[10px] flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-center text-accent">
                                      <span>[ {project.title.toUpperCase()}_CONCURRENT_MATRIX ]</span>
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 my-2 py-1 border-y border-border/20 flex-1 content-center">
                                      {Array.from({ length: 14 }).map((_, i) => (
                                        <div
                                          key={i}
                                          className={`border border-border/30 h-4 flex items-center justify-center text-[7px] ${
                                            i === 4 || i === 9
                                              ? "bg-accent text-accent-foreground font-bold"
                                              : "bg-transparent"
                                          }`}
                                        >
                                          {i + 1}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex justify-between text-[8px] text-muted-foreground">
                                      <span>ROW_LOCKS: PG_LOCK_ACTIVE</span>
                                      <span>TX: STABLE</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="font-mono text-[10px] space-y-2 flex-1 flex flex-col justify-between">
                                    <div className="text-accent flex justify-between">
                                      <span>$ {project.title.toLowerCase().replace(/\s+/g, "-")} --solve-segments</span>
                                      <span className="text-muted-foreground">
                                        [COMPILING]
                                      </span>
                                    </div>
                                    <div className="text-foreground/45 border-y border-border/20 py-1 flex-1 flex flex-col gap-1 justify-center">
                                      <div>SOLVER: RUST_WASM_ENGINE</div>
                                      <div>CACHE_HIT_RATE: 92%</div>
                                    </div>
                                    <div className="flex justify-between items-center text-[8px] text-muted-foreground">
                                      <span>GEO: POSTGIS</span>
                                      <span>SYS_GATEWAY: ACTIVE</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
