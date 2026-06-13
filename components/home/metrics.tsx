"use client";

import { motion } from "motion/react";
import { usePreloader } from "@/components/PreloaderContext";

const metricsList = [
  {
    value: "100%",
    label: "LIGHTHOUSE PERFORMANCE SCORE",
    detail: "AUDITED ON PRODUCTION BUILD COMPILATION",
  },
  {
    value: "PASSED",
    label: "CORE WEB VITALS AUDIT",
    detail: "STRICT CUMULATIVE LAYOUT SHIFT & LCP VERIFIED",
  },
  {
    value: "< 2.4s",
    label: "PRODUCTION BUILD EXECUTION TIME",
    detail: "COMPILED WITH NEXT.JS TURBOPACK ENGINE",
  },
];

// Stagger variants for cells
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] as const },
  },
};

export default function Metrics() {
  const { isCompleted } = usePreloader();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={isCompleted ? { opacity: 1 } : { opacity: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      className="w-full border-b border-border/30 relative z-20 select-none bg-background"
    >
      {/* 3-Column Grid Matrix with fine 1px borders */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/30"
      >
        {metricsList.map((metric, index) => (
          <motion.div
            key={metric.label}
            variants={itemVariants}
            className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[260px] sm:min-h-[300px] hover:bg-accent/5 transition-colors duration-300 relative group overflow-hidden"
          >
            {/* Blueprint Grid Lines Ticks (Decorative Corner Details) */}
            <div className="absolute top-2 left-2 font-mono text-[7px] text-muted-foreground/30 uppercase">
              {`[METRIC_CELL_0${index + 1}]`}
            </div>

            {/* Massive Loud Monospace Metric Number */}
            <div className="flex-1 flex items-center mt-4 sm:mt-6">
              <span className="font-mono text-6xl sm:text-7xl lg:text-[7vw] font-extrabold tracking-tighter text-accent leading-none select-all uppercase">
                {metric.value}
              </span>
            </div>

            {/* Description Muted Token */}
            <div className="space-y-1.5 mt-8 border-t border-dashed border-border/30 pt-4">
              <span className="font-mono text-[10px] sm:text-xs uppercase font-black tracking-widest text-foreground block">
                {metric.label}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
                {metric.detail}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
