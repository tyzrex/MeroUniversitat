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
  Settings,
  ShieldAlert,
  UsersRound,
} from "lucide-react";

export const metadata = {
  title: "Admin overview | MeroUniversität",
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

      <section className="grid gap-6 lg:grid-cols-3">
        <Link
          href="/admin/community"
          className={`${dashboardInsightShell} group transition-colors hover:ring-[#4a52c8]/30`}
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Database className="size-5" strokeWidth={1.8} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">
            Community review
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Approve or reject acceptance submissions before they appear publicly.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Open queue
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/admin/users"
          className={`${dashboardInsightShell} group transition-colors hover:ring-[#4a52c8]/30`}
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-foreground/10 text-foreground">
            <UsersRound className="size-5" strokeWidth={1.8} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">
            Users &amp; abuse
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Suspend spam accounts or investigate behaviour — admins only for
            destructive actions.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Manage users
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/admin/settings"
          className={`${dashboardInsightShell} group transition-colors hover:ring-[#4a52c8]/30`}
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
            <Settings className="size-5" strokeWidth={1.8} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">
            Site settings
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Manual review mode and global toggles for the acceptance pipeline.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
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
          <ClipboardList className="size-5 text-primary" strokeWidth={1.8} />
          <h2 className="text-lg font-bold text-foreground">
            Recent registrations
          </h2>
        </div>
        <Link
          href="/admin/users"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View all →
        </Link>
      </div>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-card/80">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
          >
            <span className="font-semibold text-foreground">{u.name}</span>
            <span className="text-muted-foreground truncate">{u.email}</span>
            {u.suspendedAt ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                <ShieldAlert className="size-3.5" />
                Suspended
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                {u.role}
              </span>
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
    blue: "bg-primary/10 text-primary",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  }[tone];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 ring-1 ring-border/40">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-3xl font-extrabold tabular-nums text-foreground">
          {value}
        </p>
        <div className={`flex size-10 items-center justify-center rounded-xl ${wrap}`}>
          <span className="text-xs font-black">#</span>
        </div>
      </div>
    </div>
  );
}
