import { CommunityAcceptanceForm } from "@/modules/community/components/community-acceptance-form";
import {
  CommunityDataHero,
  CommunityDataPageWrap,
} from "@/modules/community/components/community-data-hero";
import { getOptionalSession } from "@/modules/shared/server/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community acceptance data | MeroUniversität",
  description:
    "Share your admission outcome to help the community benchmark realistic profiles.",
};

export default async function DashboardCommunityDataPage() {
  const session = await getOptionalSession();

  return (
    <CommunityDataPageWrap>
      <CommunityDataHero variant="dashboard" />
      <CommunityAcceptanceForm
        defaultContributorName={session?.user?.name ?? ""}
        isLoggedIn={!!session?.user}
      />
    </CommunityDataPageWrap>
  );
}
