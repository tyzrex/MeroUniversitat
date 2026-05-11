"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoSwitcherProps {
  size?: number;
  className?: string;
}

export function LogoSwitcher({ size = 62, className = "" }: LogoSwitcherProps) {
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
      src={isDark ? "/merologowhite.png" : "/merounilogo.png"}
      alt="MeroUniversität"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
