"use client";

import {
  Clock,
  Cpu,
  FolderGit2,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Terminal,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  // Live Telemetry Clock (from design.md)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const padMs = (n: number) => n.toString().padStart(3, "0");
      const hh = pad(now.getHours());
      const mm = pad(now.getMinutes());
      const ss = pad(now.getSeconds());
      const ms = padMs(now.getMilliseconds()).slice(0, 2);
      setTimeStr(`${hh}:${mm}:${ss}::${ms}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 100);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/dashboard/auth");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    {
      label: "[ OVERVIEW // ]",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "[ PROJECT_CRUD // ]",
      href: "/dashboard/projects/create",
      icon: FolderGit2,
    },
    {
      label: "[ TECH_STACK_CRUD // ]",
      href: "/dashboard/tech",
      icon: Cpu,
    },
    {
      label: "[ BIOLINK_CRUD // ]",
      href: "/dashboard/links",
      icon: Link2,
    },
  ];

  // If path is auth, do not show the navigation chrome
  const isAuthPage = pathname === "/dashboard/auth";

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col font-mono text-foreground relative selection:bg-accent selection:text-accent-foreground">
      {/* "Top Header Banner" */}
      <header className="border-b-2 border-foreground w-full p-4 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden border border-foreground p-1 hover:bg-accent hover:text-accent-foreground transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:opacity-85"
          >
            <Terminal className="text-accent animate-pulse" size={16} />
            <span className="font-sans font-black text-sm uppercase tracking-tighter">
              [ISHAK.BUILDS.CORE_V2.0]
            </span>
          </Link>
        </div>

        {/* "Telemetry HUD Panel (Desktop)" */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] text-muted-foreground border-l border-r border-border/20 px-6 py-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYS_CONNECTED_SECURE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={10} />
            <span className="font-bold tabular-nums text-foreground">
              {timeStr}
            </span>
          </div>
        </div>

        {/* "Header Actions" */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[10px] uppercase font-bold border border-destructive bg-destructive/5 text-destructive hover:bg-destructive hover:text-white px-3 py-1.5 transition-all cursor-crosshair"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">TERMINATE_SESSION</span>
          </button>
        </div>
      </header>

      {/* "Main Dashboard Layout Area" */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* "Sidebar Nav (Desktop)" */}
        <aside className="hidden md:flex flex-col w-64 border-r-2 border-foreground bg-secondary/5 shrink-0 select-none">
          <div className="p-4 border-b border-border/20">
            <span className="text-[10px] uppercase text-muted-foreground block font-bold">
              {"SYS // CONTROL_CONSOLE"}
            </span>
          </div>
          <nav className="flex-1 p-4 flex flex-col gap-2.5">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 border border-border/30 px-3.5 py-2.5 text-xs font-bold uppercase transition-all hover:border-accent hover:bg-accent/5",
                    active &&
                      "border-accent bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon
                    size={14}
                    className={cn(
                      "shrink-0",
                      active ? "text-accent-foreground" : "text-accent",
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border/20 text-[9px] text-muted-foreground uppercase leading-relaxed">
            <div>HOST: VERCEL_EDGE</div>
            <div>VER: 2026.06</div>
          </div>
        </aside>

        {/* Mobile Dropdown Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[57px] bg-background border-b-2 border-foreground z-40 p-4 flex flex-col gap-2 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 border border-border/30 px-4 py-3 text-xs font-bold uppercase transition-all hover:bg-accent/5",
                    active && "border-accent bg-accent text-accent-foreground",
                  )}
                >
                  <Icon size={14} className="shrink-0 text-accent" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Content Box */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 w-full overflow-x-hidden min-h-screen md:min-h-0 bg-background relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
