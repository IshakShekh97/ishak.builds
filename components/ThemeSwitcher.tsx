"use client";

import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="">
      <AnimatedThemeToggler
        variant="square"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onThemeChange={setTheme}
      />
    </div>
  );
}
