"use client";

import { motion } from "motion/react";

interface TextRevealProps {
  text: string;
  className?: string;
  outline?: boolean;
}

const wordVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 15, stiffness: 120 },
  },
} as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function TextReveal({
  text,
  className,
  outline = false,
}: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-80px" }}
      variants={containerVariants}
      className={`inline-flex flex-wrap gap-x-[0.25em] overflow-hidden py-1 ${className}`}
    >
      {words.map((word, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static words order is constant
        <span key={idx} className="inline-block overflow-hidden py-0.5">
          <motion.span
            variants={wordVariants}
            style={
              outline
                ? {
                    WebkitTextStroke:
                      "1.5px var(--color-foreground, currentColor)",
                    color: "transparent",
                  }
                : undefined
            }
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
