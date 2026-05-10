import {
  listApprovedAcceptanceRecordsPublic,
} from "@/modules/community/services/acceptance-record.service";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/modules/shared/components/container";
import Link from "next/link";

const resultLabel: Record<string, string> = {
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WAITLISTED: "Waitlisted",
  INTERVIEW: "Interview",
  PENDING: "Pending",
};

export async function PublicAcceptanceFeed() {
  const rows = await listApprovedAcceptanceRecordsPublic(12);

  if (rows.length === 0) {
    return (
      <section className="border-t border-slate-200/80 pt-14">
        <Container className="max-w-[1500px]">
          <h2 className="text-xl font-bold text-[#0d2145]">
            Recent public contributions
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            No published records yet — be the first to share your outcome using
            the form above.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="border-t border-slate-200/80 pt-14">
      <Container className="max-w-[1500px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0d2145]">
              Recent public contributions
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              Approved submissions only. Names respect your anonymity setting.
            </p>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => {
            const displayName =
              r.isAnonymous || !r.contributorName?.trim()
                ? "Anonymous"
                : r.contributorName;
            const program =
              r.programNameSnapshot?.trim() ||
              "Program not specified";
            const gpaStr =
              r.gpa != null ? String(r.gpa) : "—";
            const pctStr =
              r.percentage != null ? String(r.percentage) : "—";

            return (
              <li
                key={r.id}
                className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.04]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-md font-semibold"
                  >
                    {resultLabel[r.result] ?? r.result}
                  </Badge>
                  <span className="text-muted-foreground text-xs font-medium">
                    {r.intake}
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
                <p className="text-muted-foreground mt-1 text-sm">{program}</p>
                <div className="text-muted-foreground mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-xs">
                  <span>GPA: {gpaStr}</span>
                  <span>%: {pctStr}</span>
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  {displayName} · {r.university.city}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
