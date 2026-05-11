"use client";

import {
  universityInitialChipClass,
  universityInitialsFromName,
} from "@/modules/applications/lib/university-initials";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type UniversityLogoSize = "xs" | "sm" | "compact" | "md" | "lg";

const box: Record<UniversityLogoSize, string> = {
  xs: "size-10 rounded-xl",
  sm: "size-11 rounded-xl",
  compact: "size-12 rounded-xl",
  md: "size-14 rounded-2xl",
  lg: "size-20 rounded-3xl",
};

const text: Record<UniversityLogoSize, string> = {
  xs: "text-[10px] font-bold",
  sm: "text-xs font-bold",
  compact: "text-xs font-bold tracking-wide",
  md: "text-xl font-bold",
  lg: "text-3xl font-extrabold",
};

const imgSizes: Record<UniversityLogoSize, string> = {
  xs: "40px",
  sm: "44px",
  compact: "48px",
  md: "56px",
  lg: "80px",
};

/** Renders `logoUrl`, then `imageUrl`, then initials from `name`. */
export function UniversityLogo({
  name,
  logoUrl,
  imageUrl,
  size = "sm",
  className,
}: Readonly<{
  name: string;
  logoUrl?: string | null;
  imageUrl?: string | null;
  size?: UniversityLogoSize;
  className?: string;
}>) {
  const src = (logoUrl?.trim() || imageUrl?.trim()) || null;
  const initials = universityInitialsFromName(name);

  if (src) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-muted ring-1 ring-border",
          box[size],
          className,
        )}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes={imgSizes[size]}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center text-white shadow-md shadow-black/10 ring-1 ring-white/25",
        universityInitialChipClass(name),
        box[size],
        text[size],
        className,
      )}
      aria-hidden={!name}
    >
      {initials}
    </div>
  );
}
