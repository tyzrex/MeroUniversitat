import { ApplicationForm } from "@/modules/applications/components/application-form";
import { DeleteApplicationButton } from "@/modules/applications/components/delete-application-button";
import { getApplicationForEditor } from "@/modules/applications/services/application-mutations.service";
import { listTeamOptionsForUser } from "@/modules/teams/services/team.service";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Edit application | MeroUniversität",
};

export default async function EditApplicationPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const app = await getApplicationForEditor(session.user.id, id);
  if (!app) {
    notFound();
  }

  const teamOptions = await listTeamOptionsForUser(session.user.id);

  const universityInitialLabel =
    app.university != null
      ? `${app.university.name} — ${app.university.city}`
      : `${app.universityName} — ${app.city}`;

  const universityInitialLogoUrl =
    app.university != null
      ? app.university.logoUrl ?? app.university.imageUrl ?? null
      : null;

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[
          { label: "Applications", href: "/dashboard/applications" },
          { label: "Edit" },
        ]}
        title="Edit application"
        description={`Changes stay on your row. Linked "me too" applications keep their team context.`}
      >
        <Link
          className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#0d2145]  hover:bg-slate-50"
          href="/dashboard/applications"
        >
          ← Back to list
        </Link>
      </DashboardPageIntro>

      <ApplicationForm
        defaultValues={{
          id: app.id,
          universityId: app.universityId ?? "",
          programName: app.programName ?? "",
          intakeSemester: app.intakeSemester ?? "",
          teamId: app.teamId ?? undefined,
          status: app.status,
          notes: app.notes ?? "",
          deadline: app.deadline ? app.deadline.toISOString().slice(0, 10) : "",
        }}
        lockTeam={Boolean(app.mirrorsApplicationId)}
        mode="edit"
        teamOptions={teamOptions}
        universityInitialLabel={universityInitialLabel}
        universityInitialLogoUrl={universityInitialLogoUrl}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-bold text-[#0d2145]">Danger zone</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Deleting removes only your row (and cannot be undone).
        </p>
        <div className="mt-4">
          <DeleteApplicationButton id={app.id} />
        </div>
      </div>
    </div>
  );
}
