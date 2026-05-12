import { z } from "zod";

export const feedbackTypes = [
  "FEATURE_REQUEST",
  "COMMUNITY_FEEDBACK",
  "BUG_REPORT",
  "OTHER",
] as const;

export const feedbackCategories = [
  "ui",
  "performance",
  "data",
  "integration",
  "onboarding",
  "dashboard",
  "community",
  "other",
] as const;

export type FeedbackTypeEnum = (typeof feedbackTypes)[number];
export type FeedbackCategoryEnum = (typeof feedbackCategories)[number];

export const feedbackFormSchema = z.object({
  type: z.enum(feedbackTypes, {
    required_error: "Select a type",
  }),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be under 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(4000, "Description must be under 4000 characters"),
  category: z.enum(feedbackCategories).optional().or(z.literal("")),
  isAnonymous: z.boolean().default(false),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;
export type FeedbackFormInput = z.input<typeof feedbackFormSchema>;
