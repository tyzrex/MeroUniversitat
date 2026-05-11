import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { ProfileSettingsForm } from "@/modules/profile/components/profile-settings-form";
import type { ProfileSettingsInput } from "@/modules/profile/schema/profile-settings-schema";
import { VisaJourneyTracker } from "@/modules/visa/components/visa-journey-tracker";
import { listVisaCheckpointsForUser } from "@/modules/visa/services/visa-journey.service";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarClock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Profile | MeroUniversität",
};

export default async function ProfilePage() {
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

  const checkpoints = await listVisaCheckpointsForUser(session.user.id);

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
    peerMatchingOptIn: user.profile?.peerMatchingOptIn ?? false,
    embassyTimelinePublic: user.profile?.embassyTimelinePublic ?? false,
  };

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" },
        ]}
        title="Profile"
        description="Your display name, academics, and visa journey milestones — plus optional sharing with the community timeline."
      />

      <ProfileSettingsForm defaultValues={defaults} />

      <section className="rounded-3xl border border-border bg-gradient-to-br from-foreground/5 via-background to-primary/5 p-6 shadow-sm ring-1 ring-border/40 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Visa &amp; embassy journey
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              Log when you finished documents, got your admit, submitted CSP, entered the
              embassy queue, moved through prelim and review, interviewed, and collected
              your passport. Optional expected dates help you track uncertainty during long
              Nepal waits.
            </p>
          </div>
          <Link
            href="/dashboard/timelines"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-muted"
          >
            <CalendarClock className="size-4" strokeWidth={1.75} />
            Consular timeline
          </Link>
        </div>
        <div className="mt-8">
          <VisaJourneyTracker checkpoints={checkpoints} />
        </div>
      </section>
    </div>
  );
}
