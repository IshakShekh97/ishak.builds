"use client";

import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProjectAction } from "@/app/actions/project.action";
import { PixelButton } from "@/components/ui/PixelButton";
import type { Project, Tech } from "@/lib/generated/prisma/client";

interface ProjectListProps {
  initialProjects: (Project & { techs: Tech[] })[];
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`ARE YOU SURE YOU WANT TO TERMINATE RECORD FOR [${title.toUpperCase()}]?`)) {
      return;
    }

    setIsDeleting(id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await deleteProjectAction(id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setSuccessMessage(`PROJECT [${title.toUpperCase()}] PURGED FROM REGISTRY.`);
        router.refresh();
      } else {
        setErrorMessage(res.error || "Database rejection of delete mutation.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsDeleting(null);
    }
  };

  // Alternating non-uniform column spans for matrix grid
  const getColSpan = (index: number) => {
    const layout = [
      "lg:col-span-7 md:col-span-6 col-span-1",
      "lg:col-span-5 md:col-span-6 col-span-1",
      "lg:col-span-4 md:col-span-5 col-span-1",
      "lg:col-span-8 md:col-span-7 col-span-1",
      "lg:col-span-6 md:col-span-6 col-span-1",
      "lg:col-span-6 md:col-span-6 col-span-1",
    ];
    return layout[index % layout.length];
  };

  return (
    <div className="space-y-8">
      {/* Alert Feeds */}
      {errorMessage && (
        <div className="border border-red-500 bg-red-500/5 p-4 flex gap-3 items-start text-red-500 font-mono text-xs">
          <AlertTriangle className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase block">COMPILER_MUTATION_FAILURE:</span>
            {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="border border-emerald-500 bg-emerald-500/5 p-4 flex gap-3 items-start text-emerald-500 font-mono text-xs animate-pulse">
          <CheckCircle className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase block">PURGE_SUCCESSFUL:</span>
            {successMessage}
          </div>
        </div>
      )}

      {/* Header Banner Actions */}
      <div className="border-2 border-foreground bg-secondary/5 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[9px] text-muted-foreground uppercase block font-bold">
            REGISTRY_INDEX_READ
          </span>
          <span className="font-mono text-xs text-foreground font-black">
            RESOLVED_RECORDS: {projects.length.toString().padStart(2, "0")}
          </span>
        </div>
        <Link href="/dashboard/projects/create">
          <PixelButton className="border-accent text-accent hover:bg-accent/5 font-black uppercase text-xs shadow-[4px_4px_0px_var(--color-primary)] active:translate-x-[2px] active:translate-y-[2px]">
            <Plus size={14} className="mr-1 inline-block" /> [ COMPILE_NEW_RECORD ]
          </PixelButton>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="border-2 border-dashed border-foreground/30 p-12 text-center text-muted-foreground font-mono text-xs uppercase">
          [ NO_PROJECT_RECORDS_COMPILED_IN_DATABASE ]
        </div>
      ) : (
        /* Alternating matrix Grid */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {projects.map((project, idx) => {
            const spanClass = getColSpan(idx);
            return (
              <div
                key={project.id}
                className={`${spanClass} border-2 border-foreground bg-background p-6 flex flex-col justify-between relative transition-all duration-200 hover:-translate-x-1.5 hover:-translate-y-1.5 hover:shadow-[6px_6px_0px_var(--color-accent)] group select-none`}
              >
                {/* Corner Decorators */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-foreground/30" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-foreground/30" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-foreground/30" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-foreground/30" />

                {/* Card Header info */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between items-start font-mono text-[9px] text-muted-foreground uppercase font-bold">
                    <span>{project.num} {project.category}</span>
                    <span className="text-foreground bg-secondary/20 border border-border/10 px-1.5 font-black">{project.year}</span>
                  </div>
                  <h3 className="font-sans font-black text-2xl uppercase tracking-tighter text-foreground leading-none group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <div className="font-mono text-[9px] text-muted-foreground/80 truncate">
                    SLUG: {project.slug}
                  </div>
                </div>

                {/* Description snippet */}
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed mb-6 border-l-2 border-border/20 pl-3 line-clamp-3">
                  {project.desc || project.description}
                </p>

                {/* Tech Badges & Outbound Links */}
                <div className="space-y-4 pt-4 border-t border-border/10">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techs.map((tech) => (
                      <span
                        key={tech.id}
                        className="font-mono text-[8px] font-bold border border-foreground/10 bg-secondary/15 px-1.5 py-0.5 text-foreground uppercase"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>

                  {/* Outbound Links */}
                  <div className="flex gap-4 font-mono text-[9px] font-bold uppercase text-accent">
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
                </div>

                {/* Operational Actions */}
                <div className="mt-8 pt-4 border-t-2 border-foreground flex justify-between items-center bg-secondary/5 -mx-6 -mb-6 p-4">
                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="font-mono text-[10px] uppercase font-bold text-foreground hover:text-accent flex items-center gap-1 transition-colors"
                  >
                    <Edit2 size={12} /> Edit record
                  </Link>

                  <button
                    type="button"
                    disabled={isDeleting === project.id}
                    onClick={() => handleDelete(project.id, project.title)}
                    className="font-mono text-[10px] uppercase font-bold text-destructive hover:underline flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    {isDeleting === project.id ? "PURGING..." : "Purge record"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
