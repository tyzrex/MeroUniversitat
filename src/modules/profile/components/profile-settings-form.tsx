"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { updateProfileSettingsAction } from "@/modules/profile/actions/update-profile-settings.action";
import {
  profileSettingsSchema,
  PROFILE_GERMAN_LEVELS,
  type ProfileSettingsInput,
} from "@/modules/profile/schema/profile-settings-schema";
import {
  ENGLISH_TEST_LABELS,
  ENGLISH_TEST_VALUES,
} from "@/modules/community/constants/english-test";
import {
  RHFCheckbox,
  RHFInput,
  RHFSelect,
  RHFTextarea,
} from "@/modules/shared/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const germanLabels: Record<(typeof PROFILE_GERMAN_LEVELS)[number], string> = {
  NONE: "None",
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
  C1: "C1",
  C2: "C2",
};

const fieldPanel =
  "rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5 md:p-8";

export function ProfileSettingsForm({
  defaultValues,
}: Readonly<{
  defaultValues: ProfileSettingsInput;
}>) {
  const form = useForm<ProfileSettingsInput>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues,
    mode: "onBlur",
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onSubmit(values: ProfileSettingsInput) {
    setSubmitError(null);
    setSaved(false);
    const result = await updateProfileSettingsAction(values);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    setSaved(true);
  }

  return (
    <Form {...form}>
      <form
        className="mt-10 flex w-full max-w-none flex-col gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {saved ? (
          <Alert className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-950">
            <AlertTitle>Profile saved</AlertTitle>
            <AlertDescription>Your details were updated.</AlertDescription>
          </Alert>
        ) : null}

        {submitError ? (
          <Alert variant="destructive" className="rounded-xl">
            <AlertTitle>Could not save</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-start">
          <FieldSet className={fieldPanel}>
            <FieldLegend className="text-lg font-semibold text-[#0d2145]">
              Account
            </FieldLegend>
            <FieldGroup className="gap-5">
              <RHFInput<ProfileSettingsInput>
                control={form.control}
                name="name"
                label="Display name"
                icon={User}
                autoComplete="name"
              />
              <RHFTextarea<ProfileSettingsInput>
                control={form.control}
                name="bio"
                label="Bio"
                placeholder="A short intro visible on your public profile when enabled."
              />
              <RHFCheckbox<ProfileSettingsInput>
                control={form.control}
                name="isPublic"
                label="Show academic profile to other signed-in users"
                description="You can still keep your application data private in other areas of the app."
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet className={fieldPanel}>
            <FieldLegend className="text-lg font-semibold text-[#0d2145]">
              Academics
            </FieldLegend>
            <div className="grid gap-5 sm:grid-cols-2">
              <RHFInput
                control={form.control}
                name="gpa"
                label="GPA (0–4 German scale)"
                inputMode="decimal"
              />
              <RHFInput
                control={form.control}
                name="percentage"
                label="Percentage (0–100)"
                inputMode="decimal"
              />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <RHFSelect<ProfileSettingsInput>
                control={form.control}
                name="englishTestType"
                label="English test"
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
                label="English score"
              />
            </div>
            <div className="mt-5">
              <RHFSelect<ProfileSettingsInput>
                control={form.control}
                name="germanLevel"
                label="German level"
              >
                {PROFILE_GERMAN_LEVELS.map((v) => (
                  <option key={v} value={v}>
                    {germanLabels[v]}
                  </option>
                ))}
              </RHFSelect>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <RHFInput
                control={form.control}
                name="nepalUniversity"
                label="Home university / college"
              />
              <RHFInput
                control={form.control}
                name="nepalBoard"
                label="Board / institution"
              />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <RHFInput
                control={form.control}
                name="subject"
                label="Subject / field"
              />
              <RHFInput
                control={form.control}
                name="bachelorProgram"
                label="Bachelor program"
              />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <RHFInput
                control={form.control}
                name="workExperienceYrs"
                label="Work experience (years)"
                inputMode="numeric"
              />
              <RHFInput
                control={form.control}
                name="targetIntake"
                label="Target intake"
                placeholder="e.g. WS2026"
              />
            </div>
          </FieldSet>
        </div>

        <div className="flex justify-end border-t border-slate-200/80 pt-6">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="h-12 min-w-[180px] rounded-xl bg-[#0d2145] font-semibold text-white shadow-lg shadow-[#0d2145]/20 hover:bg-[#1a3461]"
          >
            {form.formState.isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </span>
            ) : (
              "Save profile"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
