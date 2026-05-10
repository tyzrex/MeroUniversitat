import { UniversityLogo } from "@/modules/community/components/university-logo";
import { listApprovedAcceptanceRecordsPublic } from "@/modules/community/services/acceptance-record.service";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Database } from "lucide-react";
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
      <section className="pt-4">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center ">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
            <Database className="size-7" strokeWidth={1.8} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#0d2145]">
            No published records yet
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-6">
            Be the first to share your outcome and help the community compare
            realistic admission profiles.
          </p>
          <Link
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 h-11 rounded-xl bg-[#0d2145] text-white hover:bg-[#1a3461]",
            )}
            href="/community-data"
          >
            Share outcome
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0d2145]">
            Approved submissions
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Public records are moderated and respect each contributor’s
            anonymity setting.
          </p>
        </div>
        <Link
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 rounded-xl bg-white font-semibold",
          )}
          href="/community-data"
        >
          Add yours
        </Link>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => {
          const displayName =
            r.isAnonymous || !r.contributorName?.trim()
              ? "Anonymous"
              : r.contributorName;
          const program =
            r.programNameSnapshot?.trim() || "Program not specified";
          const gpaStr = r.gpa != null ? String(r.gpa) : "—";
          const pctStr = r.percentage != null ? String(r.percentage) : "—";

          return (
            <li
              key={r.id}
              className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="secondary" className="rounded-md font-semibold">
                  {resultLabel[r.result] ?? r.result}
                </Badge>
                <span className="text-muted-foreground text-xs font-medium">
                  {r.intake}
                </span>
                <ArrowRight
                  className="ml-auto size-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#4a52c8]"
                  strokeWidth={1.9}
                />
              </div>
              <div className="mt-4 flex gap-3">
                <UniversityLogo
                  name={r.university.name}
                  logoUrl={r.university.logoUrl}
                  imageUrl={r.university.imageUrl}
                  size="md"
                  className="shadow-md shadow-black/5"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#0d2145]">
                    <Link
                      className="hover:text-primary underline-offset-4 hover:underline"
                      href={`/universities/${r.university.slug}`}
                    >
                      {r.university.name}
                    </Link>
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">{program}</p>
                </div>
              </div>
              <div className="text-muted-foreground mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-5 text-xs">
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
    </section>
  );
}
