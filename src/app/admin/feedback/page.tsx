import { Badge } from "@/components/ui/badge";
import {
  AdminFeedbackTable,
  type AdminFeedbackRow,
} from "@/modules/feedback/components/admin-feedback-table";
import {
  listFeedbackAdmin,
  getFeedbackStats,
} from "@/modules/feedback/services/feedback.service";
import { requireModeratorSession } from "@/modules/admin/server/guards";
import { Clock3, MessageSquareText, ShieldCheck } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback management | Admin | MeroUniversität",
  description:
    "Review and manage user feedback submissions.",
};

export default async function AdminFeedbackPage() {
  await requireModeratorSession();

  const [feedback, stats] = await Promise.all([
    listFeedbackAdmin(),
    getFeedbackStats(),
  ]);

  const rows: AdminFeedbackRow[] = feedback.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    description: r.description,
    status: r.status,
    adminNotes: r.adminNotes,
    category: r.category,
    createdAt: r.createdAt.toISOString(),
    submitterLabel: r.user ? `${r.user.name} · ${r.user.email}` : "Guest",
    isAnonymous: r.isAnonymous,
  }));

  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.03]">
        <div className="relative bg-gradient-to-br from-[#0d2145] via-[#253980] to-[#4a52c8] p-7 text-white md:p-10">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_12%_18%,white_0,transparent_24%),radial-gradient(circle_at_88%_6%,white_0,transparent_22%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge className="mb-4 h-7 rounded-full border-white/20 bg-white/15 px-3 text-white backdrop-blur">
                Community interaction
              </Badge>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
                Feedback &amp; feature requests
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/78">
                Review, acknowledge, and respond to community feedback and
                feature requests. Let submitters know their voice is heard.
              </p>
            </div>
            <div className="grid min-w-[280px] grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-blue-100">
                  <MessageSquareText className="size-4" strokeWidth={1.8} />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Total
                  </span>
                </div>
                <p className="mt-2 text-3xl font-extrabold">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-blue-100">
                  <Clock3 className="size-4" strokeWidth={1.8} />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Pending
                  </span>
                </div>
                <p className="mt-2 text-3xl font-extrabold">{stats.pending}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-blue-100">
                  <ShieldCheck className="size-4" strokeWidth={1.8} />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Ack&apos;d
                  </span>
                </div>
                <p className="mt-2 text-3xl font-extrabold">
                  {stats.acknowledged}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Feature requests"
          value={stats.featureRequestCount}
          color="indigo"
        />
        <StatCard
          label="Community feedback"
          value={stats.communityFeedbackCount}
          color="teal"
        />
        <StatCard
          label="Bug reports"
          value={stats.bugReportCount}
          color="rose"
        />
        <StatCard label="Other" value={stats.otherCount} color="slate" />
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
              <MessageSquareText className="size-5" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-bold text-[#0d2145]">All submissions</h2>
              <p className="text-muted-foreground text-sm">
                Click Respond to review details and update status.
              </p>
            </div>
          </div>
        </div>
        <AdminFeedbackTable rows={rows} />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: Readonly<{
  label: string;
  value: number;
  color: "indigo" | "teal" | "rose" | "slate";
}>) {
  const wrap = {
    indigo: "bg-indigo-50 text-indigo-600",
    teal: "bg-teal-50 text-teal-600",
    rose: "bg-rose-50 text-rose-600",
    slate: "bg-slate-100 text-slate-600",
  }[color];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 ring-1 ring-slate-900/5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-3xl font-extrabold tabular-nums text-[#0d2145]">
          {value}
        </p>
        <div
          className={`flex size-10 items-center justify-center rounded-xl ${wrap}`}
        >
          <span className="text-xs font-black">#</span>
        </div>
      </div>
    </div>
  );
}
