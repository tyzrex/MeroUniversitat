"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";
import { regenerateInviteCodeAction } from "@/modules/teams/actions/team-member.actions";
import { useRouter } from "next/navigation";

export function TeamInviteCodeCard({
  teamId,
  inviteCode,
  isOwner,
}: Readonly<{
  teamId: string;
  inviteCode: string;
  isOwner: boolean;
}>) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState(inviteCode);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the text
    }
  }

  function regenerate() {
    setError(null);
    startTransition(async () => {
      const res = await regenerateInviteCodeAction({ teamId });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setCurrentCode(res.data.inviteCode);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-border/40">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
        Invite code
      </p>
      <div className="mt-3 flex items-center gap-3">
        <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-xl bg-muted px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.22em] text-foreground">
          {currentCode}
        </code>
        <button
          type="button"
          onClick={copyCode}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          title="Copy invite code"
        >
          {copied ? (
            <Check className="size-4 text-emerald-600" strokeWidth={2.5} />
          ) : (
            <Copy className="size-4" strokeWidth={1.8} />
          )}
        </button>
      </div>

      {isOwner ? (
        <button
          type="button"
          onClick={regenerate}
          disabled={isPending}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-60"
        >
          <RefreshCw
            className={`size-3.5 ${isPending ? "animate-spin" : ""}`}
            strokeWidth={1.8}
          />
          {isPending ? "Regenerating…" : "Regenerate code"}
        </button>
      ) : null}

      {error ? (
        <p className="mt-2 text-center text-xs text-red-600">{error}</p>
      ) : null}

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Share this code with your friends so they can join your team.
      </p>
    </div>
  );
}
