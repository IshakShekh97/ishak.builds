import { Suspense } from "react";
import Contact from "@/components/Contact";
import Artifacts from "@/components/home/artifacts";
import Hero from "@/components/home/hero";
import Metrics from "@/components/home/metrics";
import Skills from "@/components/home/skills";

// Blueprint skeleton for Selected Artifacts section on landing page
function ArtifactsSkeleton() {
  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24 border-b border-border/30 relative z-20 flex flex-col gap-16 md:gap-24 animate-pulse select-none">
      {/* Section Header */}
      <div className="border-l-4 md:border-l-12px border-accent/20 pl-6 md:pl-10 py-2">
        <span className="font-mono text-xs uppercase tracking-widest text-accent/30 font-bold block mb-1">
          {"// 02 // ENGINEERING_ARCHIVE"}
        </span>
        <div className="h-10 sm:h-16 w-3/4 bg-secondary/35 rounded-sm" />
      </div>

      {/* alternating broken layout grid skeleton */}
      <div className="flex flex-col gap-20 md:gap-32 w-full">
        {[0, 1].map((i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={i}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center w-full"
            >
              {/* Column A Text skeleton */}
              <div
                className={`lg:col-span-6 flex flex-col gap-4 ${
                  isEven ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="h-6 w-12 bg-secondary/20" />
                <div className="h-10 w-2/3 bg-secondary/35" />
                <div className="space-y-3.5 border-l-2 border-border/20 pl-4 py-1.5">
                  <div className="h-3 w-full bg-secondary/15" />
                  <div className="h-3 w-5/6 bg-secondary/15" />
                  <div className="h-3 w-full bg-secondary/15" />
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-16 bg-secondary/20" />
                  <div className="h-6 w-20 bg-secondary/20" />
                </div>
                <div className="h-4 w-32 bg-secondary/30 mt-4" />
              </div>

              {/* Column B Mockup screen skeleton */}
              <div
                className={`lg:col-span-6 ${
                  isEven ? "lg:order-2" : "lg:order-1"
                } border-2 border-foreground bg-background p-4 sm:p-5 min-h-[220px] md:aspect-video flex flex-col justify-between`}
              >
                <div className="flex justify-between items-center border-b border-border/30 pb-2 mb-2 w-full">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary/30 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary/30 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary/30 inline-block" />
                  </div>
                  <div className="bg-secondary/20 border border-border/40 px-3 py-0.5 w-1/3 rounded-sm h-3" />
                  <div className="w-10 h-3 bg-secondary/20 rounded-sm" />
                </div>
                <div className="flex-1 border border-dashed border-border/30 bg-card/5 my-2 min-h-[110px]" />
                <div className="h-3 w-1/3 bg-secondary/20 rounded-sm mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Skills />
      
      {/* Dynamic Artifacts Loader wrapped in Suspense */}
      <Suspense fallback={<ArtifactsSkeleton />}>
        <Artifacts />
      </Suspense>

      <Metrics />
      <Contact />
    </>
  );
}
