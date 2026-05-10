import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardUniversitiesPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[{ label: "Universities" }]}
        title="Universities"
        description="Browse and compare institutions in the public directory. Your application tracker links programs from your dashboard rows."
      >
        <Link
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 rounded-xl bg-[#0d2145] text-white shadow-md hover:bg-[#1a3461]",
          )}
          href="/universities"
        >
          Open directory
        </Link>
      </DashboardPageIntro>
    </div>
  );
}
