"use client";

import { FeedbackStatusBadge } from "@/modules/feedback/components/feedback-status-badge";
import { updateFeedbackStatusAction } from "@/modules/feedback/actions/update-feedback-status.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition, Fragment } from "react";
import { toast } from "sonner";
import { CheckCircle2, MessageSquare, XCircle } from "lucide-react";

export type AdminFeedbackRow = {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  adminNotes: string | null;
  category: string | null;
  createdAt: string;
  submitterLabel: string;
  isAnonymous: boolean;
};

export function AdminFeedbackTable({
  rows,
}: Readonly<{ rows: AdminFeedbackRow[] }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  function act(
    id: string,
    status: "ACKNOWLEDGED" | "IN_PROGRESS" | "COMPLETED" | "DECLINED",
  ) {
    startTransition(async () => {
      const res = await updateFeedbackStatusAction({
        id,
        status,
        adminNotes: notes[id] ?? "",
      });
      if (res.ok) {
        toast.success("Status updated");
        setExpanded(null);
        setNotes((prev) => ({ ...prev, [id]: "" }));
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-7" strokeWidth={1.8} />
        </div>
        <h3 className="mt-5 text-lg font-bold text-[#0d2145]">
          No submissions
        </h3>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
          There are no feedback submissions to review right now.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/90">
          <tr>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Date</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Type</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Title</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Status</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">From</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <Fragment key={r.id}>
              <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50/70">
                <td className="whitespace-nowrap px-4 py-4">
                  <p className="font-semibold text-slate-800">
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                    }).format(new Date(r.createdAt))}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Intl.DateTimeFormat("en", {
                      timeStyle: "short",
                    }).format(new Date(r.createdAt))}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {r.type.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="max-w-[240px] px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded(expanded === r.id ? null : r.id)
                      }
                      className="text-left font-semibold text-[#0d2145] underline-offset-2 hover:underline"
                    >
                      {r.title}
                    </button>
                    {r.category && (
                      <span className="inline-flex self-start rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                        {r.category}
                      </span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <FeedbackStatusBadge status={r.status} />
                </td>
                <td className="text-muted-foreground max-w-[200px] px-4 py-4 text-xs leading-5">
                  {r.isAnonymous ? "Anonymous" : r.submitterLabel || "Guest"}
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      className="rounded-xl font-semibold"
                      onClick={() =>
                        setExpanded(expanded === r.id ? null : r.id)
                      }
                    >
                      <MessageSquare className="size-3.5" strokeWidth={1.8} />
                      Respond
                    </Button>
                  </div>
                </td>
              </tr>
              {expanded === r.id && (
                <tr>
                  <td colSpan={6} className="bg-slate-50/50 px-4 py-4">
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                          Description
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                          {r.description}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                          Admin response
                        </label>
                        <textarea
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-[#4a52c8]/30 focus-visible:ring-2"
                          rows={3}
                          placeholder="Write a note to the submitter..."
                          value={notes[r.id] ?? r.adminNotes ?? ""}
                          onChange={(e) =>
                            setNotes((prev) => ({
                              ...prev,
                              [r.id]: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          disabled={isPending}
                          className="rounded-xl bg-emerald-600 font-semibold hover:bg-emerald-700"
                          onClick={() => act(r.id, "ACKNOWLEDGED")}
                        >
                          Acknowledge
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={isPending}
                          className="rounded-xl bg-blue-600 font-semibold hover:bg-blue-700"
                          onClick={() => act(r.id, "IN_PROGRESS")}
                        >
                          In progress
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={isPending}
                          className="rounded-xl bg-green-600 font-semibold hover:bg-green-700"
                          onClick={() => act(r.id, "COMPLETED")}
                        >
                          Completed
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={isPending}
                          className="rounded-xl font-semibold"
                          onClick={() => act(r.id, "DECLINED")}
                        >
                          <XCircle className="size-3.5" strokeWidth={1.8} />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
