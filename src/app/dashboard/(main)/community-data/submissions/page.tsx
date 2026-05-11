import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import {
  dashboardOutlineActionClass,
  dashboardPrimaryActionClass,
} from "@/modules/dashboard/lib/dashboard-header-actions";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MyContributionsView,
  type ContributionRow,
} from "@/modules/community/components/my-contributions-view";
import { Skeleton } from "@/components/ui/skeleton";
import { listAcceptanceRecordsForUser } from "@/modules/community/services/acceptance-record.service";
import {
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
import { Suspense } from "react";

export const metadata = {
  title: "Acceptance submissions | MeroUniversität",
};

export default async function MyContributionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const rows = await listAcceptanceRecordsForUser(session.user.id);
  const payload: ContributionRow[] = rows.map((r) => ({
    id: r.id,
    intake: r.intake,
    result: r.result,
    moderationStatus: r.moderationStatus,
    createdAt: r.createdAt.toISOString(),
    programNameSnapshot: r.programNameSnapshot,
    university: {
      name: r.university.name,
      slug: r.university.slug,
      logoUrl: r.university.logoUrl,
      imageUrl: r.university.imageUrl,
    },
  }));

  const summary = {
    total: rows.length,
    approved: rows.filter((r) => r.moderationStatus === "APPROVED").length,
    pending: rows.filter((r) => r.moderationStatus === "PENDING").length,
    rejected: rows.filter((r) => r.moderationStatus === "REJECTED").length,
  };

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[
          { label: "Community data", href: "/dashboard/community-data" },
          { label: "Acceptance submissions" },
        ]}
        title="My acceptance submissions"
        description="Track moderation status for every admission outcome you shared while signed in. Published rows appear in public community stats."
      >
        <Link
          className={dashboardOutlineActionClass()}
          href="/dashboard/community-data"
        >
          Submit another outcome
        </Link>
        <Link
          className={dashboardPrimaryActionClass()}
          href="/dashboard/community-data"
        >
          <Plus className="size-4" strokeWidth={1.8} />
          New submission
        </Link>
      </DashboardPageIntro>

      <section className="grid gap-4 md:grid-cols-4">
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
        <section className="mt-8 rounded-3xl border border-dashed border-border bg-card p-10 text-center ">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <GraduationCap className="size-7" strokeWidth={1.7} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-foreground">
            No submissions yet
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-6">
            Share your first admission outcome to help applicants compare real
            profiles and timelines.
          </p>
          <Link
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90",
            )}
            href="/dashboard/community-data"
          >
            Share your first outcome
          </Link>
        </section>
      ) : (
        <Suspense
          fallback={
            <div className="mt-8 space-y-4">
              <div className="flex justify-end">
                <Skeleton className="h-9 w-48 rounded-xl" />
              </div>
              <Skeleton className="h-[420px] w-full rounded-3xl" />
            </div>
          }
        >
          <MyContributionsView rows={payload} />
        </Suspense>
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
    blue: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    amber: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    rose: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
  }[tone];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-border/40">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm font-semibold">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
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
