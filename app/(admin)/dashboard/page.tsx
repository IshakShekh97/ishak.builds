import { Layers, RefreshCw, Terminal } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  BioPreviewCard,
  BioPreviewSkeleton,
  BookingsList,
  BookingsSkeleton,
  StatsOverview,
  StatsSkeleton,
} from "@/components/dashboard/dashboard-overview";
import { auth } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/dashboard/auth");

  return (
    <div className="w-full space-y-10 py-2">
      {/* Dashboard Section Header */}
      <div className="border-l-4 border-accent pl-4 py-1.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold block mb-1 animate-pulse">
            {"// CORE_OPERATING_SYSTEM_ACTIVE"}
          </span>
          <h1 className="font-sans font-black text-2xl sm:text-4xl uppercase tracking-tighter leading-none text-foreground">
            ADMIN_CONTROL_SHELL
          </h1>
        </div>

        {/* Diagnostic Metadata Badge */}
        <div className="flex gap-4 font-mono text-[9px] text-muted-foreground bg-secondary/5 border border-border/20 px-3 py-1.5 w-fit">
          <div className="flex items-center gap-1">
            <RefreshCw size={10} className="animate-spin text-accent" />
            <span>CORE: ONLINE</span>
          </div>
          <div>PLATFORM: NEXT_RSC</div>
          <div>SESSION: SECURE</div>
        </div>
      </div>

      {/* 1. Statistics Cards (Suspended) */}
      <section className="space-y-4">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground uppercase font-bold">
          <Layers size={12} className="text-accent" />
          <span>STATISTICAL_TELEMETRY_DATAFEEDS</span>
        </div>
        <Suspense fallback={<StatsSkeleton />}>
          <StatsOverview />
        </Suspense>
      </section>

      {/* 2. Double Column Layout: Bookings and BioProfile Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
        {/* Left Column: Booking Transactions */}
        <section className="xl:col-span-8 space-y-4 w-full">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground uppercase font-bold">
            <Terminal size={12} className="text-accent" />
            <span>TRANSMITTED_CLIENT_BOOKING_LOGS</span>
          </div>
          <Suspense fallback={<BookingsSkeleton />}>
            <BookingsList />
          </Suspense>
        </section>

        {/* Right Column: BioProfile Link Preview */}
        <section className="xl:col-span-4 space-y-4 w-full">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground uppercase font-bold">
            <Terminal size={12} className="text-accent" />
            <span>BIO_ROUTER_MODULE_PREVIEW</span>
          </div>
          <Suspense fallback={<BioPreviewSkeleton />}>
            <BioPreviewCard />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
