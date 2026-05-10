import type { ApplicationStatusValue } from "@/modules/applications/schema/application-form-schema";

export type KanbanColumnId = "research" | "prepare" | "pipeline" | "outcome";

/** Minimal card payload for the Kanban client (serializable). */
export type KanbanBoardCard = {
  id: string;
  userId: string;
  status: string;
  universityName: string;
  programLabel: string;
  ownerName: string;
  /** Profile image URL when available (e.g. OAuth avatar). */
  ownerImage: string | null;
  teamLabel: string | null;
};

/** Default status when a card is dropped on a column (owners only). */
export function kanbanColumnToDefaultStatus(
  column: KanbanColumnId,
): ApplicationStatusValue {
  switch (column) {
    case "research":
      return "RESEARCHING";
    case "prepare":
      return "PREPARING_DOCS";
    case "pipeline":
      return "APPLIED";
    case "outcome":
      return "OFFER_LETTER";
  }
}

/** Maps pipeline enum → one of four board columns (until drag-and-drop refines this). */
export function statusToKanbanColumn(status: string): KanbanColumnId {
  switch (status) {
    case "INTERESTED":
    case "RESEARCHING":
      return "research";
    case "PREPARING_DOCS":
    case "READY_TO_APPLY":
      return "prepare";
    case "APPLIED":
    case "UNDER_REVIEW":
    case "INTERVIEW":
      return "pipeline";
    default:
      return "outcome";
  }
}

export const KANBAN_COLUMNS: {
  id: KanbanColumnId;
  title: string;
  dot: string;
  /** Which ApplicationStatus values land here (use card dropdown for exact value). */
  statusHint: string;
}[] = [
  {
    id: "research",
    title: "Researching",
    dot: "bg-amber-400",
    statusHint: "Interested · Researching",
  },
  {
    id: "prepare",
    title: "Preparing",
    dot: "bg-orange-400",
    statusHint: "Preparing docs · Ready to apply",
  },
  {
    id: "pipeline",
    title: "Submitted / active",
    dot: "bg-blue-500",
    statusHint: "Applied · Under review · Interview",
  },
  {
    id: "outcome",
    title: "Outcomes",
    dot: "bg-emerald-500",
    statusHint: "Offer · Rejected · Enrolled · Withdrawn",
  },
];
