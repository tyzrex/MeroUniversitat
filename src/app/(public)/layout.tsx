import { LandingNavbar } from "@/modules/landing/components/landing-header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LandingNavbar />
      {children}
    </>
  );
}
