import prisma from "@/lib/prisma";
import ArtifactsClient from "./artifacts-client";

export default async function Artifacts() {
  // Query first 3 projects from PostgreSQL DB via Prisma, ordered by Year (desc) and Number (asc)
  const dbProjects = await prisma.project.findMany({
    include: {
      techs: true,
    },
    orderBy: [
      { year: "desc" },
      { num: "asc" },
    ],
    take: 3,
  });

  if (dbProjects.length === 0) {
    return (
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-20 text-center font-mono text-xs text-muted-foreground uppercase border-b border-border/30">
        [ NO_SELECTED_ARTIFACTS_COMPILED_IN_REGISTRY ]
      </div>
    );
  }

  // Map to common artifacts format
  const mappedDbProjects = dbProjects.map((p) => ({
    num: p.num,
    title: p.title,
    description: p.description,
    architecturalSolution: p.architecturalSolution,
    tags: p.techs.map((t) => t.name),
    url: `/archive/${p.slug}`,
    mockupType: p.mockupType,
    imageUrl: p.imageUrl,
    livePreviewUrl: p.livePreviewUrl,
    githubUrl: p.githubUrl,
  }));

  return <ArtifactsClient artifacts={mappedDbProjects} />;
}
