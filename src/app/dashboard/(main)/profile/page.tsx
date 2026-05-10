import { ProfileSettingsForm } from "@/modules/profile/components/profile-settings-form";
import type { ProfileSettingsInput } from "@/modules/profile/schema/profile-settings-schema";
import { DashboardBannerHero } from "@/modules/shared/components/dashboard-banner-hero";
import { ProfilePageSkeleton } from "@/modules/dashboard/components/dashboard-route-skeletons";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarClock, UserSearch } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Profile | MeroUniversität",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
}

async function ProfilePageContent() {
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
    peerMatchingOptIn: user.profile?.peerMatchingOptIn ?? false,
    embassyTimelinePublic: user.profile?.embassyTimelinePublic ?? false,
  };

  return (
    <div className="flex flex-col gap-8">
      <DashboardBannerHero
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" },
        ]}
        eyebrow="Your account"
        title="Profile & academics"
        description={
          <>
            Display name, bio, GPA and tests, peer matching, and optional embassy timeline
            sharing — everything that drives dashboard insights and community features.
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/visa-journey"
          className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-colors hover:border-[#1238da]/35 hover:shadow-md md:p-7"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              <CalendarClock className="size-5" strokeWidth={1.75} />
            </div>
            <ArrowRight className="size-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1238da]" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#0d2145]">
            Visa &amp; embassy journey
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Dedicated page to log CSP, embassy queue, interview, and passport dates —
            step by step.
          </p>
        </Link>

        <Link
          href="/dashboard/similar-profiles"
          className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-colors hover:border-[#1238da]/35 hover:shadow-md md:p-7"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <UserSearch className="size-5" strokeWidth={1.75} />
            </div>
            <ArrowRight className="size-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1238da]" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#0d2145]">
            Similar applicants
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            See opted-in peers near your GPA and which universities they track (when you
            opt in too).
          </p>
        </Link>
      </section>

      <ProfileSettingsForm defaultValues={defaults} />
    </div>
  );
}
