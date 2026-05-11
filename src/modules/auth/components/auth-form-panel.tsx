import type { ReactNode } from "react";

export function AuthFormPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col justify-center bg-background px-8 py-12 md:px-14 lg:border-l lg:border-border">
      <div className="mx-auto w-full max-w-[440px]">{children}</div>
    </div>
  );
}
