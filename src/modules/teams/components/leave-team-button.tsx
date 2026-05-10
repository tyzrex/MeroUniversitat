"use client";

import { Button } from "@/components/ui/button";
import { leaveTeamAction } from "@/modules/teams/actions/team-member.actions";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LeaveTeamButton({
  teamId,
  teamName,
}: Readonly<{
  teamId: string;
  teamName: string;
}>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleLeave() {
    setError(null);
    startTransition(async () => {
      const res = await leaveTeamAction({ teamId });
      if (!res.ok) {
        setError(res.error);
        setConfirming(false);
        return;
      }
      router.push("/dashboard/teams");
      router.refresh();
    });
  }

  if (!confirming) {
    return (
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setConfirming(true)}
          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-2 size-4" strokeWidth={1.8} />
          Leave team
        </Button>
        {error ? (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-semibold text-red-900">
        Leave &quot;{teamName}&quot;?
      </p>
      <p className="mt-1 text-xs text-red-700">
        You won&apos;t see the team&apos;s shared applications anymore. Your own
        application rows will remain but become solo entries.
      </p>
      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
          className="rounded-lg"
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleLeave}
          disabled={isPending}
          className="rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          {isPending ? (
            <Loader2 className="mr-2 size-3.5 animate-spin" />
          ) : null}
          Leave team
        </Button>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
