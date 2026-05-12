"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authClient, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NAV } from "./landing-nav-links";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LandingMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="lg:hidden"
        render={
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="size-6" />
          </Button>
        }
      />
      <SheetContent side="right" className="flex w-[300px] flex-col p-0">
        <div className="flex items-center gap-2 border-b px-4 py-4">
          <Image
            src="/merounilogo.png"
            alt="MeroUniversität"
            width={40}
            height={40}
            className="size-10 object-contain"
          />
          <span className="text-base font-black tracking-tight text-[#0d2145]">
            Mero<span className="text-[#1238da]">Universität</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-2 py-4">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </p>
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-100",
                  active ? "bg-blue-50 text-[#1238da]" : "text-slate-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t px-2 py-4">
          {!user ? (
            <div className="flex flex-col gap-2 px-3">
              <p className="pb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Account
              </p>
              <Link
                href="/sign-in"
                onClick={close}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full font-bold",
                )}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                onClick={close}
                className={cn(
                  buttonVariants({ variant: "gradient", size: "lg" }),
                  "w-full font-bold",
                )}
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-3">
              <p className="pb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Account
              </p>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
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
                    {user.name?.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={close}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
              >
                <User className="size-4" strokeWidth={1.75} />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                  router.refresh();
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="size-4" strokeWidth={1.75} />
                Log out
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
