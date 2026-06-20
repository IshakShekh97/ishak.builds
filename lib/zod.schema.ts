import { z } from "zod";

export const serverContactSchema = z.object({
  senderName: z.string().min(1, "Name is required"),
  senderEmail: z.string().email("Invalid email address format"),
  projectSubject: z.string().min(1, "Subject is required"),
  clientMessage: z.string().min(5, "Message must be at least 5 characters"),
});

export const serverBookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address format"),
  company: z.string().optional().nullable(),
  budget: z.string().min(1, "Estimated budget selection is required"),
  customBudget: z.string().optional().nullable(),
  timeline: z.string().min(1, "Target timeline selection is required"),
  customTimeline: z.string().optional().nullable(),
  specs: z
    .array(z.string())
    .min(1, "Select at least one engineering specification"),
  customMessage: z.string().optional().nullable(),
});

export const SignInSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
