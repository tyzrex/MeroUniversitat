"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth-client";
import {
  signUpSchema,
  type SignUpValues,
} from "@/modules/auth/schema/auth-schema";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/modules/shared/components/form-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { GoogleOAuthButton } from "@/modules/auth/components/google-oauth-button";
import { safeAuthCallback } from "@/lib/safe-auth-callback";

export function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackURL = safeAuthCallback(searchParams.get("callbackUrl"));
  const qs = searchParams.toString();
  const signInHref = qs ? `/sign-in?${qs}` : "/sign-in";

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const router = useRouter();

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#0d2145]">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href={signInHref}
            className="font-semibold text-[#1d4ed8] hover:text-[#1e40af] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <GoogleOAuthButton callbackURL={callbackURL} />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            or continue with email
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {form.formState.errors.root?.message ? (
          <Alert variant="destructive" className="rounded-xl">
            <AlertTitle>Sign up failed</AlertTitle>
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        ) : null}

        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(async (data) => {
            form.clearErrors("root");
            const res = await signUp.email(
              {
                email: data.email,
                password: data.password,
                name: data.name,
                callbackURL,
              },
              {
                onSuccess: () => {
                  router.push("/dashboard");
                },
              },
            );
            if (res.error) {
              form.setError("root", {
                message: res.error.message || "Sign up failed",
              });
            }
          })}
        >
          <FieldGroup className="gap-4">
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel
                htmlFor="sign-up-name"
                className="text-sm font-semibold text-slate-700"
              >
                Full name
              </FieldLabel>
              <FormInput
                icon={User}
                id="sign-up-name"
                autoComplete="name"
                placeholder="Your name"
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel
                htmlFor="sign-up-email"
                className="text-sm font-semibold text-slate-700"
              >
                Email address
              </FieldLabel>
              <FormInput
                icon={Mail}
                id="sign-up-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.password}>
              <FieldLabel
                htmlFor="sign-up-password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </FieldLabel>
              <FormInput
                icon={Lock}
                id="sign-up-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            size="lg"
            className="mt-2 h-11 w-full rounded-xl bg-[#0d2145] font-semibold text-white shadow-lg shadow-[#0d2145]/20 hover:bg-[#1a3461] disabled:opacity-60"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Creating account…
              </span>
            ) : (
              "Create free account"
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400">
          By signing up you agree to our{" "}
          <Link
            href="/terms"
            className="text-slate-600 underline-offset-4 hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-slate-600 underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </>
  );
}
