import Link from "next/link";

export default function SuspendedPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-16">
      <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-lg ring-1 ring-border/40">
        <h1 className="text-2xl font-bold text-foreground">Account paused</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          This account cannot access the workspace right now. If you think this is a
          mistake, contact support or reply to your moderator email thread.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-6 text-sm font-semibold text-background hover:bg-foreground/90"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
