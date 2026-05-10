import { listAcceptanceRecordsForUser } from "@/modules/community/services/acceptance-record.service";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/modules/shared/components/container";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const moderationLabel: Record<string, string> = {
  PENDING: "Pending review",
  APPROVED: "Published",
  REJECTED: "Rejected",
};

export const metadata = {
  title: "My contributions | MeroUniversität",
};

export default async function MyContributionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const rows = await listAcceptanceRecordsForUser(session.user.id);

  return (
    <Container className="max-w-[1500px] py-2">
      <header className="border-b border-slate-200/80 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0d2145]">
          My contributions
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
          Acceptance records you submitted while signed in.{" "}
          <Link
            className="text-primary font-semibold underline-offset-4 hover:underline"
            href="/community-data"
          >
            Submit another (public form)
          </Link>
          .
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="text-muted-foreground mt-10 text-sm">
          No submissions yet.{" "}
          <Link
            className="text-primary font-semibold underline-offset-4 hover:underline"
            href="/dashboard/community-data"
          >
            Share your first outcome
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 lg:grid-cols-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-semibold">
                  {moderationLabel[r.moderationStatus] ?? r.moderationStatus}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {r.intake} · {r.result}
                </span>
              </div>
              <p className="mt-3 font-semibold text-[#0d2145]">
                <Link
                  className="hover:text-primary underline-offset-4 hover:underline"
                  href={`/universities/${r.university.slug}`}
                >
                  {r.university.name}
                </Link>
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {r.programNameSnapshot?.trim() || "Program not specified"}
              </p>
              <p className="text-muted-foreground mt-4 text-xs">
                Submitted{" "}
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                }).format(r.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
