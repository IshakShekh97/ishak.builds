"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { projectSchema } from "@/lib/zod.schema";

async function verifyAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized: Invalid session");
  }
  return session;
}

export async function getProjectsAction() {
  try {
    await verifyAuth();
    const projects = await prisma.project.findMany({
      include: {
        techs: true,
      },
      orderBy: [
        { year: "desc" },
        { num: "asc" }
      ],
    });
    return { success: true, data: projects };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function getProjectByIdAction(id: string) {
  try {
    await verifyAuth();
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        techs: true,
      },
    });
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    return { success: true, data: project };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function createProjectAction(rawData: unknown) {
  try {
    await verifyAuth();
    const data = projectSchema.parse(rawData);

    // Parse tables and metrics stringified JSON into array objects
    const parsedTables = JSON.parse(data.tables);
    const parsedMetrics = JSON.parse(data.metrics);

    const project = await prisma.project.create({
      data: {
        num: data.num,
        title: data.title,
        slug: data.slug,
        category: data.category,
        year: data.year,
        url: data.url,
        mockupType: data.mockupType,
        imageUrl: data.imageUrl || null,
        livePreviewUrl: data.livePreviewUrl || null,
        githubUrl: data.githubUrl || null,
        description: data.description,
        architecturalSolution: data.architecturalSolution,
        desc: data.desc,
        sol: data.sol,
        subtitle: data.subtitle,
        challenge: data.challenge,
        solution: data.solution,
        schemaTitle: data.schemaTitle,
        tables: parsedTables,
        codeSnippet: data.codeSnippet,
        metrics: parsedMetrics,
        techs: {
          connect: data.techIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/archive");
    revalidatePath(`/archive/${project.slug}`);
    return { success: true, data: project };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function updateProjectAction(id: string, rawData: unknown) {
  try {
    await verifyAuth();
    const data = projectSchema.parse(rawData);

    // Parse tables and metrics stringified JSON into array objects
    const parsedTables = JSON.parse(data.tables);
    const parsedMetrics = JSON.parse(data.metrics);

    const project = await prisma.project.update({
      where: { id },
      data: {
        num: data.num,
        title: data.title,
        slug: data.slug,
        category: data.category,
        year: data.year,
        url: data.url,
        mockupType: data.mockupType,
        imageUrl: data.imageUrl || null,
        livePreviewUrl: data.livePreviewUrl || null,
        githubUrl: data.githubUrl || null,
        description: data.description,
        architecturalSolution: data.architecturalSolution,
        desc: data.desc,
        sol: data.sol,
        subtitle: data.subtitle,
        challenge: data.challenge,
        solution: data.solution,
        schemaTitle: data.schemaTitle,
        tables: parsedTables,
        codeSnippet: data.codeSnippet,
        metrics: parsedMetrics,
        techs: {
          set: data.techIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/archive");
    revalidatePath(`/archive/${project.slug}`);
    return { success: true, data: project };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await verifyAuth();
    const project = await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/archive");
    return { success: true, data: project };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function getPublicProjectsAction() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        techs: true,
      },
      orderBy: [
        { year: "desc" },
        { num: "asc" }
      ],
    });
    return { success: true, data: projects };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function getPublicProjectBySlugAction(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        techs: true,
      },
    });
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    return { success: true, data: project };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

