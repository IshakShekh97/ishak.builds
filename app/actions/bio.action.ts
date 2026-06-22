"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { bioLinkSchema, bioProfileSchema } from "@/lib/zod.schema";

async function verifyAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized: Invalid session");
  }
  return session;
}

export async function getBioProfileAction() {
  try {
    let profile = await prisma.bioProfile.findFirst({
      include: {
        links: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // Seed default if none exists
    if (!profile) {
      profile = await prisma.bioProfile.create({
        data: {
          name: "ISHAK.BUILDS",
          initials: "IS",
          avatarUrl: "",
          beaconText: "SYSTEM_BIO_ROUTER_V2",
          bio: "System administrator & full-stack software designer.",
        },
        include: {
          links: true,
        },
      });
    }

    return { success: true, data: profile };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function updateBioProfileAction(rawData: unknown) {
  try {
    await verifyAuth();
    const data = bioProfileSchema.parse(rawData);

    // Get the first profile
    const existing = await prisma.bioProfile.findFirst();
    if (!existing) {
      return { success: false, error: "BioProfile not found to update." };
    }

    const profile = await prisma.bioProfile.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        initials: data.initials,
        avatarUrl: data.avatarUrl || null,
        beaconText: data.beaconText,
        bio: data.bio || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/links");
    revalidatePath("/link"); // BioProfile links page
    return { success: true, data: profile };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function createBioLinkAction(rawData: unknown) {
  try {
    await verifyAuth();
    const data = bioLinkSchema.parse(rawData);

    const profile = await prisma.bioProfile.findFirst();
    if (!profile) {
      return {
        success: false,
        error: "BioProfile does not exist. Cannot create link.",
      };
    }

    const link = await prisma.bioLink.create({
      data: {
        label: data.label,
        desc: data.desc || null,
        url: data.url,
        isExternal: data.isExternal,
        order: data.order,
        profileId: profile.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/links");
    revalidatePath("/link");
    return { success: true, data: link };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function updateBioLinkAction(id: string, rawData: unknown) {
  try {
    await verifyAuth();
    const data = bioLinkSchema.parse(rawData);

    const link = await prisma.bioLink.update({
      where: { id },
      data: {
        label: data.label,
        desc: data.desc || null,
        url: data.url,
        isExternal: data.isExternal,
        order: data.order,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/links");
    revalidatePath("/link");
    return { success: true, data: link };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function deleteBioLinkAction(id: string) {
  try {
    await verifyAuth();
    const link = await prisma.bioLink.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/links");
    revalidatePath("/link");
    return { success: true, data: link };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}
