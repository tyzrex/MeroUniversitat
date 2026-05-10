import {
  dashboardInsightShellAlt,
} from "@/modules/dashboard/lib/dashboard-theme";
import { getSimilarPeersForUser } from "@/modules/dashboard/services/peer-matching.service";
import { UsersRound } from "lucide-react";
import Link from "next/link";

export async function SimilarPeersPanel({
  userId,
}: Readonly<{ userId: string }>) {
  const result = await getSimilarPeersForUser(userId);

  return (
    <div className={dashboardInsightShellAlt}>
      <div className="mb-4 flex items-start gap-2">
        <UsersRound className="size-5 shrink-0 text-[#4a52c8]" strokeWidth={1.8} />
        <div>
          <h2 className="text-lg font-bold text-[#0d2145]">
            Similar applicants (opt-in)
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Peers near your GPA who chose to share schools they track — names only,
            no documents.
          </p>
        </div>
      </div>

      {!result.hasGpa ? (
        <p className="text-sm leading-relaxed text-slate-600">
          Add your{" "}
          <Link
            href="/dashboard/profile#gpa"
            className="font-semibold text-[#4a52c8] hover:underline"
          >
            GPA on your profile
          </Link>{" "}
          to unlock matching.
        </p>
      ) : !result.optedIn ? (
        <p className="text-sm leading-relaxed text-slate-600">
          Turn on peer discovery in{" "}
          <Link
            href="/dashboard/profile#peer-matching"
            className="font-semibold text-[#4a52c8] hover:underline"
          >
            Profile settings
          </Link>{" "}
          (off by default). We only match within ±0.25 GPA points.
        </p>
      ) : result.peers.length === 0 ? (
        <p className="text-sm text-slate-600">
          No other opted-in applicants in your GPA band yet — check back as the
          community grows.
        </p>
      ) : (
        <ul className="space-y-4">
          {result.peers.map((p) => (
            <li
              key={p.userId}
              className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.04]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-[#0d2145]">
                  {p.displayName}
                </span>
                <span className="text-xs font-bold tabular-nums text-slate-500">
                  GPA ~{p.gpa.toFixed(2)}
                </span>
              </div>
              {p.universities.length > 0 ? (
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                  Tracking: {p.universities.join(" · ")}
                </p>
              ) : (
                <p className="text-muted-foreground mt-2 text-xs">
                  Pipeline universities not visible yet.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
