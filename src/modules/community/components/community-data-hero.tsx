import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Container } from "@/modules/shared/components/container";
import { Building2, Heart, Send, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

export function CommunityDataHero({
  variant = "form",
}: Readonly<{
  variant?: "form" | "submissions" | "dashboard";
}>) {
  const isDashboard = variant === "dashboard";
  const isSubmissions = variant === "submissions";

  return (
    <header className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-[#0b2bb8]">
      <div
        className="relative min-h-[285px] bg-cover bg-center p-7 text-white md:p-10"
        style={{ backgroundImage: "url('/bannerbg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#032c8c]/95 via-[#1432c7]/84 to-[#3935de]/76" />
        <div className="relative flex min-h-[220px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-lg bg-white/12 px-4 py-2 text-sm font-semibold text-blue-50 backdrop-blur">
              Community Acceptance Data
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
              {isSubmissions
                ? "Browse real admission outcomes"
                : "Share your university result"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/88 md:text-lg">
              {isSubmissions
                ? "Explore approved admission outcomes shared by students so you can compare real profiles, timelines, and decisions."
                : "Add your admission outcome and academic snapshot so future applicants can compare realistic profiles. All submissions are reviewed before publishing."}
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-xl bg-white px-6 font-bold text-[#1238da] hover:bg-blue-50",
                )}
                href={
                  isDashboard ? "/dashboard/community-data" : "/community-data"
                }
              >
                <Send className="size-4" strokeWidth={1.9} />
                Submit outcome
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-xl border-white/35 bg-white/5 px-6 font-bold text-white backdrop-blur hover:bg-white hover:text-[#1238da]",
                )}
                href={
                  isDashboard
                    ? "/dashboard/community-data/submissions"
                    : "/community-data/submissions"
                }
              >
                <ShieldCheck className="size-4" strokeWidth={1.9} />
                View submissions
              </Link>
            </div>
          </div>

          {/* <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[500px]">
            <HeroStat icon={UserRound} value="7,812" label="Profiles shared" />
            <HeroStat icon={Heart} value="12,456" label="Outcomes" />
            <HeroStat icon={Building2} value="3,245" label="Universities" />
          </div> */}
        </div>
      </div>
    </header>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}>) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/10">
      <div className="flex size-11 items-center justify-center rounded-xl bg-white/12 text-white">
        <Icon className="size-5" strokeWidth={1.9} />
      </div>
      <div>
        <p className="text-xl font-extrabold leading-none">{value}</p>
        <p className="mt-1 text-sm text-white/78">{label}</p>
      </div>
    </div>
  );
}

export function CommunityDataPageWrap({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="flex flex-col gap-8">{children}</div>;
}
