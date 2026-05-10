import { CommunityAcceptanceForm } from "@/modules/community/components/community-acceptance-form";
import { getOptionalSession } from "@/modules/shared/server/session";
import { Container } from "@/modules/shared/components/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community acceptance data | MeroUniversität",
  description:
    "Share your admission outcome to help the community benchmark realistic profiles.",
};

export default async function DashboardCommunityDataPage() {
  const session = await getOptionalSession();

  return (
    <div className="flex flex-col gap-6">
      <Container className="max-w-3xl py-2">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0d2145] md:text-4xl">
            Community acceptance data
          </h1>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Tell us about your application outcome and academic snapshot. Sign in
            to prefill your name — everyone can contribute.
          </p>
        </header>
        <CommunityAcceptanceForm
          defaultContributorName={session?.user?.name ?? ""}
          isLoggedIn={!!session?.user}
        />
      </Container>
    </div>
  );
}
