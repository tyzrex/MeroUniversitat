/** Mirrors Prisma `EnglishTestType` — keep in sync with prisma/schema.prisma */
export const ENGLISH_TEST_VALUES = [
  "NONE",
  "IELTS",
  "TOEFL_IBT",
  "PTE_ACADEMIC",
  "DUOLINGO_ENGLISH",
  "CAMBRIDGE_ENGLISH",
  "OTHER",
] as const;

export type EnglishTestValue = (typeof ENGLISH_TEST_VALUES)[number];

export const ENGLISH_TEST_LABELS: Record<EnglishTestValue, string> = {
  NONE: "No English test / not applicable",
  IELTS: "IELTS",
  TOEFL_IBT: "TOEFL iBT",
  PTE_ACADEMIC: "PTE Academic",
  DUOLINGO_ENGLISH: "Duolingo English Test",
  CAMBRIDGE_ENGLISH: "Cambridge English (CPE/CAE/FCE)",
  OTHER: "Other English test",
};
