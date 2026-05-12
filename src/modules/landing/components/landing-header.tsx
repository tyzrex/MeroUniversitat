import Image from "next/image";
import Link from "next/link";
import { Container } from "../../shared/components/container";
import LandingHeaderProfile from "./landing-header-profile";
import { LandingMobileNav } from "./landing-mobile-nav";
import { LandingNavLinks } from "./landing-nav-links";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <Container className="flex h-20 items-center gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold text-[#0d2145]"
        >
          <Image
            src="/merounilogo.png"
            alt="MeroUniversität"
            width={62}
            height={62}
            className="size-[62px] object-contain"
            priority
          />
          <span className="hidden text-[20px] font-black tracking-tight md:block">
            Mero<span className="text-[#1238da]">Universität</span>
          </span>
        </Link>

        <div className="flex flex-1 justify-center">
          <LandingNavLinks />
        </div>

        <LandingHeaderProfile />

        <LandingMobileNav />
      </Container>
    </header>
  );
}
