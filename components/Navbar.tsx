import React from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  return (
    <header className="fixed border top-1 left-1 right-1 border-accent p-6 flex justify-between items-center  bg-transparent backdrop-blur-sm z-40">
      <div className="flex items-center gap-3">
        <span className="font-sans text-xs uppercase px-2 py-1 bg-orange-500 dark:bg-orange-700 text-orange-50 font-bold tracking-widest">
          [ISHAK.BUILDS]
        </span>
        <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
          [VER_2026.06]
        </span>
      </div>

      <span className="font-mono uppercase text-xs">
        [<span className="text-accent font-extrabold!">SYSTEM STATUS</span>:
        ACTIVE]
      </span>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <a
          href="#connect"
          // className="font-mono text-xs uppercase border-2 border-accent px-4 py-2 hover:bg-foreground hover:text-background transition-all duration-300 active:translate-y-[2px]"
          className="flex items-center gap-2 border-2 border-foreground bg-foreground text-background font-mono text-xs uppercase px-6 py-3 font-bold hover:bg-transparent hover:text-foreground transition-all duration-300 shadow-[4px_4px_0px_var(--color-accent)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--color-accent)]"
        >
          CONNECT
        </a>
      </div>
    </header>
  );
};

export default Navbar;
