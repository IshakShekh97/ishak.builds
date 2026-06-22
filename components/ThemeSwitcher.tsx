"use client";

import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className={className}>
      <AnimatedThemeToggler
        variant="square"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onThemeChange={setTheme}
        className="bg-secondary p-2 border-accent border hover:bg-accent transition-all"
      />
    </div>
  );
}
