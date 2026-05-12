import {
  getAdminOverviewStats,
  listAdminUsers,
} from "@/modules/admin/services/admin-stats.service";
import {
  dashboardInsightShell,
} from "@/modules/dashboard/lib/dashboard-theme";
import {
  dashboardOutlineActionClass,
  dashboardPrimaryActionClass,
} from "@/modules/dashboard/lib/dashboard-header-actions";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Database,
  MessageSquareText,
  Settings,
  ShieldAlert,
  UsersRound,
} from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin overview | MeroUniversität",
  description:
    "Admin dashboard for managing the MeroUniversität platform.",
};

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[{ label: "Overview" }]}
        title="Operations overview"
        description="Community moderation, users, and platform health — same navy / indigo system as the main dashboard."
      >
        <Link className={dashboardOutlineActionClass()} href="/dashboard">
          Main dashboard
        </Link>
        <Link className={dashboardPrimaryActionClass()} href="/admin/community">
          Review queue
        </Link>
      </DashboardPageIntro>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricTile label="Registered users" value={stats.userCount} />
        <MetricTile
          label="Pending moderation"
          value={stats.pendingAcceptanceCount}
          tone="amber"
        />
        <MetricTile
          label="Published outcomes"
          value={stats.approvedAcceptanceCount}
          tone="emerald"
        />
        <MetricTile label="Application rows" value={stats.applicationCount} />
        <MetricTile
          label="Suspended accounts"
          value={stats.suspendedUserCount}
          tone="rose"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <Link
          href="/admin/community"
          className={`${dashboardInsightShell} group transition-colors hover:ring-[#4a52c8]/30`}
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#4a52c8]/12 text-[#4a52c8]">
            <Database className="size-5" strokeWidth={1.8} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#0d2145]">
            Community review
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Approve or reject acceptance submissions before they appear publicly.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4a52c8]">
            Open queue
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/admin/feedback"
          className={`${dashboardInsightShell} group transition-colors hover:ring-[#4a52c8]/30`}
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <MessageSquareText className="size-5" strokeWidth={1.8} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#0d2145]">
            Feedback &amp; requests
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Acknowledge and respond to community feedback and feature requests.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4a52c8]">
            {stats.pendingFeedbackCount} pending
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/admin/users"
          className={`${dashboardInsightShell} group transition-colors hover:ring-[#4a52c8]/30`}
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#0d2145]/10 text-[#0d2145]">
            <UsersRound className="size-5" strokeWidth={1.8} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#0d2145]">
            Users &amp; abuse
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Suspend spam accounts or investigate behaviour — admins only for
            destructive actions.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4a52c8]">
            Manage users
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/admin/settings"
          className={`${dashboardInsightShell} group transition-colors hover:ring-[#4a52c8]/30`}
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Settings className="size-5" strokeWidth={1.8} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#0d2145]">
            Site settings
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Manual review mode and global toggles for the acceptance pipeline.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4a52c8]">
            Configure
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>

      <RecentUsersPreview />
    </div>
  );
}

async function RecentUsersPreview() {
  const users = await listAdminUsers(6);
  return (
    <section className={dashboardInsightShell}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-5 text-[#4a52c8]" strokeWidth={1.8} />
          <h2 className="text-lg font-bold text-[#0d2145]">
            Recent registrations
          </h2>
        </div>
        <Link
          href="/admin/users"
          className="text-sm font-semibold text-[#4a52c8] hover:underline"
        >
          View all →
        </Link>
      </div>
      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white/80">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
          >
            <span className="font-semibold text-[#0d2145]">{u.name}</span>
            <span className="text-muted-foreground truncate">{u.email}</span>
            {u.suspendedAt ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">
                <ShieldAlert className="size-3.5" />
                Suspended
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-400">{u.role}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function MetricTile({
  label,
  value,
  tone = "blue",
}: Readonly<{
  label: string;
  value: number;
  tone?: "blue" | "amber" | "emerald" | "rose";
}>) {
  const wrap = {
    blue: "bg-blue-50 text-[#4a52c8]",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
  }[tone];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 ring-1 ring-slate-900/5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-3xl font-extrabold tabular-nums text-[#0d2145]">
          {value}
        </p>
        <div className={`flex size-10 items-center justify-center rounded-xl ${wrap}`}>
          <span className="text-xs font-black">#</span>
        </div>
      </div>
    </div>
  );
}
