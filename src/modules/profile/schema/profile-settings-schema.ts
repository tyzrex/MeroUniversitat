import {
  ENGLISH_TEST_VALUES,
  type EnglishTestValue,
} from "@/modules/community/constants/english-test";
import { z } from "zod";

export const PROFILE_GERMAN_LEVELS = [
  "NONE",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const;

type GermanLevelValue = (typeof PROFILE_GERMAN_LEVELS)[number];

const emptyToUndefined = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : v;

function isEnglishTestType(v: unknown): v is EnglishTestValue {
  return (
    typeof v === "string" &&
    (ENGLISH_TEST_VALUES as readonly string[]).includes(v)
  );
}

function isGermanLevel(v: unknown): v is GermanLevelValue {
  return (
    typeof v === "string" &&
    (PROFILE_GERMAN_LEVELS as readonly string[]).includes(v)
  );
}

export const profileSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  bio: z.string().max(2000).optional().or(z.literal("")),

  gpa: z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(0).max(4).optional(),
  ),
  percentage: z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(0).max(100).optional(),
  ),
  englishTestType: z.custom<EnglishTestValue>(isEnglishTestType),
  englishTestScore: z.string().max(64).optional().or(z.literal("")),
  germanLevel: z.custom<GermanLevelValue>(isGermanLevel),
  nepalUniversity: z.string().max(200).optional().or(z.literal("")),
  nepalBoard: z.string().max(120).optional().or(z.literal("")),
  subject: z.string().max(200).optional().or(z.literal("")),
  bachelorProgram: z.string().max(200).optional().or(z.literal("")),
  workExperienceYrs: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(0).max(80).optional(),
  ),
  targetIntake: z.string().max(32).optional().or(z.literal("")),
  isPublic: z.boolean(),
  peerMatchingOptIn: z.boolean(),
  embassyTimelinePublic: z.boolean(),
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
