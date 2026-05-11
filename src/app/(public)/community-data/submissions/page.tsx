import { PublicAcceptanceFeed } from "@/modules/community/components/public-acceptance-feed";
import { DashboardBannerHero } from "@/modules/shared/components/dashboard-banner-hero";
import { Container } from "@/modules/shared/components/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community submissions | MeroUniversität",
  description:
    "Browse approved admission outcomes shared by the MeroUniversität community.",
};

export default function CommunitySubmissionsPublicPage() {
  return (
    <main className="from-slate-50 via-white to-slate-50/80 bg-gradient-to-b pb-24 pt-6">
      <Container>
        <DashboardBannerHero
          rootCrumb={{ label: "Home", href: "/" }}
          crumbs={[
            { label: "Community data", href: "/community-data" },
            { label: "Submissions" },
          ]}
          eyebrow="Community"
          title="Approved admission outcomes"
          description={
            <>
              Explore moderated, opt-in records from students who chose to share — compare
              outcomes, intakes, and academic snapshots before you apply.
            </>
          }
          actions={
            <Link
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-xl bg-white px-6 font-bold text-[#1238da] hover:bg-blue-50",
              )}
              href="/community-data"
            >
              <Send className="size-4" strokeWidth={1.9} />
              Share your outcome
            </Link>
          }
          minHeightClass="min-h-[260px]"
        />
        <PublicAcceptanceFeed />
      </Container>
    </main>
  );
}
