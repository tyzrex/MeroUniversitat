"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { DashboardHeader } from "@/modules/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import type * as React from "react";

export type DashboardUser = {
  name: string;
  email: string;
  image: string | null;
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
      <SidebarInset className="bg-slate-50">
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
