import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { dashboardPrimaryActionClass } from "@/modules/dashboard/lib/dashboard-header-actions";
import Link from "next/link";

export default function DashboardUniversitiesPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[{ label: "Universities" }]}
        title="Universities"
        description="Browse and compare institutions in the public directory. Your application tracker links programs from your dashboard rows."
      >
        <Link
          className={dashboardPrimaryActionClass()}
          href="/universities"
        >
          Open directory
        </Link>
      </DashboardPageIntro>
    </div>
  );
}
