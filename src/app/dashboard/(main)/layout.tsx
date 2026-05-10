import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardLayoutClient } from "@/modules/dashboard/components/dashboard-layout-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type * as React from "react";

/** Sidebar + header for all dashboard routes except `/dashboard/onboarding`. */
export default async function DashboardMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const workspaceUser =
    session?.user?.id != null
      ? await db.user.findUnique({
          where: { id: session.user.id },
          select: { role: true, onboardingCompletedAt: true, suspendedAt: true },
        })
      : null;

  if (session?.user?.id && workspaceUser?.suspendedAt) {
    redirect("/suspended");
  }
  if (session?.user?.id && !workspaceUser?.onboardingCompletedAt) {
    redirect("/dashboard/onboarding");
  }

  const role = workspaceUser?.role;

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? "User",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
        role,
      }
    : null;

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}
