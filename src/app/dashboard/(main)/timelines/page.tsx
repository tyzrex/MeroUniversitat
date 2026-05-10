import { ConsularTimelineView } from "@/modules/visa/components/consular-timeline-view";
import {
  consularCommunityStats,
  countCspSubmissionsByMonth,
  listCommunityWaitlistRows,
  listVisaCheckpointsForUser,
} from "@/modules/visa/services/visa-journey.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Consular timeline | MeroUniversität",
};

export default async function TimelinesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const [personalCheckpoints, stats, communityRows, heatmapBuckets] =
    await Promise.all([
      listVisaCheckpointsForUser(userId),
      consularCommunityStats(),
      listCommunityWaitlistRows(14),
      countCspSubmissionsByMonth(),
    ]);

  return (
    <ConsularTimelineView
      personalCheckpoints={personalCheckpoints}
      stats={stats}
      communityRows={communityRows}
      heatmapBuckets={heatmapBuckets}
    />
  );
}
