"use server";

import { sendBookingEmail } from "@/app/actions/email.action";
import prisma from "@/lib/prisma";
import { serverBookingSchema } from "@/lib/zod.schema";

export async function createBookingAction(rawData: unknown) {
  try {
    // Validate inputs using Zod
    const data = serverBookingSchema.parse(rawData);

    // Save to the database via Prisma
    const newBooking = await prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        budget: data.budget,
        customBudget: data.customBudget || null,
        timeline: data.timeline,
        customTimeline: data.customTimeline || null,
        specs: data.specs,
        customMessage: data.customMessage || null,
      },
    });

    // Send the notification email to the developer
    const emailRes = await sendBookingEmail(data);

    if (!emailRes.success) {
      console.error("Email dispatch failed:", emailRes.error);
    }

    return { success: true, booking: newBooking };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}
