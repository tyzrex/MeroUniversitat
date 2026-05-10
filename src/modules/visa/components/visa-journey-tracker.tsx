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
import { useMemo, useState, useTransition } from "react";

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
    <div id="visa-journey" className="scroll-mt-28">
      <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white  ring-1 ring-slate-900/5">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/95 text-left">
              <th className="px-4 py-3.5 pl-5 text-xs font-bold uppercase tracking-wide text-slate-500">
                Milestone
              </th>
              <th className="px-3 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                Date reached
              </th>
              <th className="px-3 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                Expected next
              </th>
              <th className="min-w-[220px] px-3 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                Notes
              </th>
              <th className="w-[1%] whitespace-nowrap px-4 pr-5 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {VISA_JOURNEY_MILESTONES.map((milestone) => {
              const cp = initial.get(milestone);
              return (
                <MilestoneRow
                  key={`${milestone}-${cp?.occurredAt ?? ""}-${cp?.expectedEta ?? ""}-${cp?.notes ?? ""}`}
                  checkpoint={cp}
                  milestone={milestone}
                />
              );
            })}
          </tbody>
        </table>
      </div>
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
    <tr className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/60">
      <td className="align-top px-4 py-4 pl-5">
        <p className="font-semibold leading-snug text-[#0d2145]">
          {VISA_MILESTONE_LABELS[milestone]}
        </p>
        {hint ? (
          <p className="text-muted-foreground mt-1.5 max-w-xs text-xs leading-relaxed">
            {hint}
          </p>
        ) : null}
      </td>
      <td className="align-top px-3 py-4">
        <Label className="sr-only">Date reached</Label>
        <Input
          type="date"
          value={occurredAt}
          onChange={(e) => {
            setOccurredAt(e.target.value);
            setSaved(false);
          }}
          className="h-10 rounded-xl border-slate-200 text-sm"
        />
      </td>
      <td className="align-top px-3 py-4">
        <Label className="sr-only">Expected next</Label>
        <Input
          type="date"
          value={expectedEta}
          onChange={(e) => {
            setExpectedEta(e.target.value);
            setSaved(false);
          }}
          className="h-10 rounded-xl border-slate-200 text-sm"
        />
      </td>
      <td className="align-top px-3 py-4">
        <Label className="sr-only">Notes</Label>
        <textarea
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNotes(e.target.value);
            setSaved(false);
          }}
          rows={2}
          placeholder="Optional — batch, queue context…"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground flex min-h-[72px] w-full max-w-md resize-y rounded-xl border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-[#4a52c8]/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </td>
      <td className="align-top px-4 py-4 pr-5 text-right">
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="sm"
            disabled={pending}
            className="rounded-xl bg-[#0d2145] font-semibold text-white hover:bg-[#1a3461]"
            onClick={save}
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Save"}
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
        </div>
        <div className="mt-2 flex min-h-5 flex-col items-end gap-0.5 text-xs">
          {saved ? (
            <span className="font-medium text-emerald-700">Saved</span>
          ) : null}
          {error ? (
            <span className="max-w-48 text-right font-medium text-red-600">
              {error}
            </span>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
