import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { ProfileSettingsForm } from "@/modules/profile/components/profile-settings-form";
import type { ProfileSettingsInput } from "@/modules/profile/schema/profile-settings-schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile | MeroUniversität",
};

export default async function ProfileSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });
  if (!user) {
    redirect("/sign-in");
  }

  const defaults: ProfileSettingsInput = {
    name: user.name,
    bio: user.bio ?? "",
    gpa: user.profile?.gpa != null ? Number(user.profile.gpa) : undefined,
    percentage:
      user.profile?.percentage != null
        ? Number(user.profile.percentage)
        : undefined,
    englishTestType: user.profile?.englishTestType ?? "NONE",
    englishTestScore: user.profile?.englishTestScore ?? "",
    germanLevel: user.profile?.germanLevel ?? "NONE",
    nepalUniversity: user.profile?.nepalUniversity ?? "",
    nepalBoard: user.profile?.nepalBoard ?? "",
    subject: user.profile?.subject ?? "",
    bachelorProgram: user.profile?.bachelorProgram ?? "",
    workExperienceYrs: user.profile?.workExperienceYrs ?? undefined,
    targetIntake: user.profile?.targetIntake ?? "",
    isPublic: user.profile?.isPublic ?? true,
  };

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[
          { label: "Settings", href: "/dashboard/settings" },
          { label: "Profile" },
        ]}
        title="Profile"
        description="Your display name, bio, and academic snapshot. Control visibility with the toggle in the form."
      />

      <ProfileSettingsForm defaultValues={defaults} />
    </div>
  );
}
