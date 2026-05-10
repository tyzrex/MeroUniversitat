import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getAcceptanceRecordForUser } from "@/modules/community/services/acceptance-record.service";
import { Container } from "@/modules/shared/components/container";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Languages,
  NotebookText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ComponentType, ReactNode } from "react";

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

const englishTestLabel: Record<string, string> = {
  NONE: "No English test",
  IELTS: "IELTS",
  TOEFL_IBT: "TOEFL iBT",
  PTE_ACADEMIC: "PTE Academic",
  DUOLINGO_ENGLISH: "Duolingo English Test",
  CAMBRIDGE_ENGLISH: "Cambridge English",
  OTHER: "Other English test",
};

function formatDate(date: Date | null | undefined) {
  if (!date) return "Not added";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function formatValue(value: unknown, fallback = "Not added") {
  if (value == null) return fallback;
  const text = String(value).trim();
  return text.length ? text : fallback;
}

function DetailCard({
  children,
  title,
}: Readonly<{
  children: ReactNode;
  title: string;
}>) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03]">
      <h2 className="text-base font-bold text-[#0d2145]">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: ReactNode;
}>) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        <Icon className="size-4" strokeWidth={1.8} />
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Contribution ${id.slice(0, 6)} | MeroUniversität`,
  };
}

export default async function SubmissionDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const record = await getAcceptanceRecordForUser(id, session.user.id);
  if (!record) {
    notFound();
  }

  const programName =
    record.program?.name ??
    record.programNameSnapshot?.trim() ??
    "Program not specified";
  const contributor = record.isAnonymous
    ? "Anonymous publicly"
    : record.contributorName?.trim() || session.user.name || "Not added";

  return (
    <Container className="max-w-[1500px] py-2">
      <div className="mb-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-[#0d2145]"
          href="/dashboard/community-data/submissions"
        >
          <ArrowLeft className="size-4" strokeWidth={1.8} />
          Back to submissions
        </Link>
      </div>

      <header className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.03]">
        <div className="relative bg-gradient-to-br from-[#0d2145] via-[#273b8f] to-[#4a52c8] p-7 text-white md:p-10">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_26%),radial-gradient(circle_at_80%_0%,white_0,transparent_22%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge className="h-7 rounded-full border-white/20 bg-white/15 px-3 text-white backdrop-blur">
                  {moderationLabel[record.moderationStatus] ??
                    record.moderationStatus}
                </Badge>
                <Badge className="h-7 rounded-full border-white/20 bg-white px-3 text-[#0d2145]">
                  {resultLabel[record.result] ?? record.result}
                </Badge>
              </div>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
                {record.university.name}
              </h1>
              <p className="mt-3 text-lg text-white/80">{programName}</p>
              <p className="mt-2 text-sm font-medium text-white/70">
                Submitted {formatDate(record.createdAt)} · {record.intake}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 rounded-xl border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#0d2145]",
                )}
                href={`/universities/${record.university.slug}`}
              >
                University page
              </Link>
              {record.university.website ? (
                <a
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 rounded-xl bg-white text-[#0d2145] hover:bg-white/90",
                  )}
                  href={record.university.website}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Official site
                  <ExternalLink className="size-4" strokeWidth={1.8} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <DetailCard title="Application profile">
            <DetailItem
              icon={GraduationCap}
              label="University"
              value={`${record.university.name} · ${record.university.city}${record.university.state ? `, ${record.university.state}` : ""}`}
            />
            <DetailItem
              icon={NotebookText}
              label="Program"
              value={programName}
            />
            <DetailItem
              icon={CalendarDays}
              label="Intake"
              value={record.intake}
            />
            <DetailItem
              icon={CheckCircle2}
              label="Outcome"
              value={resultLabel[record.result] ?? record.result}
            />
          </DetailCard>

          <DetailCard title="Academic snapshot">
            <DetailItem
              icon={GraduationCap}
              label="GPA"
              value={formatValue(record.gpa, "—")}
            />
            <DetailItem
              icon={GraduationCap}
              label="Percentage"
              value={record.percentage != null ? `${record.percentage}%` : "—"}
            />
            <DetailItem
              icon={Languages}
              label="English"
              value={`${englishTestLabel[record.englishTestType] ?? record.englishTestType}${record.englishTestScore ? ` · ${record.englishTestScore}` : ""}`}
            />
            <DetailItem
              icon={Languages}
              label="German level"
              value={record.germanLevel}
            />
            <DetailItem
              icon={NotebookText}
              label="Background"
              value={formatValue(record.subject)}
            />
            <DetailItem
              icon={ShieldCheck}
              label="APS"
              value={record.hasAPS ? "Completed" : "Not completed / not added"}
            />
          </DetailCard>
        </div>

        <aside className="space-y-6">
          <DetailCard title="Timeline">
            <DetailItem
              icon={CalendarDays}
              label="Applied"
              value={formatDate(record.appliedDate)}
            />
            <DetailItem
              icon={CalendarDays}
              label="Response"
              value={formatDate(record.responseDate)}
            />
            <DetailItem
              icon={CalendarDays}
              label="Offer"
              value={formatDate(record.offerDate)}
            />
            <DetailItem
              icon={UserRound}
              label="Contributor"
              value={contributor}
            />
          </DetailCard>

          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03]">
            <h2 className="text-base font-bold text-[#0d2145]">Notes</h2>
            <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50/90 p-4 text-sm leading-7 text-slate-700">
              {record.notes?.trim() ||
                "No notes were added to this submission."}
            </p>
          </section>
        </aside>
      </div>
    </Container>
  );
}
