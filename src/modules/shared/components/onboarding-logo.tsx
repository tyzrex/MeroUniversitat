"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export function OnboardingLogo() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <Image
      alt="MeroUniversität"
      className="size-10 object-contain"
      height={40}
      src={isDark ? "/merologowhite.png" : "/merounilogo.png"}
      width={40}
    />
  );
}
