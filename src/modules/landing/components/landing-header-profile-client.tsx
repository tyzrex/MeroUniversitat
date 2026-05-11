"use client";
import { buttonVariants } from "@/components/ui/button";
import { UserAccountMenu } from "@/modules/shared/components/user-account-menu";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function LandingHeaderProfile() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href="/sign-in"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "font-bold")}
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className={cn(buttonVariants({ variant: "default", size: "lg" }), "font-bold")}
      >
        Get Started
      </Link>
    </div>
  );
}
