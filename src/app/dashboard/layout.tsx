import { auth } from "@/lib/auth";
import { DashboardLayoutClient } from "@/modules/dashboard/components/dashboard-layout-client";
import { headers } from "next/headers";
import type * as React from "react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? "User",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }
    : null;

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}
