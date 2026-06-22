import { Layers, ShieldAlert, Smartphone, Sparkles } from "lucide-react";
import { Suspense } from "react";
import { getBioProfileAction } from "@/app/actions/bio.action";
import { BioLinksClient } from "@/components/BioLinksClient";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 0; // Ensure Server Side Rendering (SSR)

async function BioLinksContent() {
  const res = await getBioProfileAction();

  if (!res.success || !res.data) {
    return (
      <div className="border-2 border-red-500 bg-red-500/5 p-6 text-red-500 font-mono text-xs max-w-md w-full mx-auto space-y-3">
        <div className="flex gap-2 items-center font-bold">
          <ShieldAlert className="animate-bounce" />
          <span>ROUTER_DISPATCH_FAILURE</span>
        </div>
        <div>
          Cannot ingest profile parameters from database host. Error:{" "}
          {res.error || "Unknown server database error"}
        </div>
      </div>
    );
  }

  return <BioLinksClient profile={res.data} />;
}

function BioLinksSkeleton() {
  return (
    <div className="w-full max-w-md flex flex-col gap-8 items-stretch relative">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col items-center text-center gap-3 border border-border/20 bg-background/50 backdrop-blur-[6px] p-6 shadow-[4px_4px_0px_var(--color-accent)] rounded-none relative">
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-accent" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-accent" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-accent" />

        <Skeleton className="w-14 h-14 rounded-full" />

        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-24" />
        </div>

        <div className="space-y-1.5 w-full flex flex-col items-center mt-2">
          <Skeleton className="h-2.5 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>

      {/* Links Stack Skeleton */}
      <div className="flex flex-col gap-4 w-full">
        {["sk-1", "sk-2", "sk-3", "sk-4"].map((skKey) => {
          return (
            <div
              key={skKey}
              className="border border-border/20 bg-background/50 backdrop-blur-[6px] p-5 flex flex-col gap-2 rounded-none"
            >
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-2.5 w-3/4" />
            </div>
          );
        })}
      </div>

      {/* Footer Diagnostics HUD Skeleton */}
      <div className="border-t border-dashed border-border/30 pt-6 text-[9px] font-mono text-muted-foreground flex justify-between items-center w-full">
        <span className="flex items-center gap-1">
          <Smartphone size={10} /> MOBILE_PORTAL
        </span>
        <span className="flex items-center gap-1">
          <Layers size={10} /> SPEED_LATENCY: 8ms
        </span>
        <span className="flex items-center gap-1 text-accent font-bold">
          <Sparkles size={10} /> SSL_ACTIVE
        </span>
      </div>
    </div>
  );
}

export default function LinkBioRouter() {
  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center py-24 px-4 sm:px-6 relative select-none overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-transparent -z-20">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "24px 24px, 48px 48px, 48px 48px",
          }}
        />
      </div>

      {/* Suspense Wrapper */}
      <Suspense fallback={<BioLinksSkeleton />}>
        <BioLinksContent />
      </Suspense>
    </main>
  );
}
