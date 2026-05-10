import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { listAcceptanceRecordsForUser } from "@/modules/community/services/acceptance-record.service";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Plus,
  XCircle,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";

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

export const metadata = {
  title: "My contributions | MeroUniversität",
};

export default async function MyContributionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const rows = await listAcceptanceRecordsForUser(session.user.id);
  const summary = {
    total: rows.length,
    approved: rows.filter((r) => r.moderationStatus === "APPROVED").length,
    pending: rows.filter((r) => r.moderationStatus === "PENDING").length,
    rejected: rows.filter((r) => r.moderationStatus === "REJECTED").length,
  };

  return (
    <div>
      <header className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.03]">
        <div className="relative bg-gradient-to-br from-[#0d2145] via-[#263b8b] to-[#4a52c8] p-7 text-white md:p-10">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_14%_20%,white_0,transparent_24%),radial-gradient(circle_at_86%_6%,white_0,transparent_22%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-blue-100">
                Community dashboard
              </p>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
                My acceptance submissions
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/78">
                Track every outcome you shared, open a detailed profile, and see
                whether each record is pending, published, or rejected.
              </p>
            </div>
            <Link
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-xl bg-white text-[#0d2145] shadow-lg shadow-black/10 hover:bg-white/90",
              )}
              href="/dashboard/community-data"
            >
              <Plus className="size-4" strokeWidth={1.8} />
              Add submission
            </Link>
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total" value={summary.total} icon={FileText} />
        <SummaryCard
          label="Published"
          value={summary.approved}
          icon={CheckCircle2}
          tone="emerald"
        />
        <SummaryCard
          label="Pending"
          value={summary.pending}
          icon={Clock3}
          tone="amber"
        />
        <SummaryCard
          label="Rejected"
          value={summary.rejected}
          icon={XCircle}
          tone="rose"
        />
      </section>

      {rows.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
            <GraduationCap className="size-7" strokeWidth={1.7} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#0d2145]">
            No submissions yet
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-6">
            Share your first admission outcome to help applicants compare real
            profiles and timelines.
          </p>
          <Link
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 h-11 rounded-xl bg-[#0d2145] text-white hover:bg-[#1a3461]",
            )}
            href="/dashboard/community-data"
          >
            Share your first outcome
          </Link>
        </section>
      ) : (
        <ul className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
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
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#0d2145] text-lg font-bold text-white shadow-lg shadow-[#0d2145]/15">
                      {r.university.name.slice(0, 1).toUpperCase()}
                    </div>
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
                    }).format(r.createdAt)}
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

function SummaryCard({
  icon: Icon,
  label,
  tone = "blue",
  value,
}: Readonly<{
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  tone?: "blue" | "emerald" | "amber" | "rose";
  value: number;
}>) {
  const toneClass = {
    blue: "bg-blue-50 text-[#4a52c8]",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  }[tone];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm font-semibold">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-[#0d2145]">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl",
            toneClass,
          )}
        >
          <Icon className="size-5" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
