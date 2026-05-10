import type { ApplicationStatusValue } from "@/modules/applications/schema/application-form-schema";

/** Human labels for every `ApplicationStatus` enum value — use in Kanban, tables, selects. */
export const APPLICATION_STATUS_LABELS: Record<
  ApplicationStatusValue,
  string
> = {
  INTERESTED: "Interested",
  RESEARCHING: "Researching",
  PREPARING_DOCS: "Preparing documents",
  READY_TO_APPLY: "Ready to apply",
  APPLIED: "Applied",
  UNDER_REVIEW: "Under review",
  INTERVIEW: "Interview",
  OFFER_LETTER: "Offer letter",
  REJECTED: "Rejected",
  ENROLLED: "Enrolled",
  WITHDRAWN: "Withdrawn",
};

export function applicationStatusLabel(status: string): string {
  return (
    APPLICATION_STATUS_LABELS[status as ApplicationStatusValue] ?? status
  );
}
