import type { ReactNode } from "react";

import { Container } from "@/modules/shared/components/container";

export function CommunityDataHero({
  variant = "public",
}: Readonly<{
  variant?: "public" | "dashboard";
}>) {
  const isDashboard = variant === "dashboard";

  return (
    <header
      className={`${isDashboard ? "mb-10" : "mb-12"} border-b border-slate-200/80 pb-10`}
    >
      <div className="max-w-4xl">
        <p className="text-primary mb-2 text-xs font-bold uppercase tracking-[0.2em]">
          Community
        </p>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-[#0d2145] md:text-4xl lg:text-[2.35rem]">
          Acceptance data
        </h1>
        <p className="text-muted-foreground mt-4 max-w-3xl text-base leading-relaxed md:text-lg">
          Share your admission outcome and academic snapshot so others can
          benchmark realistic profiles. Sign in to manage your submissions —
          contributions may be reviewed before appearing in public stats when
          manual review is enabled.
        </p>
      </div>
    </header>
  );
}

export function CommunityDataPageWrap({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex flex-col gap-12">
      <Container className="max-w-[1500px] py-2">{children}</Container>
    </div>
  );
}
