import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectDetailClient } from "./project-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArchiveSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Try fetching project details from Postgres database
  const dbProject = await prisma.project.findUnique({
    where: { slug },
  });

  if (!dbProject) {
    notFound();
  }

  const project = {
    title: dbProject.title,
    subtitle: dbProject.subtitle,
    num: dbProject.num,
    challenge: dbProject.challenge,
    solution: dbProject.solution,
    schemaTitle: dbProject.schemaTitle,
    tables: dbProject.tables as { name: string; columns: string[] }[],
    codeSnippet: dbProject.codeSnippet,
    metrics: dbProject.metrics as { label: string; value: string }[],
    livePreviewUrl: dbProject.livePreviewUrl,
    githubUrl: dbProject.githubUrl,
    imageUrl: dbProject.imageUrl,
  };

  return <ProjectDetailClient project={project} />;
}

