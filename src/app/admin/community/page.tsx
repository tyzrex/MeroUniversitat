import {
  CommunityReviewTable,
  type PendingRow,
} from "@/modules/admin/components/community-review-table";
import { listPendingAcceptanceRecords } from "@/modules/community/services/acceptance-record.service";

export const metadata = {
  title: "Community review | Admin",
};

export default async function AdminCommunityPage() {
  const raw = await listPendingAcceptanceRecords();
  const rows: PendingRow[] = raw.map((r) => ({
    id: r.id,
    universityName: r.university.name,
    programName: r.programNameSnapshot,
    intake: r.intake,
    result: r.result,
    submitterLabel: r.user
      ? `${r.user.name} · ${r.user.email}`
      : "Guest (not signed in)",
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[#0d2145] md:text-3xl">
        Community review
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
        Pending acceptance records waiting for approval. Approve to show them in
        public stats, or reject to hide them.
      </p>
      <CommunityReviewTable rows={rows} />
    </div>
  );
}
