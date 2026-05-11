"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/modules/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import type * as React from "react";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  /** Better Auth / Prisma `User.role` — used for staff nav. */
  role?: string;
};

export function DashboardLayoutClient({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user: DashboardUser | null;
}>) {
  return (
    <SidebarProvider defaultOpen className="dashboard-shell min-h-svh">
      <DashboardSidebar user={user} />
      <SidebarInset className="min-w-0 bg-gradient-to-b from-background via-muted/40 to-background">
        <DashboardHeader user={user} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
