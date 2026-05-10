import { z } from "zod";
import { VISA_JOURNEY_MILESTONES } from "@/modules/visa/lib/milestone-order";

export const upsertVisaCheckpointSchema = z.object({
  milestone: z.enum(VISA_JOURNEY_MILESTONES),
  occurredAt: z.string().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  expectedEta: z.string().optional().or(z.literal("")),
});

export type UpsertVisaCheckpointInput = z.infer<
  typeof upsertVisaCheckpointSchema
>;
