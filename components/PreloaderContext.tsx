"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

interface PreloaderContextProps {
  isCompleted: boolean;
  complete: () => void;
}

const PreloaderContext = createContext<PreloaderContextProps>({
  isCompleted: false,
  complete: () => {},
});

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [isCompleted, setIsCompleted] = useState(false);

  const complete = () => {
    setIsCompleted(true);
  };

  return (
    <PreloaderContext.Provider value={{ isCompleted, complete }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  return useContext(PreloaderContext);
}
