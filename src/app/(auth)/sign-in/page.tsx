import { AuthFormPanel } from "@/modules/auth/components/auth-form-panel";
import { AuthMarketingPanel } from "@/modules/auth/components/auth-marketing-panel";
import { SignInForm } from "@/modules/auth/components/sign-in-form";
import { Suspense } from "react";

export const metadata = {
  title: "Sign in",
};

function SignInFallback() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="h-9 w-2/3 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 lg:flex-row">
      <AuthMarketingPanel variant="sign-in" />
      <AuthFormPanel>
        <Suspense fallback={<SignInFallback />}>
          <SignInForm />
        </Suspense>
      </AuthFormPanel>
    </div>
  );
}
