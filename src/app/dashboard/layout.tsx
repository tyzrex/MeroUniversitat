import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
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

  const role =
    session?.user?.id != null
      ? (
          await db.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
          })
        )?.role
      : undefined;

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
