import type { ApplicationStatusValue } from "@/modules/applications/schema/application-form-schema";
import { applicationStatusLabel } from "@/modules/applications/lib/application-status-labels";
import { cn } from "@/lib/utils";

const statusTone: Record<
  ApplicationStatusValue,
  { bg: string; text: string }
> = {
  INTERESTED: {
    bg: "bg-amber-100 dark:bg-amber-500/20",
    text: "text-amber-900 dark:text-amber-200",
  },
  RESEARCHING: {
    bg: "bg-slate-100 dark:bg-slate-500/20",
    text: "text-slate-800 dark:text-slate-200",
  },
  PREPARING_DOCS: {
    bg: "bg-orange-50 dark:bg-orange-500/20",
    text: "text-orange-900 dark:text-orange-200",
  },
  READY_TO_APPLY: {
    bg: "bg-sky-50 dark:bg-sky-500/20",
    text: "text-sky-900 dark:text-sky-200",
  },
  APPLIED: {
    bg: "bg-blue-100 dark:bg-blue-500/20",
    text: "text-blue-900 dark:text-blue-200",
  },
  UNDER_REVIEW: {
    bg: "bg-violet-100 dark:bg-violet-500/20",
    text: "text-violet-900 dark:text-violet-200",
  },
  INTERVIEW: {
    bg: "bg-purple-100 dark:bg-purple-500/20",
    text: "text-purple-900 dark:text-purple-200",
  },
  OFFER_LETTER: {
    bg: "bg-emerald-100 dark:bg-emerald-500/20",
    text: "text-emerald-900 dark:text-emerald-200",
  },
  REJECTED: {
    bg: "bg-red-50 dark:bg-red-500/20",
    text: "text-red-800 dark:text-red-200",
  },
  ENROLLED: {
    bg: "bg-teal-50 dark:bg-teal-500/20",
    text: "text-teal-900 dark:text-teal-200",
  },
  WITHDRAWN: {
    bg: "bg-neutral-100 dark:bg-neutral-500/20",
    text: "text-neutral-700 dark:text-neutral-200",
  },
};

export function ApplicationStatusPill({
  status,
  className,
}: Readonly<{ status: string; className?: string }>) {
  const tone =
    statusTone[status as ApplicationStatusValue] ?? {
      bg: "bg-slate-100 dark:bg-slate-500/20",
      text: "text-slate-800 dark:text-slate-200",
    };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tone.bg,
        tone.text,
        className,
      )}
    >
      {applicationStatusLabel(status)}
    </span>
  );
}
