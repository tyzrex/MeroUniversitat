import {
  CommunityAcceptanceForm,
} from "@/modules/community/components/community-acceptance-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function CommunityDataFormSection() {
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
    <CommunityAcceptanceForm
      defaultContributorName={session.user.name ?? ""}
      isLoggedIn
      profilePrefill={profilePrefill}
    />
  );
}
