"use client";

import { motion } from "motion/react";
import { usePreloader } from "@/components/PreloaderContext";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";

const row1 = [
  "REACT",
  "TYPESCRIPT",
  "POSTGRESQL",
  "MONGODB",
  "NODE.JS",
  "EXPRESS",
  "DOCKER",
  "GRAPHQL",
];

const row2 = [
  "NEXT.JS 15",
  "PRISMA ORM",
  "TAILWIND CSS",
  "FRAMER MOTION",
  "SHADCN UI",
  "TURBOPACK",
  "VERCEL",
  "ZUSTAND",
];

export default function Skills() {
  const { isCompleted } = usePreloader();

  return (
    <motion.section
      initial={{ opacity: 0, y: 45 }}
      whileInView={isCompleted ? { opacity: 1, y: 0 } : { opacity: 0, y: 45 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="w-full bg-transparent backdrop-blur-[3px] shadow-2xl shadow-foreground  py-8 border-y border-accent/40 relative z-20 flex flex-col gap-6 select-none"
    >
      <ScrollVelocityContainer className="flex flex-col gap-2 md:gap-5">
        {/* Row 1: Left-to-Right Scrolling, Pauses on Hover */}
        <ScrollVelocityRow baseVelocity={3} direction={1} pauseOnHover>
          <div className="flex gap-6 sm:gap-8 pr-6 sm:pr-8 items-center py-2">
            {row1.map((skill) => (
              <span
                key={skill}
                className="inline-block text-foreground px-6 py-2.5 sm:px-8 sm:py-3.5 text-3xl sm:text-5xl md:text-7xl uppercase font-sans font-black tracking-tighter hover:bg-accent bg-clip-text  hover:text-transparent hover:border-accent transition-all duration-200 cursor-crosshair"
              >
                {skill}
              </span>
            ))}
          </div>
        </ScrollVelocityRow>

        {/* Row 2: Right-to-Left Scrolling, Pauses on Hover */}
        <ScrollVelocityRow baseVelocity={3} direction={-1} pauseOnHover>
          <div className="flex gap-6 sm:gap-8 pr-6 sm:pr-8 items-center py-2">
            {row2.map((skill) => (
              <span
                key={skill}
                className="inline-block text-foreground px-6 py-2.5 sm:px-8 sm:py-3.5 text-3xl sm:text-5xl md:text-7xl uppercase font-sans font-black tracking-tighter hover:bg-accent bg-clip-text  hover:text-transparent hover:border-accent transition-all duration-200 cursor-crosshair"
              >
                {skill}
              </span>
            ))}
          </div>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </motion.section>
  );
}
