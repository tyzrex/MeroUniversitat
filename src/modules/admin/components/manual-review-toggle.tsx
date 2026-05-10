"use client";

import { updateSiteSettingsAction } from "@/modules/community/actions/update-site-settings.action";
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-lg font-semibold text-[#0d2145]">
        Community acceptance
      </h2>
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
        When manual review is on, new submissions stay pending until a moderator
        approves them. When off, valid submissions publish immediately (anonymous
        names still apply).
      </p>
      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={on}
          disabled={isPending}
          onChange={(e) => toggle(e.target.checked)}
          className="border-input ring-offset-background focus-visible:ring-ring mt-1 size-4 rounded border shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
        />
        <span className="text-sm leading-snug font-medium">
          Require manual review before publishing acceptance records
        </span>
      </label>
      {error ? (
        <p className="text-destructive mt-3 text-sm">{error}</p>
      ) : null}
    </div>
  );
}
