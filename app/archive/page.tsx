"use client";

import { Code, Cpu, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePreloader } from "@/components/PreloaderContext";
import { TextReveal } from "@/components/ui/TextReveal";

const archivedProjects = [
  {
    num: "01 //",
    title: "LYNTBRUTT",
    slug: "lyntbrutt",
    category: "HIGH-PERFORMANCE DATA ROUTER",
    year: "2026",
    tech: ["NEXT.JS 15", "REDIS", "RSC", "TAILWIND"],
    desc: "A sub-50ms link-in-bio ecosystem built to eliminate tracking bloat, featuring dynamic server-side metadata compilers.",
    sol: "Engineered using Next.js Server Components and Redis cache layers. Bypasses client-side rendering bottlenecks to yield a 100/100 Lighthouse rating.",
    mockupType: "terminal",
  },
  {
    num: "02 //",
    title: "KRONOS",
    slug: "kronos",
    category: "CONCURRENT BOOKING ENGINE",
    year: "2026",
    tech: ["REACT", "NODE.JS", "POSTGRESQL", "PRISMA"],
    desc: "An enterprise reservation coordinator designed to resolve high-frequency transactional booking collisions.",
    sol: "Built with Node.js and PostgreSQL. Features custom timezone calculations, row-level database locks, and highly optimized lazy matrix grid renders.",
    mockupType: "matrix",
  },
  {
    num: "03 //",
    title: "HESTIA",
    slug: "hestia",
    category: "CLIENT VAULT INTEGRITY HOOK",
    year: "2025",
    tech: ["NEXT.JS", "WEBCRYPTO", "MONGODB", "ZUSTAND"],
    desc: "A client credentials warehouse executing zero-knowledge proof handshakes and cryptographic client injections.",
    sol: "Integrated WebCrypto runtime API for client-side ciphers and salt generation, saving secure payload files directly to isolated MongoDB collections.",
    mockupType: "vault",
  },
  {
    num: "04 //",
    title: "APOLLO",
    slug: "apollo",
    category: "LOGISTIC ROUTING BLUEPRINT",
    year: "2025",
    tech: ["TYPESCRIPT", "NESTJS", "REDIS", "DOCKER"],
    desc: "A geo-temporal routing compiler calculating optimal multi-stop vehicle intervals under high network constraints.",
    sol: "Developed using NestJS and Rust WASM. Cached calculated route segments inside a memory-optimized Redis store, decreasing latencies by 95%.",
    mockupType: "solver",
  },
];

export default function Archive() {
  const { isCompleted } = usePreloader();
  const years = ["2026", "2025"];

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
            <TextReveal text="PROJECT ARCHIVE" />
          </h1>
        </div>
        <div className="font-mono text-xs text-muted-foreground md:text-right max-w-sm">
          A full historic registry of built digital frameworks, case
          deployments, and full-stack engineering prototypes.
        </div>
      </motion.div>

      {/* Redesigned Project Alternating List by Year */}
      <div className="space-y-36 relative z-10 w-full">
        {years.map((year) => {
          const yearProjects = archivedProjects.filter((p) => p.year === year);
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
                          {project.tech.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[9px] font-bold border border-accent/40 bg-accent/5 px-2 py-0.5 text-accent tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
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
                        {/* Pop Out offset block behind (Cobalt on Light theme, Amber on Dark theme) */}
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
                                {`https://${project.title.toLowerCase()}.builds`}
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
                              {project.mockupType === "terminal" ? (
                                <div className="font-mono text-[10px] space-y-2 flex-1 flex flex-col justify-between">
                                  <div className="text-accent flex justify-between">
                                    <span>
                                      $ {project.title.toLowerCase()} --init
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
                                    <span>[ KRONOS_CONCURRENT_MATRIX ]</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  </div>
                                  <div className="grid grid-cols-7 gap-1 my-2 py-1 border-y border-border/20 flex-1 content-center">
                                    {Array.from({ length: 14 }).map((_, i) => (
                                      <div
                                        /* biome-ignore lint/suspicious/noArrayIndexKey: Calendar cells layout is static */
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
                              ) : project.mockupType === "vault" ? (
                                <div className="font-mono text-[10px] space-y-2 flex-1 flex flex-col justify-between">
                                  <div className="text-accent flex justify-between">
                                    <span>$ hestia --encrypt-vault</span>
                                    <span className="text-emerald-500 font-bold">
                                      [VERIFIED]
                                    </span>
                                  </div>
                                  <div className="text-foreground/45 border-y border-border/20 py-1 flex-1 flex flex-col gap-1 justify-center">
                                    <div>CIPHER: AES-GCM-256</div>
                                    <div>ZKP_VERIFIER_HOOKS: RUNNING</div>
                                    <div>RAW_CLIENT_SECRETS: EXCLUDED</div>
                                  </div>
                                  <div className="flex justify-between items-center text-[8px] text-muted-foreground">
                                    <span>SALT: GENERATED</span>
                                    <span>IV: 12_BYTES</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="font-mono text-[10px] space-y-2 flex-1 flex flex-col justify-between">
                                  <div className="text-accent flex justify-between">
                                    <span>$ apollo --solve-segments</span>
                                    <span className="text-muted-foreground">
                                      [COMPILING]
                                    </span>
                                  </div>
                                  <div className="text-foreground/45 border-y border-border/20 py-1 flex-1 flex flex-col gap-1 justify-center">
                                    <div>SOLVER: RUST_WASM_ENGINE</div>
                                    <div>RESOLVE_TIME: 18ms</div>
                                    <div>CACHE_HIT_RATE: 92%</div>
                                  </div>
                                  <div className="flex justify-between items-center text-[8px] text-muted-foreground">
                                    <span>GEO: POSTGIS</span>
                                    <span>NESTJS_GATEWAY</span>
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
        })}
      </div>
    </main>
  );
}
