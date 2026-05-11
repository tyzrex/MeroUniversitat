import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/modules/shared/components/theme-toggle";
import { LogoSwitcher } from "@/modules/shared/components/logo-switcher";

import { Container } from "../../shared/components/container";
import LandingHeaderProfile from "./landing-header-profile-client";
import { LandingNavLinks } from "./landing-nav-links";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <Container className="flex h-20 items-center gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold text-foreground"
        >
          <LogoSwitcher size={62} className="size-[62px]" />
          <span className="hidden text-[20px] font-black tracking-tight md:block">
            Mero<span className="text-primary">Universität</span>
          </span>
        </Link>

        <div className="flex flex-1 justify-center">
          <LandingNavLinks />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <LandingHeaderProfile />
        </div>
      </Container>
    </header>
  );
}
