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
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  APPROVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
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
        <p className="text-sm text-muted-foreground">
          {rows.length} submission{rows.length === 1 ? "" : "s"}
        </p>
        <div className="flex rounded-xl border border-border bg-muted/60 p-1">
          <Button
            type="button"
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "gap-1.5 rounded-lg",
              view === "table" && "bg-foreground text-background hover:bg-foreground/90",
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
              view === "cards" && "bg-foreground text-background hover:bg-foreground/90",
            )}
            onClick={() => setView("cards")}
          >
            <LayoutGrid className="size-4" strokeWidth={1.8} />
            Cards
          </Button>
        </div>
      </div>

      {view === "table" ? (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-border/40">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-muted/60">
                <tr>
                  <th className="px-5 py-3 font-semibold text-foreground">
                    University
                  </th>
                  <th className="px-5 py-3 font-semibold text-foreground">
                    Program
                  </th>
                  <th className="px-5 py-3 font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-5 py-3 font-semibold text-foreground">
                    Result
                  </th>
                  <th className="px-5 py-3 font-semibold text-foreground">
                    Intake
                  </th>
                  <th className="px-5 py-3 font-semibold text-foreground">
                    Submitted
                  </th>
                  <th className="px-5 py-3 font-semibold text-foreground" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const program =
                    r.programNameSnapshot?.trim() || "Program not specified";
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-muted/60"
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
                          <span className="font-semibold text-foreground hover:text-primary">
                            {r.university.name}
                          </span>
                        </Link>
                      </td>
                      <td className="max-w-[220px] px-5 py-4 text-muted-foreground">
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
                      <td className="px-5 py-4 text-foreground">
                        {resultLabel[r.result] ?? r.result}
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground">
                        {r.intake}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                        }).format(new Date(r.createdAt))}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/dashboard/community-data/submissions/${r.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
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
                  className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-border/40 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
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
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
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
                      <p className="font-bold text-foreground transition-colors group-hover:text-primary">
                        {r.university.name}
                      </p>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {program}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Intake
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
                        {r.intake}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Result
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
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
