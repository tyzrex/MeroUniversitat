"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { submitAcceptanceRecordAction } from "@/modules/community/actions/submit-acceptance-record.action";
import { ENGLISH_TEST_LABELS, ENGLISH_TEST_VALUES } from "@/modules/community/constants/english-test";
import {
  acceptanceRecordFormSchema,
  admissionResults,
  germanLevels,
  type AcceptanceRecordFormInput,
} from "@/modules/community/schema/acceptance-record-form-schema";
import { UniversityPicker } from "@/modules/community/components/university-picker";
import {
  RHFCheckbox,
  RHFInput,
  RHFSelect,
  RHFTextarea,
} from "@/modules/shared/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const admissionLabels: Record<(typeof admissionResults)[number], string> = {
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WAITLISTED: "Waitlisted",
  INTERVIEW: "Interview",
  PENDING: "Pending",
};

const germanLabels: Record<(typeof germanLevels)[number], string> = {
  NONE: "None",
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
  C1: "C1",
  C2: "C2",
};

type Props = Readonly<{
  defaultContributorName: string;
  isLoggedIn: boolean;
}>;

export function CommunityAcceptanceForm({
  defaultContributorName,
  isLoggedIn,
}: Props) {
  const defaultValues = useMemo<AcceptanceRecordFormInput>(
    () => ({
      contributorName: defaultContributorName,
      universityId: "",
      programId: "",
      programNameFree: "",
      gpa: undefined,
      percentage: undefined,
      englishTestType: "NONE",
      englishTestScore: "",
      germanLevel: "NONE",
      nepalBoard: "",
      subject: "",
      workExperienceYrs: undefined,
      hasAPS: false,
      intake: "",
      result: "PENDING",
      appliedDate: "",
      responseDate: "",
      offerDate: "",
      notes: "",
      isAnonymous: false,
    }),
    [defaultContributorName],
  );

  const form = useForm<AcceptanceRecordFormInput>({
    resolver: zodResolver(acceptanceRecordFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  async function onSubmit(values: AcceptanceRecordFormInput) {
    setSubmitError(null);
    setDoneId(null);
    const result = await submitAcceptanceRecordAction(values);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    setDoneId(result.data.id);
    form.reset(defaultValues);
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {doneId ? (
          <Alert className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-950">
            <AlertTitle>Thanks for contributing</AlertTitle>
            <AlertDescription>
              Your acceptance record was saved. It may be reviewed before
              appearing in community stats.
            </AlertDescription>
          </Alert>
        ) : null}

        {submitError ? (
          <Alert variant="destructive" className="rounded-xl">
            <AlertTitle>Could not submit</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        <FieldSet className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend className="text-lg font-semibold text-[#0d2145]">
            About you
          </FieldLegend>
          <FieldGroup className="gap-5">
            <RHFInput<AcceptanceRecordFormInput>
              control={form.control}
              name="contributorName"
              label="Your name (optional)"
              placeholder={
                isLoggedIn
                  ? "Prefilled from your account — edit if you want"
                  : "How you’d like to be credited"
              }
              icon={User}
              autoComplete="name"
              description="Leave blank or submit anonymously below if you prefer not to share your name publicly."
            />

            <RHFCheckbox<AcceptanceRecordFormInput>
              control={form.control}
              name="isAnonymous"
              label="Submit anonymously"
              description="Your name will be hidden in public views (we still store the record for moderation)."
            />
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend className="text-lg font-semibold text-[#0d2145]">
            Application
          </FieldLegend>
          <FieldGroup className="gap-5">
            <FormField
              control={form.control}
              name="universityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    University
                  </FormLabel>
                  <FormDescription>
                    Search the seeded list — run the seed script locally if empty.
                  </FormDescription>
                  <UniversityPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <RHFInput<AcceptanceRecordFormInput>
              control={form.control}
              name="programNameFree"
              label="Program (optional)"
              placeholder="e.g. M.Sc. Computer Science"
            />
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend className="text-lg font-semibold text-[#0d2145]">
            Academic snapshot
          </FieldLegend>
          <div className="grid gap-5 md:grid-cols-2">
            <RHFInput
              control={form.control}
              name="gpa"
              label="GPA (German scale 0–4)"
              placeholder="e.g. 3.2"
              inputMode="decimal"
            />
            <RHFInput
              control={form.control}
              name="percentage"
              label="Percentage (0–100)"
              placeholder="e.g. 72"
              inputMode="decimal"
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <RHFSelect<AcceptanceRecordFormInput>
              control={form.control}
              name="englishTestType"
              label="English proficiency test"
            >
              {ENGLISH_TEST_VALUES.map((v) => (
                <option key={v} value={v}>
                  {ENGLISH_TEST_LABELS[v]}
                </option>
              ))}
            </RHFSelect>
            <RHFInput
              control={form.control}
              name="englishTestScore"
              label="Test score"
              placeholder="e.g. 7.5 (IELTS), 105 (TOEFL)"
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <RHFSelect<AcceptanceRecordFormInput>
              control={form.control}
              name="germanLevel"
              label="German level"
            >
              {germanLevels.map((v) => (
                <option key={v} value={v}>
                  {germanLabels[v]}
                </option>
              ))}
            </RHFSelect>
            <RHFInput
              control={form.control}
              name="workExperienceYrs"
              label="Work experience (years)"
              placeholder="0"
              inputMode="numeric"
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <RHFInput
              control={form.control}
              name="nepalBoard"
              label="Nepal board / institution"
              placeholder="e.g. TU, KU"
            />
            <RHFInput
              control={form.control}
              name="subject"
              label="Subject / field"
              placeholder="e.g. Computer Engineering"
            />
          </div>

          <div className="mt-5">
            <RHFCheckbox<AcceptanceRecordFormInput>
              control={form.control}
              name="hasAPS"
              label="APS completed"
            />
          </div>
        </FieldSet>

        <FieldSet className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <FieldLegend className="text-lg font-semibold text-[#0d2145]">
            Outcome
          </FieldLegend>
          <div className="grid gap-5 md:grid-cols-2">
            <RHFInput
              control={form.control}
              name="intake"
              label="Intake"
              placeholder="e.g. WS2025 or SS2026"
            />
            <RHFSelect<AcceptanceRecordFormInput>
              control={form.control}
              name="result"
              label="Result"
            >
              {admissionResults.map((v) => (
                <option key={v} value={v}>
                  {admissionLabels[v]}
                </option>
              ))}
            </RHFSelect>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <RHFInput
              control={form.control}
              name="appliedDate"
              label="Applied on"
              type="date"
            />
            <RHFInput
              control={form.control}
              name="responseDate"
              label="Response on"
              type="date"
            />
            <RHFInput
              control={form.control}
              name="offerDate"
              label="Offer on"
              type="date"
            />
          </div>

          <div className="mt-5">
            <RHFTextarea<AcceptanceRecordFormInput>
              control={form.control}
              name="notes"
              label="Notes"
              placeholder="Visa timeline, scholarship, course thoughts…"
            />
          </div>
        </FieldSet>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="h-12 w-full rounded-xl bg-[#0d2145] font-semibold text-white shadow-lg shadow-[#0d2145]/20 hover:bg-[#1a3461] sm:w-auto sm:min-w-[200px]"
        >
          {form.formState.isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Submitting…
            </span>
          ) : (
            "Submit acceptance record"
          )}
        </Button>
      </form>
    </Form>
  );
}
