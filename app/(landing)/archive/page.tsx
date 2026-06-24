import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ArchiveClient from "./archive-client";
import { TextReveal } from "@/components/ui/TextReveal";

// Async Server Component Loader
async function ArchiveListLoader() {
  // Fetch projects sorted by Year (descending) and then Number (ascending)
  const dbProjects = await prisma.project.findMany({
    include: {
      techs: true,
    },
    orderBy: [{ year: "desc" }, { num: "asc" }],
  });

  // Map database projects to match the common project structure
  const mappedDbProjects = dbProjects.map((p) => ({
    id: p.id,
    num: p.num,
    title: p.title,
    slug: p.slug,
    category: p.category,
    year: p.year,
    url: p.url,
    mockupType: p.mockupType,
    imageUrl: p.imageUrl,
    livePreviewUrl: p.livePreviewUrl,
    githubUrl: p.githubUrl,
    desc: p.desc,
    sol: p.sol,
    techs: p.techs.map((t) => ({ name: t.name })),
  }));

  return <ArchiveClient projects={mappedDbProjects} />;
}

// Blueprint Loading Skeleton
function ArchiveSkeleton() {
  return (
    <div className="space-y-36 relative z-10 w-full animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full border-t border-dashed border-border/20 pt-16 relative">
        {/* Sticky Year Block */}
        <div className="lg:col-span-2 sticky top-36">
          <div className="h-20 w-32 bg-secondary/20 border border-border/10 rounded-sm" />
          <div className="border-t-2 border-accent/20 w-16 mt-4" />
        </div>

        {/* Projects List skeleton */}
        <div className="lg:col-span-10 flex flex-col gap-28 w-full">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full"
            >
              {/* Text Spec Column */}
              <div className="lg:col-span-6 flex flex-col gap-4 border border-border/20 p-6 sm:p-8 bg-secondary/5">
                <div className="h-4 w-36 bg-secondary/20" />
                <div className="h-10 w-52 bg-secondary/35" />
                <div className="space-y-3.5 border-l-2 border-border/20 pl-4 py-1.5">
                  <div className="h-3 w-full bg-secondary/15" />
                  <div className="h-3 w-5/6 bg-secondary/15" />
                  <div className="h-3 w-full bg-secondary/15" />
                </div>
                <div className="flex gap-2.5 mt-2">
                  <div className="h-5.5 w-16 bg-secondary/20" />
                  <div className="h-5.5 w-20 bg-secondary/20" />
                </div>
                <div className="h-4 w-28 bg-secondary/30 mt-4" />
              </div>

              {/* Mockup screen Column */}
              <div className="lg:col-span-6 border-2 border-foreground bg-background p-4 sm:p-5 min-h-[220px] flex flex-col justify-between">
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ArchivePage() {
  return (
    <main className="min-h-screen w-full pt-28 sm:pt-36 pb-20 px-4 sm:px-8 md:px-16 lg:px-24 select-none relative overflow-hidden bg-background">
      <Suspense fallback={<ArchiveSkeleton />}>
        <ArchiveListLoader />
      </Suspense>
    </main>
  );
}
