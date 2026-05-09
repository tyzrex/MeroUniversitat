import type { ReactNode } from "react";

export function AuthFormPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col justify-center bg-white px-8 py-12 md:px-14 lg:border-l lg:border-slate-200">
      <div className="mx-auto w-full max-w-[440px]">{children}</div>
    </div>
  );
}
