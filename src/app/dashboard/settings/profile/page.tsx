import { ProfileSettingsForm } from "@/modules/profile/components/profile-settings-form";
import type { ProfileSettingsInput } from "@/modules/profile/schema/profile-settings-schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Container } from "@/modules/shared/components/container";
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
    <Container className="max-w-[1100px] py-2">
      <header className="border-b border-slate-200/80 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0d2145]">
          Profile
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
          Your display name, bio, and academic snapshot. Control visibility with
          the toggle below.
        </p>
      </header>
      <ProfileSettingsForm defaultValues={defaults} />
    </Container>
  );
}
