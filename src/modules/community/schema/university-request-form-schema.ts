import { z } from "zod";

export const universityRequestFormSchema = z.object({
  name: z.string().min(2, "University name is required.").max(200),
  city: z.string().min(2, "City is required.").max(120),
  website: z
    .string()
    .url("Enter a valid website URL.")
    .optional()
    .or(z.literal("")),
  programUrl: z
    .string()
    .url("Enter a valid program URL.")
    .optional()
    .or(z.literal("")),
  notes: z.string().max(600).optional().or(z.literal("")),
});

export type UniversityRequestFormInput = z.infer<
  typeof universityRequestFormSchema
>;
