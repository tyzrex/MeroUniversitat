import { CommunityAcceptanceForm } from "@/modules/community/components/community-acceptance-form";
import {
  CommunityDataHero,
  CommunityDataPageWrap,
} from "@/modules/community/components/community-data-hero";
import { Container } from "@/modules/shared/components/container";
import { getOptionalSession } from "@/modules/shared/server/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community acceptance data | MeroUniversität",
  description:
    "Share your admission outcome to help the community benchmark realistic profiles.",
};

export default async function CommunityDataPublicPage() {
  const session = await getOptionalSession();

  return (
    <main className="from-slate-50 via-white to-slate-50/80 bg-gradient-to-b pb-24 pt-6 dark:from-slate-950 dark:via-background dark:to-slate-950/80">
      <Container>
        <CommunityDataPageWrap>
          <CommunityDataHero variant="form" />
          <CommunityAcceptanceForm
            defaultContributorName={session?.user?.name ?? ""}
            isLoggedIn={!!session?.user}
          />
        </CommunityDataPageWrap>
      </Container>
    </main>
  );
}
