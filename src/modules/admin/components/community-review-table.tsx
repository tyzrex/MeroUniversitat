"use client";

import { moderateAcceptanceRecordAction } from "@/modules/community/actions/moderate-acceptance-record.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react";
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
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <ClipboardCheck className="size-7" strokeWidth={1.8} />
        </div>
        <h3 className="mt-5 text-lg font-bold text-[#0d2145]">
          Queue is clear
        </h3>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
          There are no community submissions waiting for review right now.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/90">
          <tr>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">
              Submitted
            </th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">
              University
            </th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Program</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Meta</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">
              Submitter
            </th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70"
            >
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
              <td className="max-w-[180px] px-4 py-4 font-semibold text-[#0d2145]">
                {r.universityName}
              </td>
              <td className="text-muted-foreground max-w-[220px] px-4 py-4">
                {r.programName?.trim() || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full font-semibold"
                  >
                    {r.intake}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full font-semibold"
                  >
                    {r.result}
                  </Badge>
                </div>
              </td>
              <td className="text-muted-foreground max-w-[240px] px-4 py-4 text-xs leading-5">
                {r.submitterLabel}
              </td>
              <td className="whitespace-nowrap px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={isPending}
                    className="rounded-xl bg-emerald-600 font-semibold hover:bg-emerald-700"
                    onClick={() => act(r.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="rounded-xl font-semibold"
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
