import {
  type ApplicationDashboardStatCard,
  getDashboardApplicationStats,
} from "@/modules/applications/services/application-list.service";
import { cn } from "@/lib/utils";
import {
  Archive,
  Mail,
  TrendingDown,
  TrendingUp,
  Users,
  UserRoundCheck,
} from "lucide-react";

const icons = [Users, UserRoundCheck, Mail, Archive] as const;

function TrendLine({
  pct,
}: Readonly<{ pct: number | null }>) {
  if (pct === null) {
    return (
      <span className="text-xs font-medium text-slate-400">
        No prior period
      </span>
    );
  }
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold",
        up ? "text-emerald-600" : "text-red-600",
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} />
      {up ? "+" : ""}
      {pct}% from last month
    </span>
  );
}

export async function ApplicationsStatsCards({
  userId,
}: Readonly<{ userId: string }>) {
  const stats = await getDashboardApplicationStats(userId);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((card: ApplicationDashboardStatCard, i: number) => {
        const Icon = icons[i] ?? Users;
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 ring-1 ring-slate-900/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-xl bg-slate-50 p-2.5 text-[#4a52c8]">
                <Icon className="size-5" strokeWidth={1.8} />
              </div>
              <TrendLine pct={card.trendPct} />
            </div>
            <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#0d2145]">
              {card.value}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              {card.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
