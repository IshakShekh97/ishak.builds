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

export const projectSchema = z.object({
  num: z.string().min(1, "Number prefix is required (e.g., '01 //')"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  category: z.string().min(1, "Category is required"),
  year: z.string().min(4, "Year must be at least 4 digits"),
  url: z.string().min(1, "URL path is required (e.g., '/archive/slug')"),
  mockupType: z.string().min(1, "Mockup type is required (e.g. 'terminal', 'matrix')"),
  description: z.string().min(5, "Business problem description is required"),
  architecturalSolution: z.string().min(5, "Architectural solution is required"),
  desc: z.string().min(5, "System description is required"),
  sol: z.string().min(5, "Architectural win is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  challenge: z.string().min(5, "Challenge text is required"),
  solution: z.string().min(5, "Solution text is required"),
  schemaTitle: z.string().min(1, "Schema title is required"),
  tables: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }, "Tables must be a valid JSON array of objects"),
  codeSnippet: z.string().min(1, "Code snippet is required"),
  metrics: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }, "Metrics must be a valid JSON array of objects"),
  imageUrl: z.string().url("Must be a valid URL").or(z.string().length(0)).nullable().optional(),
  techIds: z.array(z.string()).default([]),
});

export type ProjectSchemaType = z.infer<typeof projectSchema>;

export const techSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  showOnLanding: z.boolean().default(false),
  landingRow: z.coerce.number().nullable().optional(),
  landingOrder: z.coerce.number().default(0),
});

export type TechSchemaType = z.infer<typeof techSchema>;

export const bioProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  initials: z.string().min(1, "Initials are required"),
  avatarUrl: z.string().url("Must be a valid URL").or(z.string().length(0)).nullable().optional(),
  beaconText: z.string().min(1, "Beacon text is required"),
  bio: z.string().nullable().optional(),
});

export type BioProfileSchemaType = z.infer<typeof bioProfileSchema>;

export const bioLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  desc: z.string().nullable().optional(),
  url: z.string().min(1, "URL is required"),
  isExternal: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

export type BioLinkSchemaType = z.infer<typeof bioLinkSchema>;

