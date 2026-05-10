import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Database,
  GraduationCap,
  Plus,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

const quickActions = [
  {
    title: "Share acceptance data",
    description:
      "Add your admission outcome to help future applicants compare profiles.",
    href: "/dashboard/community-data",
    icon: Plus,
  },
  {
    title: "View my submissions",
    description:
      "Track moderation status and open detailed submission profiles.",
    href: "/dashboard/community-data/submissions",
    icon: ClipboardList,
  },
  {
    title: "Browse universities",
    description: "Explore universities and programs from the public directory.",
    href: "/universities",
    icon: Building2,
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[{ label: "Overview" }]}
        title="Your Germany application hub"
        description="Keep your applications, university research, timelines, and community contributions in one workspace. Use the sidebar to jump between tools."
      >
        <Link
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 rounded-xl bg-[#0d2145] text-white shadow-md hover:bg-[#1a3461]",
          )}
          href="/dashboard/community-data"
        >
          Add outcome
        </Link>
        <Link
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50",
          )}
          href="/universities"
        >
          Browse universities
        </Link>
      </DashboardPageIntro>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={GraduationCap} label="Applications" value="Plan" />
        <MetricCard icon={Database} label="Community records" value="Share" />
        <MetricCard icon={Building2} label="Universities" value="Explore" />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#0d2145]">Quick actions</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Continue with the most useful parts of your workspace.
            </p>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {quickActions.map(({ description, href, icon: Icon, title }) => (
            <Link
              key={href}
              className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
              href={href}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
                  <Icon className="size-6" strokeWidth={1.8} />
                </div>
                <ArrowRight
                  className="size-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#4a52c8]"
                  strokeWidth={1.9}
                />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#0d2145]">{title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
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
