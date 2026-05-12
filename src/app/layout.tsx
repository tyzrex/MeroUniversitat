import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "MeroUniversität — Track applications to German universities",
    template: "%s | MeroUniversität",
  },
  description:
    "Track university applications, compare admission outcomes, and connect with peers applying to German universities.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MeroUniversität",
    title: "MeroUniversität — Track applications to German universities",
    description:
      "Track university applications, compare admission outcomes, and connect with peers applying to German universities.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeroUniversität — Track applications to German universities",
    description:
      "Track university applications, compare admission outcomes, and connect with peers applying to German universities.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
