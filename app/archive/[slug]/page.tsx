"use client";

import {
  ArrowLeft,
  Award,
  Cpu,
  Database,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { use } from "react";
import { usePreloader } from "@/components/PreloaderContext";
import { PixelButton } from "@/components/ui/PixelButton";
import { TextReveal } from "@/components/ui/TextReveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const projectDetails: Record<
  string,
  {
    title: string;
    subtitle: string;
    num: string;
    challenge: string;
    solution: string;
    schemaTitle: string;
    tables: { name: string; columns: string[] }[];
    codeSnippet: string;
    metrics: { label: string; value: string }[];
  }
> = {
  lyntbrutt: {
    title: "LYNTBRUTT",
    subtitle: "SSR_PERFORMANCE_OVERHAUL",
    num: "01 //",
    challenge:
      "Optimizing Server-Side Rendering for the LYNTBRUTT development platform. Standard React hydration bottlenecks introduced a 180ms delay on heavy mobile devices. The project required a strict zero-JS initial client option and sub-50ms static metadata resolver caching.",
    solution:
      "Bypassed traditional layout execution loops. Engineered a custom edge cache metadata pipeline using Redis and Next.js Server Components. Implemented strict inline CSS compilation that fully isolates style tags, yielding a 100/100 Lighthouse performance rating under extreme 3G throttles.",
    schemaTitle: "PostgreSQL / Redis Schema Architecture",
    tables: [
      {
        name: "UserMetaCache",
        columns: [
          "id: uuid (PK)",
          "username: varchar",
          "metadata_url: text",
          "last_synced: timestamp",
          "is_active: boolean",
        ],
      },
      {
        name: "AnalyticsLog",
        columns: [
          "id: bigint (PK)",
          "user_id: uuid (FK)",
          "clicks: integer",
          "referrer: varchar",
          "timestamp: timestamp",
        ],
      },
    ],
    codeSnippet: `// Next.js RSC Server Cache Resolver
export async function getMetadata(username: string) {
  const cacheKey = \`user:\${username}:meta\`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached); // sub-5ms cache hit
  }
  
  const data = await db.user.findUnique({
    where: { username },
    include: { links: true }
  });
  
  // Cache response for 60 seconds with strict TTL
  await redis.setex(cacheKey, 60, JSON.stringify(data));
  return data;
}`,
    metrics: [
      { label: "EDGE RESPONSE LATENCY", value: "< 12ms" },
      { label: "LIGHTHOUSE SCORE", value: "100/100" },
      { label: "ZERO-JS DOM SIZE", value: "4.2KB" },
    ],
  },
  kronos: {
    title: "KRONOS",
    subtitle: "TRANSACTIONAL_SCHEDULER",
    num: "02 //",
    challenge:
      "Eliminating timezone scheduling collisions and double-booking race conditions on high-frequency enterprise calendar booking slots. Multi-user reservation windows triggered database locking issues and stale states.",
    solution:
      "Engineered row-level transactional database locks within Prisma transactions. Structured interval timezone offsets on-the-fly to validate bookings. Built a lazy matrix grid renderer in React for lightweight rendering of massive booking intervals.",
    schemaTitle: "PostgreSQL / Prisma Database Lock Map",
    tables: [
      {
        name: "SlotReservation",
        columns: [
          "id: uuid (PK)",
          "slot_start: timestamp",
          "slot_end: timestamp",
          "locked_at: timestamp",
          "expires_at: timestamp",
        ],
      },
      {
        name: "ReservationDetails",
        columns: [
          "id: bigint (PK)",
          "slot_id: uuid (FK)",
          "client_email: varchar",
          "status: enum",
          "created_at: timestamp",
        ],
      },
    ],
    codeSnippet: `// PostgreSQL Transaction Lock (Prisma)
await db.$transaction(async (tx) => {
  const slot = await tx.$queryRaw\`
    SELECT * FROM "SlotReservation" 
    WHERE "id" = \${slotId} 
    FOR UPDATE
  \`;
  
  if (slot.isBooked || new Date() > slot.expires_at) {
    throw new Error("SLOT_TEMPORARILY_LOCKED");
  }
  
  return tx.reservationDetails.create({
    data: { slot_id: slotId, client_email: email, status: 'CONFIRMED' }
  });
});`,
    metrics: [
      { label: "CONCURRENCY LOCK LIMIT", value: "50K/sec" },
      { label: "COLLISION REDUCTION", value: "100%" },
      { label: "MUTATION LAG TIME", value: "15ms" },
    ],
  },
  hestia: {
    title: "HESTIA",
    subtitle: "INTEGRITY_SHIELD",
    num: "03 //",
    challenge:
      "Securing sensitive client parameters and API payloads without adding network delays. System needed zero-knowledge verification hooks, dynamic key generation, and isolated document storage structures.",
    solution:
      "Developed a custom WebCrypto interface that encrypts values directly in the client runtime before socket transmissions. Combined client-side encryption with MongoDB document storage systems, ensuring zero server-side exposure of raw client secrets.",
    schemaTitle: "Zero-Knowledge WebCrypto Payload Flow",
    tables: [
      {
        name: "EncryptedVault",
        columns: [
          "id: uuid (PK)",
          "client_id: uuid (FK)",
          "vault_payload: text",
          "salt: varchar",
          "iv_vector: varchar",
        ],
      },
      {
        name: "KeyMetadata",
        columns: [
          "id: bigint (PK)",
          "vault_id: uuid (FK)",
          "key_algorithm: varchar",
          "checksum: varchar",
        ],
      },
    ],
    codeSnippet: `// WebCrypto Runtime Cipher Initialization
async function encryptPayload(data: string, secretKey: string) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(secretKey), "PBKDF2", false, ["deriveKey"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, keyMaterial, enc.encode(data)
  );
  return { payload: btoa(String.fromCharCode(...new Uint8Array(encrypted))), iv };
}`,
    metrics: [
      { label: "ENCRYPTION STRENGTH", value: "AES-GCM" },
      { label: "DECRYPT TIME", value: "0.4ms" },
      { label: "ZERO-KNOWLEDGE RISK", value: "0.0%" },
    ],
  },
  apollo: {
    title: "APOLLO",
    subtitle: "LOGISTICS_COMPILER",
    num: "04 //",
    challenge:
      "Calculating geo-temporal multi-stop routes under tight network constraints. Traditional routing libraries introduced API latencies exceeding 2 seconds per request, causing client UI delays.",
    solution:
      "Re-engineered route solver algorithm using NestJS and Rust WASM bindings. Cached calculated route segments inside a memory-optimized Redis store, decreasing solving delay times by 95%.",
    schemaTitle: "Geo-Spatial Multi-Stop Route Matrix",
    tables: [
      {
        name: "RouteMatrix",
        columns: [
          "id: uuid (PK)",
          "start_point: geography",
          "end_point: geography",
          "duration_sec: integer",
          "distance_meters: integer",
        ],
      },
      {
        name: "CachedSegments",
        columns: [
          "hash: varchar (PK)",
          "segment_data: jsonb",
          "ttl_expire: timestamp",
        ],
      },
    ],
    codeSnippet: `// Rust-WASM Route Resolver Bridge
#[wasm_bindgen]
pub fn solve_matrix(points: &JsValue) -> Result<JsValue, JsValue> {
    let coords: Vec<Coord> = points.into_serde().unwrap();
    let mut solver = RouteSolver::new(coords);
    let solution = solver.compute_optimal_path();
    Ok(JsValue::from_serde(&solution).unwrap())
}`,
    metrics: [
      { label: "SOLVER COMPUTING TIME", value: "18ms" },
      { label: "CACHE SAVINGS RATE", value: "92%" },
      { label: "API ROUND-TRIP TIME", value: "45ms" },
    ],
  },
};

export default function ArchiveSlug({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { isCompleted } = usePreloader();

  // Fallback to lyntbrutt if slug is invalid
  const project = projectDetails[slug] || projectDetails.lyntbrutt;

  return (
    <main className="min-h-screen w-full pt-28 sm:pt-36 pb-20 px-4 sm:px-8 md:px-16 lg:px-24 select-none relative overflow-hidden">
      {/* Background decoration grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-[0.03] border-x border-foreground">
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
      </div>

      {/* Return Navigation button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={
          isCompleted ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
        }
        viewport={{ once: false, margin: "-80px" }}
        className="mb-8 relative z-10"
      >
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 font-mono text-xs text-foreground hover:text-accent font-bold uppercase transition-colors"
        >
          <ArrowLeft size={14} /> [ BACK TO ARCHIVE ]
        </Link>
      </motion.div>

      {/* Giant Editorial Header */}
      <div className="border-b border-border/30 pb-12 mb-16 relative z-10 w-full overflow-hidden">
        <div className="font-sans font-black text-4xl sm:text-7xl md:text-[8vw] uppercase tracking-tighter leading-[0.85] flex flex-col gap-2">
          <TextReveal text={project.title} />
          <TextReveal text={project.subtitle} outline />
        </div>
      </div>

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

        {/* Right Column: Database Schematic (Glassmorphic Schema Panel) */}
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
        className="w-full  border border-border/20 bg-transparent backdrop-blur-[6px] p-8 sm:p-12 shadow-[8px_8px_0px_var(--color-accent)] rounded-none flex flex-col items-center justify-center text-center gap-6 relative z-10"
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
