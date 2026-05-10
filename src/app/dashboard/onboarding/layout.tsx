import type * as React from "react";

/** Standalone onboarding step — no sidebar (see `dashboard/(main)/layout.tsx`). */
export default function DashboardOnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_48%,#f8fafc_100%)]">
      {children}
    </div>
  );
}
