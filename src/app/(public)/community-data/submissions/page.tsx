import {
  CommunityDataHero,
  CommunityDataPageWrap,
} from "@/modules/community/components/community-data-hero";
import { PublicAcceptanceFeed } from "@/modules/community/components/public-acceptance-feed";
import { Container } from "@/modules/shared/components/container";
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
        <CommunityDataPageWrap>
          <CommunityDataHero variant="submissions" />
        </CommunityDataPageWrap>
        <PublicAcceptanceFeed />
      </Container>
    </main>
  );
}
