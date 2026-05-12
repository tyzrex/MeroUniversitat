"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { moderateUniversityRequestAction } from "@/modules/community/actions/moderate-university-request.action";
import { ClipboardCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type PendingUniversityRequestRow = {
  id: string;
  name: string;
  city: string;
  website: string | null;
  programUrl: string | null;
  notes: string | null;
  submitterLabel: string;
  createdAt: string;
};

export function UniversityRequestReviewTable({
  rows,
}: Readonly<{ rows: PendingUniversityRequestRow[] }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function act(id: string, decision: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      const res = await moderateUniversityRequestAction({ id, decision });
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
          No pending requests
        </h3>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
          Community university requests will appear here for review.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-220 text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/90">
          <tr>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">
              Submitted
            </th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">
              University
            </th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Links</th>
            <th className="px-4 py-3 font-semibold text-[#0d2145]">Notes</th>
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
              <td className="max-w-55 px-4 py-4">
                <p className="font-semibold text-[#0d2145]">{r.name}</p>
                <p className="text-muted-foreground text-xs">{r.city}</p>
              </td>
              <td className="whitespace-nowrap px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {r.website ? (
                    <Badge className="rounded-full" variant="outline">
                      <Link
                        className="inline-flex items-center gap-1"
                        href={r.website}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Website
                        <ExternalLink className="size-3" />
                      </Link>
                    </Badge>
                  ) : null}
                  {r.programUrl ? (
                    <Badge className="rounded-full" variant="outline">
                      <Link
                        className="inline-flex items-center gap-1"
                        href={r.programUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Program
                        <ExternalLink className="size-3" />
                      </Link>
                    </Badge>
                  ) : null}
                  {!r.website && !r.programUrl ? (
                    <span className="text-muted-foreground text-xs">—</span>
                  ) : null}
                </div>
              </td>
              <td className="text-muted-foreground max-w-60 px-4 py-4 text-xs leading-5">
                {r.notes?.trim() || "—"}
              </td>
              <td className="text-muted-foreground max-w-60 px-4 py-4 text-xs leading-5">
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
