import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import TerminalBackground from "@/components/TerminalBackground";

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
