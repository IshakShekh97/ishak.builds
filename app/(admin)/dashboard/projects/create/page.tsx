import { ShieldAlert, Terminal } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTechsAction } from "@/app/actions/tech.action";
import { ProjectForm } from "@/components/dashboard/project-form";
import { auth } from "@/lib/auth";

export default async function CreateProjectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/dashboard/auth");

  const techsRes = await getTechsAction();
  if (!techsRes.success || !techsRes.data) {
    return (
      <div className="border-2 border-red-500 bg-red-500/5 p-6 text-red-500 font-mono text-xs max-w-xl mx-auto space-y-3">
        <div className="flex gap-2 items-center font-bold">
          <ShieldAlert />
          <span>FATAL_COMPILER_ERROR</span>
        </div>
        <div>
          Cannot ingest tech stack nodes required for compilation. Error:{" "}
          {techsRes.error || "Unknown server error"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 py-2">
      {/* Title Header */}
      <div className="border-l-4 border-accent pl-4 py-1.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold block mb-1">
            {"// NEW_PROJECT_RECORD"}
          </span>
          <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase tracking-tighter leading-none text-foreground">
            COMPILE_NEW_PROJECT
          </h1>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground bg-secondary/5 border border-border/20 px-3 py-1.5">
          <Terminal size={10} className="text-accent" />
          <span>MODE: RECORD_INGESTION</span>
        </div>
      </div>

      {/* Compiler Form */}
      <div className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-foreground)] p-6 relative">
        {/* Corner Decorators */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent" />

        <ProjectForm availableTechs={techsRes.data} />
      </div>
    </div>
  );
}
