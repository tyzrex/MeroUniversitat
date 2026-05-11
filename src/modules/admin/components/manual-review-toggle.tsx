"use client";

import { Badge } from "@/components/ui/badge";
import { updateSiteSettingsAction } from "@/modules/community/actions/update-site-settings.action";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";

export function ManualReviewToggle({
  initial,
}: Readonly<{ initial: boolean }>) {
  const [on, setOn] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle(next: boolean) {
    setError(null);
    startTransition(async () => {
      const res = await updateSiteSettingsAction({
        acceptanceManualReview: next,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOn(next);
    });
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-border/40 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
              <ShieldCheck className="size-5" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Community acceptance review
              </h2>
              <p className="text-muted-foreground text-sm">
                Public publishing safety gate
              </p>
            </div>
          </div>
          <p className="text-muted-foreground mt-5 max-w-2xl text-sm leading-6">
            When manual review is enabled, new submissions stay pending until a
            moderator approves them. When disabled, valid submissions publish
            immediately while still respecting anonymous display names.
          </p>
        </div>
        <Badge
          className={
            on
              ? "h-7 rounded-full bg-amber-500/15 px-3 font-semibold text-amber-700 dark:text-amber-300"
              : "h-7 rounded-full bg-emerald-500/15 px-3 font-semibold text-emerald-700 dark:text-emerald-300"
          }
        >
          {on ? "Review required" : "Auto-publish"}
        </Badge>
      </div>

      <label className="mt-8 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-muted/80 p-4 transition-colors hover:bg-muted">
        <span>
          <span className="block text-sm font-bold text-foreground">
            Require manual approval
          </span>
          <span className="text-muted-foreground mt-1 block text-sm leading-5">
            Toggle this on for human moderation before records appear publicly.
          </span>
        </span>
        <span className="relative inline-flex shrink-0 items-center">
          <input
            type="checkbox"
            checked={on}
            disabled={isPending}
            onChange={(e) => toggle(e.target.checked)}
            className="peer sr-only"
          />
          <span className="h-7 w-12 rounded-full bg-muted-foreground/40 transition-colors peer-checked:bg-primary peer-disabled:opacity-60" />
          <span className="absolute left-1 size-5 rounded-full bg-background shadow transition-transform peer-checked:translate-x-5" />
        </span>
      </label>

      {isPending ? (
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Saving setting…
        </p>
      ) : null}
      {error ? <p className="text-destructive mt-4 text-sm">{error}</p> : null}
    </div>
  );
}
