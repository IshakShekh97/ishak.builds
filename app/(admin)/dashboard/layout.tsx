import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import TerminalBackground from "@/components/TerminalBackground";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ishak.Builds | Dashboard",
  description: "Meet Ishak, the developer and designer who builds cool stuff.",
};

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background terminal blueprint grids */}
      <TerminalBackground />

      {/* Interactive admin shell container */}
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
};

export default DashboardLayout;
