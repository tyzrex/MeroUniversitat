import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[{ label: "Settings" }]}
        title="Settings"
        description="Manage your account and preferences."
      />

      <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 ring-1 ring-slate-900/5 transition-colors hover:border-[#4a52c8]/25"
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
            className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 ring-1 ring-slate-900/5 transition-colors hover:border-[#4a52c8]/25"
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
