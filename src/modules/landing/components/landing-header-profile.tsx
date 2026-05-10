import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import Link from "next/link";

export default async function LandingHeaderProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      {!session?.user ? (
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "font-bold",
            )}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "font-bold",
            )}
          >
            Get Started
          </Link>
        </div>
      ) : (
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span className="text-sm font-medium">{session.user.name}</span>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "font-bold",
            )}
          >
            Dashboard
          </Link>
        </div>
      )}
    </>
  );
}
