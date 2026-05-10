"use client";

import { moderateAcceptanceRecordAction } from "@/modules/community/actions/moderate-acceptance-record.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type PendingRow = {
  id: string;
  universityName: string;
  programName: string | null;
  intake: string;
  result: string;
  submitterLabel: string;
  createdAt: string;
};

export function CommunityReviewTable({
  rows,
}: Readonly<{ rows: PendingRow[] }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function act(id: string, decision: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      const res = await moderateAcceptanceRecordAction({ id, decision });
      if (res.ok) {
        router.refresh();
      }
    });
  }

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground mt-8 text-sm">
        No submissions waiting for review.
      </p>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/80">
          <tr>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Submitted</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">University</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Program</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Meta</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Submitter</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-100 last:border-0">
              <td className="text-muted-foreground whitespace-nowrap px-4 py-3">
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(r.createdAt))}
              </td>
              <td className="max-w-[180px] px-4 py-3 font-medium text-[#0d2145]">
                {r.universityName}
              </td>
              <td className="text-muted-foreground max-w-[200px] px-4 py-3">
                {r.programName?.trim() || "—"}
              </td>
              <td className="text-muted-foreground whitespace-nowrap px-4 py-3">
                {r.intake} · {r.result}
              </td>
              <td className="text-muted-foreground max-w-[220px] px-4 py-3 text-xs">
                {r.submitterLabel}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={isPending}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => act(r.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => act(r.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
