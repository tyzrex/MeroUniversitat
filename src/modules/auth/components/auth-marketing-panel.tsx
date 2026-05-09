import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

type Variant = "sign-in" | "sign-up";

const BULLETS_SIGN_IN = [
  "Thousands of real acceptance outcomes shared by the community",
  "Typical review timelines by university and pathway",
  "Kanban tracker for every application stage",
  "Team workspaces when you apply with friends",
] as const;

const BULLETS_SIGN_UP = [
  "Free to use — no hidden costs, ever",
  "Community-driven data from real Nepali students",
  "Track applications across multiple universities",
  "Collaborate with your team in shared workspaces",
] as const;

export function AuthMarketingPanel({ variant }: { variant: Variant }) {
  const bullets = variant === "sign-in" ? BULLETS_SIGN_IN : BULLETS_SIGN_UP;

  return (
    <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-[#0d2145] text-white">
      {/* Hero illustration — bottom aligned */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient overlay on top of image */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d2145]/95 via-[#0d2145]/75 to-[#0d2145]/90 z-10" />
        <Image
          src="/heroimage.png"
          alt=""
          fill
          className="object-cover object-bottom opacity-60"
          priority
        />
      </div>

      {/* German flag accent at bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-black from-33% via-[#DD0000] via-66% to-[#FFCE00] z-20"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full px-10 py-12 md:px-12 lg:px-14">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex max-w-fit items-center gap-3 font-semibold text-white"
        >
          <Image
            src="/logo.png"
            alt="MeroUniversität"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-lg font-bold tracking-tight">
            MeroUniversität
          </span>
        </Link>

        {/* Headline */}
        <div className="mt-auto pb-4">
          {variant === "sign-in" ? (
            <>
              <h1 className="max-w-md text-balance text-4xl font-extrabold leading-[1.12] tracking-tight md:text-[2.6rem]">
                Your German dream,{" "}
                <span className="text-[#60a5fa]">organized.</span>
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
                Track applications, explore anonymised acceptance data, and plan
                timelines — built for Nepali students heading to Germany.
              </p>
            </>
          ) : (
            <>
              <h1 className="max-w-md text-balance text-4xl font-extrabold leading-[1.12] tracking-tight md:text-[2.6rem]">
                Start your{" "}
                <span className="text-[#60a5fa]">German mission.</span>
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
                Free to use. Community-driven data and tools — without
                consultancy noise.
              </p>
            </>
          )}

          <ul className="mt-6 flex flex-col gap-3">
            {bullets.map((text) => (
              <li key={text} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#34d399]" />
                <span className="text-white/80">{text}</span>
              </li>
            ))}
          </ul>

          {variant === "sign-up" && (
            <div className="mt-6 max-w-sm rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-white/50">
                Students from
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["TU Nepal", "KU", "Purbanchal", "Pokhara Uni", "PU"].map(
                  (u) => (
                    <span
                      key={u}
                      className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/85 ring-1 ring-white/10"
                    >
                      {u}
                    </span>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
