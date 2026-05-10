import { CommunityAcceptanceForm } from "@/modules/community/components/community-acceptance-form";
import {
  CommunityDataHero,
  CommunityDataPageWrap,
} from "@/modules/community/components/community-data-hero";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
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

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  });

  const profilePrefill = profile
    ? {
        gpa: profile.gpa != null ? Number(profile.gpa) : undefined,
        percentage:
          profile.percentage != null ? Number(profile.percentage) : undefined,
        englishTestType: profile.englishTestType,
        englishTestScore: profile.englishTestScore ?? "",
        germanLevel: profile.germanLevel,
        nepalBoard: profile.nepalBoard ?? "",
        subject: profile.subject ?? "",
        workExperienceYrs: profile.workExperienceYrs ?? undefined,
      }
    : undefined;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <CommunityDataPageWrap>
        <CommunityDataHero variant="dashboard" />
        <CommunityAcceptanceForm
          defaultContributorName={session.user.name ?? ""}
          isLoggedIn
          profilePrefill={profilePrefill}
        />
      </CommunityDataPageWrap>
    </div>
  );
}
