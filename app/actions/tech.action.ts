"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { techSchema } from "@/lib/zod.schema";

async function verifyAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized: Invalid session");
  }
  return session;
}

export async function getTechsAction() {
  try {
    const techs = await prisma.tech.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: techs };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function createTechAction(rawData: unknown) {
  try {
    await verifyAuth();
    const data = techSchema.parse(rawData);

    const tech = await prisma.tech.create({
      data: {
        name: data.name,
        slug: data.slug,
        showOnLanding: data.showOnLanding,
        landingRow: data.landingRow || null,
        landingOrder: data.landingOrder,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/tech");
    return { success: true, data: tech };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function updateTechAction(id: string, rawData: unknown) {
  try {
    await verifyAuth();
    const data = techSchema.parse(rawData);

    const tech = await prisma.tech.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        showOnLanding: data.showOnLanding,
        landingRow: data.landingRow || null,
        landingOrder: data.landingOrder,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/tech");
    return { success: true, data: tech };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function deleteTechAction(id: string) {
  try {
    await verifyAuth();
    const tech = await prisma.tech.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/tech");
    return { success: true, data: tech };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}
