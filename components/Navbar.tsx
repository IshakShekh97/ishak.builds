"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePreloader } from "./PreloaderContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { PixelButton } from "./ui/PixelButton";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isCompleted } = usePreloader();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed transition-all duration-500 ease-in-out z-40 flex justify-between items-center border-accent",
        !isCompleted
          ? "opacity-0 -translate-y-4 pointer-events-none"
          : "opacity-100 translate-y-0 pointer-events-auto",
        isScrolled
          ? "top-0 left-0 right-0 p-3 sm:p-4 bg-background/90 border-b-2 backdrop-blur-md shadow-md"
          : "top-4 left-4 right-4 p-4 sm:p-6 bg-transparent border-2 backdrop-blur-sm",
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href={"/"}
          className="font-sans text-[10px] sm:text-xs uppercase  px-2 py-1 bg-accent text-accent-foreground font-bold tracking-widest"
        >
          [ISHAK.BUILDS]
        </Link>
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground hidden sm:inline">
          [VER_2026.06]
        </span>
      </div>

      <span className="font-mono uppercase text-[10px] sm:text-xs hidden md:inline-block">
        [<span className="text-accent font-extrabold!">SYSTEM STATUS</span>:
        ACTIVE]
      </span>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeSwitcher />
        <PixelButton href="/connect">[CONNECT]</PixelButton>
      </div>
    </header>
  );
};

export default Navbar;
