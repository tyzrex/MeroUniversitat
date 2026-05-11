"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/modules/shared/components/form-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Mail, Lock, Loader2 } from "lucide-react";
import { safeAuthCallback } from "@/lib/safe-auth-callback";
import { signInSchema, SignInValues } from "@/modules/auth/schema/auth-schema";
import { GoogleOAuthButton } from "./google-oauth-button";
import { signIn } from "@/lib/auth-client";

export function SignInForm() {
  const searchParams = useSearchParams();
  const callbackParam = searchParams.get("callbackUrl");
  const callbackURL = safeAuthCallback(callbackParam);
  const qs = searchParams.toString();
  const signUpHref = qs ? `/sign-up?${qs}` : "/sign-up";

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={signUpHref}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <GoogleOAuthButton callbackURL={callbackURL} />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            or continue with email
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {form.formState.errors.root?.message ? (
          <Alert variant="destructive" className="rounded-xl">
            <AlertTitle>Sign in failed</AlertTitle>
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        ) : null}

        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(async (data) => {
            form.clearErrors("root");
            const res = await signIn.email({ ...data, callbackURL });
            if (res.error) {
              form.setError("root", {
                message: res.error.message || "Sign in failed",
              });
            }
          })}
        >
          <FieldGroup className="gap-4">
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel
                htmlFor="sign-in-email"
                className="text-sm font-semibold text-foreground"
              >
                Email address
              </FieldLabel>
              <FormInput
                icon={Mail}
                id="sign-in-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.password}>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel
                  htmlFor="sign-in-password"
                  className="text-sm font-semibold text-foreground"
                >
                  Password
                </FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormInput
                icon={Lock}
                id="sign-in-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            size="lg"
            className="mt-2 h-11 w-full rounded-xl bg-foreground font-semibold text-background shadow-lg shadow-black/10 hover:bg-foreground/90 disabled:opacity-60 dark:shadow-black/40"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By signing in you agree to our{" "}
          <Link
            href="/terms"
            className="text-muted-foreground underline-offset-4 hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-muted-foreground underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </>
  );
}
