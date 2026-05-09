import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Container } from "../../shared/components/container";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Universities", href: "/universities" },
  { label: "Programs", href: "/universities" },
  { label: "Community", href: "/community" },
  { label: "Timeline", href: "/dashboard/analytics" },
  { label: "Resources", href: "/community" },
  { label: "About", href: "/" },
] as const;

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95">
      <Container className="flex h-20 items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold text-[#0d2145]"
        >
          <Image
            src="/merounilogo.png"
            alt="MeroUniversität"
            width={60}
            height={60}
            className="size-15 object-contain"
          />
          <span className="text-[20px] font-black tracking-tight">
            Mero<span className="text-blue-500">Universität</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-0.5 lg:flex w-full justify-center">
          {NAV.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-bold text-zinc-800 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth CTAs */}
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
      </Container>
    </header>
  );
}
