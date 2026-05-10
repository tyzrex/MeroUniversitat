import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UniversityLogo } from "@/modules/community/components/university-logo";
import { getUniversityBySlug } from "@/modules/community/services/university.service";
import { Container } from "@/modules/shared/components/container";
import {
  ArrowLeft,
  ExternalLink,
  GraduationCap,
  MapPin,
  NotebookText,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType, ReactNode } from "react";

const DEGREE_LABEL: Record<string, string> = {
  BACHELOR: "Bachelor",
  MASTER: "Master",
  PHD: "PhD",
  DIPLOMA: "Diploma",
  AUSBILDUNG: "Ausbildung",
  OTHER: "Other",
};

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>): Promise<Metadata> {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);
  if (!uni) {
    return { title: "University | MeroUniversität" };
  }
  return {
    title: `${uni.name} | MeroUniversität`,
    description:
      uni.description ?? `Programs and details for ${uni.name} in ${uni.city}.`,
  };
}

export default async function UniversityDetailPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);
  if (!uni) {
    notFound();
  }

  return (
    <main className="from-slate-50 via-white to-slate-50/80 bg-gradient-to-b pb-24 pt-10">
      <Container className="max-w-[1500px]">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-[#0d2145]"
          href="/universities"
        >
          <ArrowLeft className="size-4" strokeWidth={1.8} />
          Back to universities
        </Link>

        <header className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.03]">
          <div className="relative bg-gradient-to-br from-[#0d2145] via-[#263b8b] to-[#4a52c8] p-7 text-white md:p-10">
            <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_12%_18%,white_0,transparent_24%),radial-gradient(circle_at_88%_6%,white_0,transparent_22%)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <div className="mb-5 flex flex-wrap gap-2">
                  <Badge className="h-7 rounded-full border-white/20 bg-white/15 px-3 text-white backdrop-blur">
                    {uni.isPublic ? "Public university" : "Private university"}
                  </Badge>
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
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 rounded-xl bg-white text-[#0d2145] shadow-lg shadow-black/10 hover:bg-white/90",
                  )}
                  href="/community-data"
                >
                  Share outcome
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

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard
            icon={NotebookText}
            label="Programs"
            value={uni.programs.length}
          />
          <StatCard icon={MapPin} label="City" value={uni.city} />
          <StatCard
            icon={GraduationCap}
            label="Type"
            value={uni.isPublic ? "Public" : "Private"}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] md:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#0d2145]">Programs</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {uni.programs.length} program
                {uni.programs.length === 1 ? "" : "s"} linked to this
                institution.
              </p>
            </div>
          </div>

          {uni.programs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-10 text-center">
              <p className="font-semibold text-[#0d2145]">
                No programs imported yet
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Program data will appear here once it is added to the directory.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/90">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-[#0d2145]">
                      Program
                    </th>
                    <th className="px-4 py-3 font-semibold text-[#0d2145]">
                      Degree
                    </th>
                    <th className="px-4 py-3 font-semibold text-[#0d2145]">
                      Subject
                    </th>
                    <th className="px-4 py-3 font-semibold text-[#0d2145]">
                      Language
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uni.programs.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-4 font-semibold text-[#0d2145]">
                        {p.name}
                      </td>
                      <td className="text-muted-foreground px-4 py-4">
                        {DEGREE_LABEL[p.degree] ?? p.degree}
                      </td>
                      <td className="text-muted-foreground px-4 py-4">
                        {p.subject}
                      </td>
                      <td className="text-muted-foreground px-4 py-4">
                        {p.language}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: ReactNode;
}>) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm font-semibold">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#0d2145]">
            {value}
          </p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
          <Icon className="size-5" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
