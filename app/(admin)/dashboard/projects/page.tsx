import { ShieldAlert, Terminal } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProjectsAction } from "@/app/actions/project.action";
import { auth } from "@/lib/auth";
import { ProjectList } from "./project-list";

export default async function ProjectsCrudPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/dashboard/auth");

  const projectsRes = await getProjectsAction();

  if (!projectsRes.success || !projectsRes.data) {
    return (
      <div className="border-2 border-red-500 bg-red-500/5 p-6 text-red-500 font-mono text-xs max-w-xl mx-auto space-y-3">
        <div className="flex gap-2 items-center font-bold">
          <ShieldAlert />
          <span>PROJECT_TELEMETRY_FAILURE</span>
        </div>
        <div>
          Cannot ingest project records from database. Error:{" "}
          {projectsRes.error || "Unknown server error"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 py-2">
      {/* Title Header Banner */}
      <div className="border-l-4 border-accent pl-4 py-1.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold block mb-1">
            {"// ARCHIVE_REGISTRY_COMPILER"}
          </span>
          <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase tracking-tighter leading-none text-foreground">
            MANAGE_PROJECTS
          </h1>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground bg-secondary/5 border border-border/20 px-3 py-1.5">
          <Terminal size={10} className="text-accent" />
          <span>MODE: PROJECT_COMPILING</span>
        </div>
      </div>

      {/* Project Matrix List */}
      <ProjectList initialProjects={projectsRes.data} />
    </div>
  );
}
