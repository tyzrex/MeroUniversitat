"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { UniversityPicker } from "@/modules/community/components/university-picker";
import { createApplicationAction } from "@/modules/applications/actions/create-application.action";
import { updateApplicationAction } from "@/modules/applications/actions/update-application.action";
import { APPLICATION_STATUS_LABELS } from "@/modules/applications/lib/application-status-labels";
import {
  APPLICATION_STATUSES,
  applicationCreateSchema,
  applicationUpdateSchema,
} from "@/modules/applications/schema/application-form-schema";
import {
  RHFInput,
  RHFSelect,
  RHFTextarea,
} from "@/modules/shared/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, NotebookPen, UsersRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const formPanel =
  "rounded-2xl border border-border bg-card p-6 transition-colors focus-within:border-primary/35";

type FormValues = z.input<typeof applicationCreateSchema> & { id?: string };

export function ApplicationForm({
  mode,
  teamOptions,
  defaultValues,
  universityInitialLabel,
  universityInitialLogoUrl,
  mirrorTeammateName,
  lockTeam,
}: Readonly<{
  mode: "create" | "edit";
  teamOptions: { id: string; name: string }[];
  defaultValues: Partial<FormValues>;
  universityInitialLabel?: string;
  universityInitialLogoUrl?: string | null;
  mirrorTeammateName?: string;
  lockTeam?: boolean;
}>) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema =
    mode === "create" ? applicationCreateSchema : applicationUpdateSchema;

  const mergedDefaults = useMemo(
    () =>
      ({
        universityId: "",
        programName: "",
        intakeSemester: "",
        teamId: undefined,
        status: "INTERESTED",
        notes: "",
        deadline: "",
        mirrorsApplicationId: undefined,
        applicationGroupId: undefined,
        ...defaultValues,
      }) satisfies Partial<FormValues>,
    [defaultValues],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: mergedDefaults,
    mode: "onBlur",
  });

  useEffect(() => {
    if (defaultValues.mirrorsApplicationId) {
      form.setValue("mirrorsApplicationId", defaultValues.mirrorsApplicationId);
    }
    if (defaultValues.applicationGroupId) {
      form.setValue("applicationGroupId", defaultValues.applicationGroupId);
    }
    if (mode === "edit" && defaultValues.id) {
      form.setValue("id", defaultValues.id);
    }
  }, [
    defaultValues.applicationGroupId,
    defaultValues.id,
    defaultValues.mirrorsApplicationId,
    form,
    mode,
  ]);

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const payload =
      mode === "create"
        ? {
            ...values,
            mirrorsApplicationId:
              values.mirrorsApplicationId ??
              defaultValues.mirrorsApplicationId,
            applicationGroupId:
              values.applicationGroupId ??
              defaultValues.applicationGroupId,
          }
        : values;

    const res =
      mode === "create"
        ? await createApplicationAction(payload)
        : await updateApplicationAction(payload);

    if (!res.ok) {
      setSubmitError(res.error);
      return;
    }
    router.push("/dashboard/applications");
    router.refresh();
  }

  const panelClass = formPanel;

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:p-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {mirrorTeammateName ? (
          <Alert className="rounded-xl border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            <AlertTitle>Linking to a teammate</AlertTitle>
            <AlertDescription>
              You&apos;re adding your own program row alongside{" "}
              <strong>{mirrorTeammateName}</strong>&apos;s application on this team.
              Choose your program / subject below.
            </AlertDescription>
          </Alert>
        ) : null}

        {submitError ? (
          <Alert variant="destructive" className="rounded-xl">
            <AlertTitle>Could not save</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid w-full min-w-0 gap-6 xl:grid-cols-2 xl:items-start">
          <FieldSet className={panelClass}>
            <div className="mb-3 flex items-center gap-3 text-lg font-bold text-foreground">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-5" strokeWidth={1.8} />
              </span>
              University & program
            </div>
            <FieldGroup className="gap-5">
              <FormField
                control={form.control}
                name="universityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Institution
                    </FormLabel>
                    <FormDescription>
                      Search the directory — pick the university you applied or plan to
                      apply to.
                    </FormDescription>
                    <FormControl>
                      <UniversityPicker
                        initialLabel={universityInitialLabel}
                        initialLogoUrl={universityInitialLogoUrl}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <RHFInput<FormValues>
                  control={form.control}
                  name="programName"
                  label="Program / subject"
                  placeholder="e.g. M.Sc. Computer Science"
                />
                <RHFInput<FormValues>
                  control={form.control}
                  name="intakeSemester"
                  label="Target intake"
                  placeholder="e.g. WS2026"
                />
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet className={panelClass}>
            <div className="mb-3 flex items-center gap-3 text-lg font-bold text-foreground">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UsersRound className="size-5" strokeWidth={1.8} />
              </span>
              Team & pipeline
            </div>
            <FieldGroup className="gap-5">
              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Team (optional)
                    </FormLabel>
                    <FormDescription>
                      Attach to a team you belong to for shared Kanban. Leave empty for
                      a solo-only row.
                    </FormDescription>
                    <FormControl>
                      <select
                        className="border-input bg-background ring-offset-background flex h-11 w-full rounded-xl border px-4 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={Boolean(lockTeam)}
                        value={
                          typeof field.value === "string" ? field.value : ""
                        }
                        onChange={(e) =>
                          field.onChange(e.target.value || undefined)
                        }
                      >
                        <option value="">Solo (no team)</option>
                        {teamOptions.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <RHFSelect<FormValues>
                  control={form.control}
                  name="status"
                  label="Pipeline status"
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {APPLICATION_STATUS_LABELS[s]}
                    </option>
                  ))}
                </RHFSelect>
                <RHFInput<FormValues>
                  control={form.control}
                  name="deadline"
                  label="Deadline (optional)"
                  type="date"
                />
              </div>
            </FieldGroup>
          </FieldSet>
        </div>

        <FieldSet className={panelClass}>
          <div className="mb-3 flex items-center gap-3 text-lg font-bold text-foreground">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <NotebookPen className="size-5" strokeWidth={1.8} />
            </span>
            Notes
          </div>
          <FieldGroup className="gap-5">
            <RHFTextarea<FormValues>
              control={form.control}
              name="notes"
              label="Private notes"
              placeholder="Essays, portal links, reminders…"
            />
          </FieldGroup>
        </FieldSet>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <Link
            className="text-muted-foreground text-sm font-medium hover:text-foreground"
            href="/dashboard/applications"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="min-w-[160px] rounded-xl bg-foreground text-background hover:bg-foreground/90"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === "create" ? (
              "Create application"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
