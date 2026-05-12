import { WorkspaceOnboardingChoice } from "@/modules/workspace/components/workspace-onboarding-choice";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome | MeroUniversität",
  description:
    "Set up your workspace and get started with MeroUniversität.",
  robots: { index: false, follow: false },
};

export default async function DashboardOnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const row = await db.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompletedAt: true },
  });

  if (row?.onboardingCompletedAt) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-10 flex items-center gap-2 text-[#0d2145] opacity-90 hover:opacity-100"
      >
        <Image
          alt="MeroUniversität"
          className="size-10 object-contain"
          height={40}
          src="/merounilogo.png"
          width={40}
        />
        <span className="text-lg font-black tracking-tight">
          Mero<span className="text-blue-500">Universität</span>
        </span>
      </Link>

      <WorkspaceOnboardingChoice />

      <p className="text-muted-foreground mt-10 max-w-md text-center text-xs leading-relaxed">
        You can change collaboration settings later by joining a team from{" "}
        <Link
          href="/dashboard/teams"
          className="text-primary font-semibold underline-offset-4 hover:underline"
        >
          Team management
        </Link>
        .
      </p>
    </div>
  );
}
