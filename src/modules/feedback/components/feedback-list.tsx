import {
  FeedbackStatusBadge,
  FeedbackTypeBadge,
} from "@/modules/feedback/components/feedback-status-badge";
import type { FeedbackRow } from "@/modules/feedback/services/feedback.service";
import { MessageSquareText } from "lucide-react";

function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) {
    return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function FeedbackList({
  items,
  showUser,
}: Readonly<{ items: FeedbackRow[]; showUser?: boolean }>) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center">
        <MessageSquareText className="size-10 text-slate-400" strokeWidth={1.5} />
        <div>
          <p className="text-lg font-semibold text-slate-600">No submissions yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Be the first to share your thoughts!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <FeedbackTypeBadge type={item.type} />
              <FeedbackStatusBadge status={item.status} />
            </div>
            <span className="text-muted-foreground shrink-0 text-xs font-medium">
              {timeAgo(new Date(item.createdAt))}
            </span>
          </div>

          <div>
            <h3 className="font-semibold text-[#0d2145]">{item.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {item.adminNotes && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                Admin note
              </p>
              <p className="mt-1 text-sm text-slate-700">{item.adminNotes}</p>
              {item.reviewer && (
                <p className="mt-1 text-xs text-slate-500">
                  — {item.reviewer.name}
                  {item.reviewedAt
                    ? `, ${timeAgo(new Date(item.reviewedAt))}`
                    : ""}
                </p>
              )}
            </div>
          )}

          {item.category && (
            <span className="inline-flex self-start rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {item.category}
            </span>
          )}

          {showUser && item.user && !item.isAnonymous && (
            <p className="text-xs text-slate-400">
              by {item.user.name} ({item.user.email})
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
