import { redirect } from "next/navigation";

/** Canonical route lives under the dashboard shell at `/dashboard/community-data`. */
export default function LegacyCommunityDataRedirect() {
  redirect("/dashboard/community-data");
}
