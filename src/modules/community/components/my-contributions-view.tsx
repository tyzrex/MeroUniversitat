"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UniversityLogo } from "@/modules/community/components/university-logo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  LayoutGrid,
  Table2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type ContributionRow = {
  id: string;
  intake: string;
  result: string;
  moderationStatus: string;
  createdAt: string;
  programNameSnapshot: string | null;
  university: {
    name: string;
    slug: string;
    logoUrl: string | null;
    imageUrl: string | null;
  };
};

const moderationLabel: Record<string, string> = {
  PENDING: "Pending review",
  APPROVED: "Published",
  REJECTED: "Rejected",
};

const resultLabel: Record<string, string> = {
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WAITLISTED: "Waitlisted",
  INTERVIEW: "Interview",
  PENDING: "Pending",
};

const moderationStyles: Record<string, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-800",
};

export function MyContributionsView({
  rows,
}: Readonly<{
  rows: ContributionRow[];
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const view = searchParams.get("view") === "cards" ? "cards" : "table";

  const setView = useCallback(
    (next: "table" | "cards") => {
      const p = new URLSearchParams(searchParams.toString());
      if (next === "table") {
        p.delete("view");
      } else {
        p.set("view", "cards");
      }
      const q = p.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {rows.length} submission{rows.length === 1 ? "" : "s"}
        </p>
        <div className="flex rounded-xl border border-slate-200 bg-slate-50/80 p-1">
          <Button
            type="button"
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "gap-1.5 rounded-lg",
              view === "table" && "bg-[#0d2145] text-white hover:bg-[#1a3461]",
            )}
            onClick={() => setView("table")}
          >
            <Table2 className="size-4" strokeWidth={1.8} />
            Table
          </Button>
          <Button
            type="button"
            variant={view === "cards" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "gap-1.5 rounded-lg",
              view === "cards" && "bg-[#0d2145] text-white hover:bg-[#1a3461]",
            )}
            onClick={() => setView("cards")}
          >
            <LayoutGrid className="size-4" strokeWidth={1.8} />
            Cards
          </Button>
        </div>
      </div>

      {view === "table" ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/90">
                <tr>
                  <th className="px-5 py-3 font-semibold text-[#0d2145]">
                    University
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#0d2145]">
                    Program
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#0d2145]">
                    Status
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#0d2145]">
                    Result
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#0d2145]">
                    Intake
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#0d2145]">
                    Submitted
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#0d2145]" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const program =
                    r.programNameSnapshot?.trim() || "Program not specified";
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/dashboard/community-data/submissions/${r.id}`}
                          className="flex items-center gap-3"
                        >
                          <UniversityLogo
                            name={r.university.name}
                            logoUrl={r.university.logoUrl}
                            imageUrl={r.university.imageUrl}
                            size="xs"
                          />
                          <span className="font-semibold text-[#0d2145] hover:text-[#4a52c8]">
                            {r.university.name}
                          </span>
                        </Link>
                      </td>
                      <td className="max-w-[220px] px-5 py-4 text-slate-600">
                        <span className="line-clamp-2">{program}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-semibold",
                            moderationStyles[r.moderationStatus],
                          )}
                        >
                          {moderationLabel[r.moderationStatus] ??
                            r.moderationStatus}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        {resultLabel[r.result] ?? r.result}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {r.intake}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                        }).format(new Date(r.createdAt))}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/dashboard/community-data/submissions/${r.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#4a52c8] hover:underline"
                        >
                          Open
                          <ArrowRight className="size-3" strokeWidth={2} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <ul className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => {
            const program =
              r.programNameSnapshot?.trim() || "Program not specified";
            return (
              <li key={r.id}>
                <Link
                  className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
                  href={`/dashboard/community-data/submissions/${r.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-7 rounded-full px-3 font-semibold",
                        moderationStyles[r.moderationStatus],
                      )}
                    >
                      {moderationLabel[r.moderationStatus] ??
                        r.moderationStatus}
                    </Badge>
                    <ArrowRight
                      className="size-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#4a52c8]"
                      strokeWidth={1.9}
                    />
                  </div>

                  <div className="mt-5 flex gap-4">
                    <UniversityLogo
                      name={r.university.name}
                      logoUrl={r.university.logoUrl}
                      imageUrl={r.university.imageUrl}
                      size="compact"
                      className="shadow-lg shadow-[#0d2145]/15"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#0d2145] transition-colors group-hover:text-[#4a52c8]">
                        {r.university.name}
                      </p>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {program}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Intake
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {r.intake}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Result
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {resultLabel[r.result] ?? r.result}
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mt-5 text-xs">
                    Submitted{" "}
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                    }).format(new Date(r.createdAt))}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
