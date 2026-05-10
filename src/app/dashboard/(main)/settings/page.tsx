import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[{ label: "Settings" }]}
        title="Settings"
        description="Manage your account and preferences."
      />

      <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
            href="/dashboard/settings/profile"
          >
            <span className="font-bold text-[#0d2145]">Profile</span>
            <span className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Name, bio, academics, and visibility
            </span>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
            href="/dashboard/community-data/submissions"
          >
            <span className="font-bold text-[#0d2145]">My contributions</span>
            <span className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Acceptance records you submitted while signed in
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
