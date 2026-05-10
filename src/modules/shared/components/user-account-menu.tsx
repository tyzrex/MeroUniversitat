"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import {
  Building2,
  ChevronDown,
  Database,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type UserAccountMenuUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export function UserAccountMenu({
  user,
  variant = "default",
}: Readonly<{
  user: UserAccountMenuUser;
  variant?: "default" | "compact";
}>) {
  const router = useRouter();

  const summaryClass =
    variant === "compact"
      ? cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "list-none gap-2 font-semibold [&::-webkit-details-marker]:hidden",
        )
      : cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "list-none gap-2 font-bold [&::-webkit-details-marker]:hidden",
        );

  return (
    <details className="group relative">
      <summary
        className={cn(
          summaryClass,
          "flex cursor-pointer items-center rounded-xl outline-none ring-[#0d2145]/10 ring-offset-2 focus-visible:ring-2",
        )}
      >
        {user.image ? (
          <Image
            alt={user.name}
            className="size-8 rounded-full object-cover"
            height={32}
            src={user.image}
            width={32}
          />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="max-w-[140px] truncate">{user.name}</span>
        <ChevronDown className="text-muted-foreground size-4 shrink-0 transition group-open:rotate-180" />
      </summary>
      <div className="border-border bg-card absolute right-0 z-50 mt-2 min-w-[min(100vw-2rem,260px)] rounded-xl border py-2 shadow-lg">
        <div className="border-border text-muted-foreground border-b px-3 pb-2 text-xs">
          <p className="truncate font-medium text-foreground">{user.name}</p>
          <p className="truncate">{user.email}</p>
        </div>
        <nav className="flex flex-col py-1">
          <Link
            className="hover:bg-muted flex items-center gap-2 px-3 py-2.5 text-sm font-medium"
            href="/dashboard"
          >
            <LayoutDashboard className="size-4" strokeWidth={1.75} />
            Dashboard
          </Link>
          <Link
            className="hover:bg-muted flex items-center gap-2 px-3 py-2.5 text-sm font-medium"
            href="/dashboard/community-data"
          >
            <Database className="size-4" strokeWidth={1.75} />
            Community data
          </Link>
          <Link
            className="hover:bg-muted flex items-center gap-2 px-3 py-2.5 text-sm font-medium"
            href="/dashboard/universities"
          >
            <Building2 className="size-4" strokeWidth={1.75} />
            Universities
          </Link>
          <Link
            className="hover:bg-muted flex items-center gap-2 px-3 py-2.5 text-sm font-medium"
            href="/dashboard/settings"
          >
            <Settings className="size-4" strokeWidth={1.75} />
            Settings
          </Link>
        </nav>
        <div className="border-border border-t pt-1">
          <button
            type="button"
            className="hover:bg-muted text-destructive flex w-full items-center gap-2 px-3 py-2.5 text-sm font-semibold"
            onClick={async () => {
              await signOut();
              router.push("/");
              router.refresh();
            }}
          >
            <LogOut className="size-4" strokeWidth={1.75} />
            Log out
          </button>
        </div>
      </div>
    </details>
  );
}
