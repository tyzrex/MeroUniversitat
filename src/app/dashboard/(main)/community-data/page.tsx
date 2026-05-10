import { CommunityAcceptanceForm } from "@/modules/community/components/community-acceptance-form";
import {
  CommunityDataHero,
  CommunityDataPageWrap,
} from "@/modules/community/components/community-data-hero";
import { Container } from "@/modules/shared/components/container";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community acceptance data | MeroUniversität",
  description:
    "Share your admission outcome to help the community benchmark realistic profiles.",
};

export default async function DashboardCommunityDataPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <CommunityDataPageWrap>
        <CommunityDataHero variant="dashboard" />
        <CommunityAcceptanceForm
          defaultContributorName={session.user.name ?? ""}
          isLoggedIn
        />
      </CommunityDataPageWrap>
    </div>
  );
}
