import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account suspended",
  description:
    "This account has been suspended and cannot access the workspace.",
  robots: { index: false, follow: false },
};

export default function SuspendedPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-slate-50 px-6 py-16">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg ring-1 ring-slate-900/5">
        <h1 className="text-2xl font-bold text-[#0d2145]">Account paused</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          This account cannot access the workspace right now. If you think this is a
          mistake, contact support or reply to your moderator email thread.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#0d2145] px-6 text-sm font-semibold text-white hover:bg-[#1a3461]"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
