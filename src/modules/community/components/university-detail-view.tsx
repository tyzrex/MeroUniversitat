import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UniversityLogo } from "@/modules/community/components/university-logo";
import type { UniversityApplicationStats } from "@/modules/community/services/university-application-stats.service";
import { Container } from "@/modules/shared/components/container";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  ListChecks,
  MapPin,
  Send,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { getUniversityBySlug } from "@/modules/community/services/university.service";

type UniversityRow = NonNullable<
  Awaited<ReturnType<typeof getUniversityBySlug>>
>;

export function UniversityDetailView({
  uni,
  stats,
  backHref,
  backLabel,
  isSignedIn,
  signInCallbackPath,
  embedded = false,
}: Readonly<{
  uni: UniversityRow;
  stats: UniversityApplicationStats;
  backHref: string;
  backLabel: string;
  isSignedIn: boolean;
  signInCallbackPath?: string;
  /** Omit gradient hero + back link when wrapped by dashboard intro. */
  embedded?: boolean;
}>) {
  const returnAfterAuth = signInCallbackPath ?? `/universities/${uni.slug}`;
  const newAppHref = `/dashboard/applications/new?universityId=${encodeURIComponent(uni.id)}`;

  return (
    <div
      className={
        embedded
          ? ""
          : "from-slate-50 via-white to-slate-50/80 bg-gradient-to-b pb-24 pt-10"
      }
    >
      {!embedded ? (
        <div className="w-full max-w-375 mx-auto px-6">
          <Link
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-[#0d2145]"
            href={backHref}
          >
            <ArrowLeft className="size-4" strokeWidth={1.8} />
            {backLabel}
          </Link>
          <header className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.03]">
            <div className="relative bg-gradient-to-br from-[#0d2145] via-[#263b8b] to-[#4a52c8] p-7 text-white md:p-10">
              <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_12%_18%,white_0,transparent_24%),radial-gradient(circle_at_88%_6%,white_0,transparent_22%)]" />
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-4xl">
                  <div className="mb-5 flex flex-wrap gap-2">
                    <Badge className="h-7 rounded-full border-white/20 bg-white/15 px-3 text-white backdrop-blur">
                      {uni.isPublic
                        ? "Public university"
                        : "Private university"}
                    </Badge>
                    {uni.verificationStatus === "PENDING" ? (
                      <Badge className="h-7 rounded-full border-amber-200/80 bg-amber-50 px-3 text-amber-900">
                        Unverified
                      </Badge>
                    ) : null}
                    {uni.ranking != null ? (
                      <Badge className="h-7 rounded-full border-white/20 bg-white px-3 text-[#0d2145]">
                        Rank #{uni.ranking}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <UniversityLogo
                      name={uni.name}
                      logoUrl={uni.logoUrl}
                      imageUrl={uni.imageUrl}
                      size="lg"
                      className="shadow-lg shadow-black/10"
                    />
                    <div>
                      <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                        {uni.name}
                      </h1>
                      <p className="mt-3 inline-flex items-center gap-2 text-lg text-white/78">
                        <MapPin className="size-5" strokeWidth={1.8} />
                        {uni.city}
                        {uni.state ? `, ${uni.state}` : ""}
                      </p>
                    </div>
                  </div>
                  {uni.description ? (
                    <p className="mt-7 max-w-3xl text-base leading-relaxed text-white/78 md:text-lg">
                      {uni.description}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  {isSignedIn ? (
                    <Link
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-11 rounded-xl bg-white text-[#0d2145] shadow-lg shadow-black/10 hover:bg-white/90",
                      )}
                      href={newAppHref}
                    >
                      Track application
                    </Link>
                  ) : (
                    <Link
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-11 rounded-xl bg-white text-[#0d2145] shadow-lg shadow-black/10 hover:bg-white/90",
                      )}
                      href={`/sign-in?callbackUrl=${encodeURIComponent(returnAfterAuth)}`}
                    >
                      Sign in to track
                    </Link>
                  )}
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-11 rounded-xl border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#0d2145]",
                    )}
                    href="/community-data"
                  >
                    Share outcome
                    <Send className="size-4" strokeWidth={1.8} />
                  </Link>
                  {uni.website ? (
                    <a
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "h-11 rounded-xl border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#0d2145]",
                      )}
                      href={uni.website}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Official website
                      <ExternalLink className="size-4" strokeWidth={1.8} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </header>
        </div>
      ) : null}

      {embedded && uni.description ? (
        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/30 p-5 text-sm leading-relaxed text-slate-700 md:p-6 md:text-base">
          {uni.description}
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-375 px-6">
        <section
          className={cn(
            "grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
            embedded ? "mt-0" : "mt-8",
          )}
        >
          <StatCard
            icon={GraduationCap}
            label="Applications tracked"
            value={stats.totalTrackedApplications}
            hint="Rows linked to this university"
          />
          <StatCard
            icon={Users}
            label="Applicants on platform"
            value={stats.distinctApplicants}
            hint="Unique students with this school in their pipeline"
          />
          <StatCard
            icon={ShieldCheck}
            label="Published outcomes"
            value={stats.communityPublishedOutcomes}
            hint="Moderated acceptance records for this institution"
          />
          <StatCard
            icon={UserCheck}
            label="My applications"
            value={isSignedIn ? stats.myApplicationCount : "—"}
            hint={
              isSignedIn
                ? "Your rows for this university"
                : "Sign in to see your count"
            }
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] md:p-6">
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#4a52c8]/12 text-[#4a52c8]">
              <ListChecks className="size-5" strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-[#0d2145]">
                Applicant playbook
              </h2>
              <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed">
                Use this page as your anchor: compare community outcomes to your
                GPA, then mirror deadlines and documents on your Kanban board.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span>
                    <strong className="text-[#0d2145]">Benchmark:</strong>{" "}
                    {stats.communityPublishedOutcomes} published outcome
                    {stats.communityPublishedOutcomes === 1 ? "" : "s"} from
                    peers — cross-check against your profile GPA before you
                    submit yours.
                  </span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span>
                    <strong className="text-[#0d2145]">Track:</strong> add this
                    uni as a row so intake, checklist, and deadlines stay next
                    to your other apps.
                  </span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span>
                    <strong className="text-[#0d2145]">Share:</strong> when your
                    result is final, post an anonymized outcome — it helps
                    applicants behind you.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] md:p-6">
          <h2 className="text-xl font-bold text-[#0d2145]">
            Application activity
          </h2>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed">
            See how many students are actively tracking this university in their
            pipeline. Add your own row to manage deadlines, documents, and
            status on the Kanban board alongside teammates.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {isSignedIn ? (
              <>
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 rounded-xl font-semibold",
                  )}
                  href={newAppHref}
                >
                  Add application for {uni.nameShort ?? uni.name}
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 rounded-xl font-semibold",
                  )}
                  href="/dashboard/applications/kanban"
                >
                  Open Kanban
                </Link>
              </>
            ) : (
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 rounded-xl font-semibold",
                )}
                href={`/sign-in?callbackUrl=${encodeURIComponent(returnAfterAuth)}`}
              >
                Sign in to add your pipeline
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: Readonly<{
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: ReactNode;
  hint: string;
}>) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm font-semibold">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#0d2145]">
            {value}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
          <Icon className="size-5" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
