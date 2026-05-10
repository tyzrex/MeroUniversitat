import { ApplicationForm } from "@/modules/applications/components/application-form";
import type { ApplicationCreateInput } from "@/modules/applications/schema/application-form-schema";
import { getMirrorPrefill } from "@/modules/applications/services/application-mutations.service";
import { listTeamOptionsForUser } from "@/modules/teams/services/team.service";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "New application | MeroUniversität",
};

export default async function NewApplicationPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ mirror?: string }>;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const mirrorId = (await searchParams).mirror?.trim();
  const teamOptions = await listTeamOptionsForUser(session.user.id);

  let mirrorTeammateName: string | undefined;
  let universityInitialLabel: string | undefined;
  const defaultValues: Partial<ApplicationCreateInput> = {};

  if (mirrorId) {
    try {
      const mirror = await getMirrorPrefill(mirrorId, session.user.id);
      mirrorTeammateName = mirror.user.name;
      if (mirror.universityId) {
        defaultValues.universityId = mirror.universityId;
        universityInitialLabel = mirror.university
          ? `${mirror.university.name} — ${mirror.university.city}`
          : undefined;
      }
      defaultValues.intakeSemester = mirror.intakeSemester ?? "";
      defaultValues.mirrorsApplicationId = mirrorId;
      if (mirror.teamId) {
        defaultValues.teamId = mirror.teamId;
      }
    } catch {
      redirect("/dashboard/applications");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[
          { label: "Applications", href: "/dashboard/applications" },
          { label: "New" },
        ]}
        title="New application"
        description={`Add a program row. Team members see shared boards; use "Me too" on the list to link your row to someone else's.`}
      >
        <Link
          className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#0d2145] shadow-sm hover:bg-slate-50"
          href="/dashboard/applications"
        >
          ← Back to list
        </Link>
      </DashboardPageIntro>

      <ApplicationForm
        defaultValues={defaultValues}
        lockTeam={Boolean(mirrorId)}
        mirrorTeammateName={mirrorTeammateName}
        mode="create"
        teamOptions={teamOptions}
        universityInitialLabel={universityInitialLabel}
      />
    </div>
  );
}
