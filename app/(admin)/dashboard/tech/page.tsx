import { ShieldAlert, Terminal } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTechsAction } from "@/app/actions/tech.action";
import { TechManager } from "@/components/dashboard/tech-manager";
import { auth } from "@/lib/auth";

export default async function TechCrudPage() {
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
          <span>DATABASE_TELEMETRY_FAILURE</span>
        </div>
        <div>
          Cannot ingest tech stack nodes from system schema. Error:{" "}
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
            {"// COMPILER_ENV_NODES"}
          </span>
          <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase tracking-tighter leading-none text-foreground">
            MANAGE_TECH_NODES
          </h1>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground bg-secondary/5 border border-border/20 px-3 py-1.5">
          <Terminal size={10} className="text-accent" />
          <span>MODE: SCHEMA_DECLARATIONS</span>
        </div>
      </div>

      {/* Tech Manager Console */}
      <TechManager techs={techsRes.data} />
    </div>
  );
}
