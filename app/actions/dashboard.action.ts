"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function verifyAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized: Invalid session");
  }
  return session;
}

export async function getDashboardStatsAction() {
  try {
    await verifyAuth();

    const [projectsCount, bookingsCount, techCount, linksCount] =
      await Promise.all([
        prisma.project.count(),
        prisma.booking.count(),
        prisma.tech.count(),
        prisma.bioLink.count(),
      ]);

    return {
      success: true,
      data: {
        projects: projectsCount,
        bookings: bookingsCount,
        tech: techCount,
        links: linksCount,
      },
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function getBookingsAction() {
  try {
    await verifyAuth();
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: bookings };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}
