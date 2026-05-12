import { AuthFormPanel } from "@/modules/auth/components/auth-form-panel";
import { AuthMarketingPanel } from "@/modules/auth/components/auth-marketing-panel";
import { SignUpForm } from "@/modules/auth/components/sign-up-form";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a MeroUniversität account to start tracking your applications to German universities.",
};

function SignUpFallback() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="h-9 w-2/3 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 lg:flex-row">
      <AuthMarketingPanel variant="sign-up" />
      <AuthFormPanel>
        <Suspense fallback={<SignUpFallback />}>
          <SignUpForm />
        </Suspense>
      </AuthFormPanel>
    </div>
  );
}
