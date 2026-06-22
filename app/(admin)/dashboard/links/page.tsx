import { ShieldAlert, Terminal } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getBioProfileAction } from "@/app/actions/bio.action";
import { LinksManager } from "@/components/dashboard/links-manager";
import { auth } from "@/lib/auth";

export default async function BioLinksCrudPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/dashboard/auth");

  const bioRes = await getBioProfileAction();
  if (!bioRes.success || !bioRes.data) {
    return (
      <div className="border-2 border-red-500 bg-red-500/5 p-6 text-red-500 font-mono text-xs max-w-xl mx-auto space-y-3">
        <div className="flex gap-2 items-center font-bold">
          <ShieldAlert />
          <span>BIOPROFILE_INGEST_FAILURE</span>
        </div>
        <div>
          Cannot ingest profile metrics from database schema. Error:{" "}
          {bioRes.error || "Unknown server error"}
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
            {"// BIOPROFILE_ROUTER_V2.0"}
          </span>
          <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase tracking-tighter leading-none text-foreground">
            MANAGE_BIO_PROFILE
          </h1>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground bg-secondary/5 border border-border/20 px-3 py-1.5">
          <Terminal size={10} className="text-accent" />
          <span>MODE: IDENTITY_VARIABLES</span>
        </div>
      </div>

      {/* Links Manager Panel */}
      <LinksManager profile={bioRes.data} />
    </div>
  );
}
