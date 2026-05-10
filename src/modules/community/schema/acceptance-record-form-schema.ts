import {
  ENGLISH_TEST_VALUES,
  type EnglishTestValue,
} from "@/modules/community/constants/english-test";
import { z } from "zod";

const germanLevels = ["NONE", "A1", "A2", "B1", "B2", "C1", "C2"] as const;

const admissionResults = [
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
  "INTERVIEW",
  "PENDING",
] as const;

const emptyToUndefined = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : v;

export const acceptanceRecordFormSchema = z
  .object({
    contributorName: z.string().max(120).optional().or(z.literal("")),

    universityId: z.string().min(1, "Select a university"),
    programId: z.string().optional().or(z.literal("")),
    programNameFree: z.string().max(240).optional().or(z.literal("")),

    gpa: z.preprocess(
      emptyToUndefined,
      z.coerce.number().min(0).max(4).optional(),
    ),
    percentage: z.preprocess(
      emptyToUndefined,
      z.coerce.number().min(0).max(100).optional(),
    ),

    englishTestType: z.enum(ENGLISH_TEST_VALUES),
    englishTestScore: z.string().max(32).optional().or(z.literal("")),

    germanLevel: z.enum(germanLevels),
    nepalBoard: z.string().max(120).optional().or(z.literal("")),
    subject: z.string().max(240).optional().or(z.literal("")),

    workExperienceYrs: z.preprocess(
      emptyToUndefined,
      z.coerce.number().min(0).max(80).optional(),
    ),

    hasAPS: z.boolean(),

    intake: z
      .string()
      .min(2, { error: "Enter a valid intake year" })
      .max(32, { error: "Enter a valid intake year" }),
    result: z.enum(admissionResults),

    appliedDate: z.string().optional().or(z.literal("")),
    responseDate: z.string().optional().or(z.literal("")),
    offerDate: z.string().optional().or(z.literal("")),

    notes: z.string().max(4000).optional().or(z.literal("")),

    isAnonymous: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const type = data.englishTestType as EnglishTestValue;
    if (type !== "NONE") {
      const score = data.englishTestScore?.trim();
      if (!score) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter your score for the selected English test",
          path: ["englishTestScore"],
        });
      }
    }
  });

/** Output after validation (API / server). */
export type AcceptanceRecordFormValues = z.infer<
  typeof acceptanceRecordFormSchema
>;

/** Raw form state (matches preprocess / optional fields before coercion). */
export type AcceptanceRecordFormInput = z.input<
  typeof acceptanceRecordFormSchema
>;

export { germanLevels, admissionResults };
