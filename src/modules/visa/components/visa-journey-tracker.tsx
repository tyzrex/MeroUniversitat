"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upsertVisaCheckpointAction } from "@/modules/visa/actions/upsert-visa-checkpoint.action";
import { formatDateOnlyIso } from "@/modules/visa/lib/date-only";
import {
  VISA_JOURNEY_MILESTONES,
  VISA_MILESTONE_HINTS,
  VISA_MILESTONE_LABELS,
  type VisaJourneyMilestoneValue,
} from "@/modules/visa/lib/milestone-order";
import type { CheckpointDto } from "@/modules/visa/services/visa-journey.service";
import { Loader2 } from "lucide-react";
import type * as React from "react";
import { useEffect, useMemo, useState, useTransition } from "react";

function milestoneMap(rows: CheckpointDto[]) {
  return new Map(rows.map((r) => [r.milestone, r] as const));
}

export function VisaJourneyTracker({
  checkpoints,
}: Readonly<{
  checkpoints: CheckpointDto[];
}>) {
  const initial = useMemo(() => milestoneMap(checkpoints), [checkpoints]);

  return (
    <div id="visa-journey" className="scroll-mt-28 flex flex-col gap-4">
      {VISA_JOURNEY_MILESTONES.map((milestone) => (
        <MilestoneRow
          key={milestone}
          checkpoint={initial.get(milestone)}
          milestone={milestone}
        />
      ))}
    </div>
  );
}

function MilestoneRow({
  milestone,
  checkpoint,
}: Readonly<{
  milestone: VisaJourneyMilestoneValue;
  checkpoint?: CheckpointDto;
}>) {
  const [occurredAt, setOccurredAt] = useState(
    checkpoint ? formatDateOnlyIso(checkpoint.occurredAt) : "",
  );
  const [expectedEta, setExpectedEta] = useState(
    checkpoint?.expectedEta ? formatDateOnlyIso(checkpoint.expectedEta) : "",
  );
  const [notes, setNotes] = useState(checkpoint?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setOccurredAt(checkpoint ? formatDateOnlyIso(checkpoint.occurredAt) : "");
    setExpectedEta(
      checkpoint?.expectedEta ? formatDateOnlyIso(checkpoint.expectedEta) : "",
    );
    setNotes(checkpoint?.notes ?? "");
  }, [checkpoint?.occurredAt, checkpoint?.expectedEta, checkpoint?.notes]);

  const hint = VISA_MILESTONE_HINTS[milestone];

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await upsertVisaCheckpointAction({
        milestone,
        occurredAt,
        expectedEta,
        notes,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
    });
  }

  function clearCheckpoint() {
    setOccurredAt("");
    setExpectedEta("");
    setNotes("");
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await upsertVisaCheckpointAction({
        milestone,
        occurredAt: "",
        expectedEta: "",
        notes: "",
      });
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/5 md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#0d2145]">
            {VISA_MILESTONE_LABELS[milestone]}
          </p>
          {hint ? (
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {hint}
            </p>
          ) : null}
        </div>
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-xl lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">
              Date reached
            </Label>
            <Input
              type="date"
              value={occurredAt}
              onChange={(e) => {
                setOccurredAt(e.target.value);
                setSaved(false);
              }}
              className="rounded-xl border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">
              Expected next (optional)
            </Label>
            <Input
              type="date"
              value={expectedEta}
              onChange={(e) => {
                setExpectedEta(e.target.value);
                setSaved(false);
              }}
              className="rounded-xl border-slate-200"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <Label className="text-xs font-medium text-slate-600">Notes</Label>
            <textarea
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setNotes(e.target.value);
                setSaved(false);
              }}
              rows={2}
              placeholder="Optional — e.g. batch context"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[72px] w-full resize-none rounded-xl border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <Button
          type="button"
          size="sm"
          disabled={pending}
          className="rounded-xl bg-[#0d2145] font-semibold text-white hover:bg-[#1a3461]"
          onClick={save}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save milestone"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          disabled={pending || (!checkpoint && !occurredAt)}
          onClick={clearCheckpoint}
        >
          Clear
        </Button>
        {saved ? (
          <span className="text-xs font-medium text-emerald-700">Saved</span>
        ) : null}
        {error ? (
          <span className="text-xs font-medium text-red-600">{error}</span>
        ) : null}
      </div>
    </div>
  );
}
