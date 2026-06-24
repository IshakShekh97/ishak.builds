import {
  ArrowUpRight,
  CalendarDays,
  Cpu,
  ExternalLink,
  FolderGit2,
  Link2,
  PlusCircle,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { getBioProfileAction } from "@/app/actions/bio.action";
import {
  getBookingsAction,
  getDashboardStatsAction,
} from "@/app/actions/dashboard.action";
import { PixelButton } from "@/components/ui/PixelButton";
import { Skeleton } from "@/components/ui/skeleton";

// ==========================================
// 1. STATS OVERVIEW SECTION
// ==========================================
export async function StatsOverview() {
  const res = await getDashboardStatsAction();
  if (!res.success || !res.data) {
    return (
      <div className="border border-red-500 bg-red-500/5 p-4 text-red-500 text-xs font-mono">
        <ShieldAlert size={16} className="inline mr-2 animate-bounce" />
        ERR_TELEMETRY_INGESTION_FAILED:{" "}
        {res.error || "Unknown server database error"}
      </div>
    );
  }

  const { projects, bookings, tech, links } = res.data;

  const cards = [
    {
      title: "Active Projects",
      value: projects,
      icon: FolderGit2,
      desc: "TOTAL_MOCKUP_ARCHIVES",
      color: "text-accent border-accent/20",
      href: "/dashboard/projects",
    },
    {
      title: "Received Bookings",
      value: bookings,
      icon: CalendarDays,
      desc: "SMTP_COMM_TRANSMISSIONS",
      color: "text-blue-500 border-blue-500/20",
      href: "/dashboard",
    },
    {
      title: "Tech stack nodes",
      value: tech,
      icon: Cpu,
      desc: "COMPILER_DEFINITIONS",
      color: "text-emerald-500 border-emerald-500/20",
      href: "/dashboard/tech",
    },
    {
      title: "BioProfile links",
      value: links,
      icon: Link2,
      desc: "ROUTED_REDIRECTS",
      color: "text-amber-500 border-amber-500/20",
      href: "/dashboard/links",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.title}
            href={card.href}
            className="border-2 border-foreground bg-secondary/5 p-5 flex flex-col justify-between relative shadow-[4px_4px_0px_var(--color-foreground)] select-none overflow-hidden min-h-[140px] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0px_var(--color-accent)] transition-all cursor-pointer group"
          >
            {/* Corner Decorators */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-foreground/30" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-foreground/30" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-foreground/30" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-foreground/30" />

            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block group-hover:text-accent transition-colors">
                  {card.desc}
                </span>
                <h3 className="font-sans font-black text-xs uppercase text-foreground">
                  {card.title}
                </h3>
              </div>
              <div className="p-1.5 border border-foreground/10 bg-background text-muted-foreground group-hover:border-accent transition-colors">
                <Icon size={14} className={card.color.split(" ")[0]} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-border/10 pt-3">
              <span className="font-mono font-black text-3xl tracking-tighter text-foreground tabular-nums">
                {card.value.toString().padStart(2, "0")}
              </span>
              <span className="font-mono text-[9px] font-bold text-accent">
                [ONLINE]
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: list is static and for layout loading states
          key={i}
          className="border-2 border-foreground bg-secondary/5 p-5 flex flex-col justify-between shadow-[4px_4px_0px_var(--color-foreground)] min-h-[140px]"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1.5 w-3/4">
              <Skeleton className="h-2 w-16" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <Skeleton className="size-7" />
          </div>
          <div className="mt-4 flex items-baseline justify-between pt-3">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-2 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 2. BOOKINGS LIST SECTION
// ==========================================
export async function BookingsList() {
  const res = await getBookingsAction();
  if (!res.success || !res.data) {
    return (
      <div className="border border-red-500 bg-red-500/5 p-4 text-red-500 text-xs font-mono">
        <ShieldAlert size={16} className="inline mr-2 animate-bounce" />
        ERR_BOOKINGS_FETCH_FAILED:{" "}
        {res.error || "Unknown server database error"}
      </div>
    );
  }

  const bookings = res.data;

  if (bookings.length === 0) {
    return (
      <div className="border-2 border-foreground p-8 text-center text-muted-foreground uppercase text-xs">
        [ NO_CLIENT_TRANSMISSIONS_RECORDED ]
      </div>
    );
  }

  return (
    <div className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-foreground)] overflow-x-auto w-full select-none">
      <table className="w-full text-left font-mono text-xs whitespace-nowrap min-w-[700px]">
        <thead>
          <tr className="bg-foreground text-background border-b border-foreground uppercase font-black tracking-wider text-[10px]">
            <th className="p-3">Client</th>
            <th className="p-3">Company</th>
            <th className="p-3">Email Address</th>
            <th className="p-3">Budget</th>
            <th className="p-3">Timeline</th>
            <th className="p-3">Specifications</th>
            <th className="p-3 text-right">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/20">
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="hover:bg-secondary/20 transition-colors"
            >
              <td className="p-3 font-bold text-foreground">{booking.name}</td>
              <td className="p-3 text-muted-foreground">
                {booking.company || "[NONE]"}
              </td>
              <td className="p-3 text-accent underline underline-offset-2">
                {booking.email}
              </td>
              <td className="p-3">
                <span className="font-bold">
                  {booking.budget === "custom"
                    ? booking.customBudget
                    : booking.budget}
                </span>
              </td>
              <td className="p-3">
                {booking.timeline === "custom"
                  ? booking.customTimeline
                  : booking.timeline}
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1 max-w-[240px]">
                  {booking.specs.map((spec) => (
                    <span
                      key={spec}
                      className="border border-border/40 text-[9px] bg-secondary/5 px-1 py-0.5 rounded-none uppercase font-bold"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-3 text-right text-muted-foreground text-[10px]">
                {new Date(booking.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BookingsSkeleton() {
  return (
    <div className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-foreground)] overflow-hidden w-full">
      <div className="h-9 bg-foreground w-full" />
      <div className="divide-y divide-foreground/20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: list is static and for layout loading states
            key={i}
            className="p-4 flex justify-between items-center"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. BIOPROFILE LINK PREVIEW
// ==========================================
export async function BioPreviewCard() {
  const res = await getBioProfileAction();
  if (!res.success || !res.data) {
    return (
      <div className="border border-red-500 bg-red-500/5 p-4 text-red-500 text-xs font-mono">
        <ShieldAlert size={16} className="inline mr-2 animate-bounce" />
        ERR_PROFILE_PREVIEW_LOAD_FAILURE
      </div>
    );
  }

  const profile = res.data;

  return (
    <div className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-accent)] p-6 relative w-full flex flex-col justify-between min-h-[380px] select-none">
      {/* Corner Decorators */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent" />

      {/* Header Info */}
      <div className="w-full flex justify-between items-center border-b border-border/30 pb-3">
        <span className="font-mono text-[9px] tracking-wider uppercase font-bold text-accent">
          [ BIOPROFILE_ROUTER_PREVIEW ]
        </span>
        <div className="flex items-center gap-1.5 font-mono text-[8px] text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{profile.beaconText || "SYS_ACTIVE"}</span>
        </div>
      </div>

      {/* Core Profile Preview Details */}
      <div className="flex-1 flex flex-col items-center justify-center my-6 gap-3 text-center">
        {profile.avatarUrl ? (
          <div className="w-16 h-16 rounded-full border-2 border-foreground overflow-hidden bg-secondary/15 flex items-center justify-center">
            {/* biome-ignore lint/performance/noImgElement: standard img element needed for Cloudinary dynamic preview */}
            <img
              src={profile.avatarUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full border-2 border-foreground bg-secondary/30 flex items-center justify-center font-bold text-lg text-foreground">
            {profile.initials || "IS"}
          </div>
        )}

        <div className="space-y-1">
          <span className="font-sans font-black text-lg tracking-tight uppercase block">
            {profile.name}
          </span>
          <p className="font-mono text-[10px] text-muted-foreground max-w-xs mx-auto leading-relaxed normal-case">
            {profile.bio ||
              "No profile bio description defined. Customize parameters via the control system link."}
          </p>
        </div>

        {/* Mini links preview */}
        <div className="w-full max-w-sm mt-3 space-y-1.5">
          {profile.links.slice(0, 3).map((link) => (
            <div
              key={link.id}
              className="border border-border/40 bg-secondary/5 px-3 py-1.5 flex justify-between items-center text-[10px] text-muted-foreground uppercase font-bold"
            >
              <span>{link.label}</span>
              <ExternalLink size={10} className="text-accent" />
            </div>
          ))}
          {profile.links.length > 3 && (
            <div className="text-[9px] text-muted-foreground uppercase font-bold text-center">
              + {profile.links.length - 3} more link records in routing registry
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-border/20 pt-4 flex justify-between items-center">
        <Link
          href="/link"
          target="_blank"
          className="font-mono text-[9px] text-muted-foreground hover:text-accent flex items-center gap-1 uppercase font-bold"
        >
          View page <ArrowUpRight size={10} />
        </Link>

        <Link href="/dashboard/links">
          <PixelButton className="border-accent text-accent py-1.5 px-3 text-[10px] flex items-center gap-1">
            Edit parameters <PlusCircle size={10} />
          </PixelButton>
        </Link>
      </div>
    </div>
  );
}

export function BioPreviewSkeleton() {
  return (
    <div className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-accent)] p-6 relative w-full flex flex-col justify-between min-h-[380px]">
      <div className="flex justify-between items-center pb-3">
        <Skeleton className="h-2 w-28" />
        <Skeleton className="h-2 w-12" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center my-6 gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="w-full max-w-sm space-y-2 mt-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>

      <div className="border-t border-border/20 pt-4 flex justify-between items-center">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-28" />
      </div>
    </div>
  );
}
