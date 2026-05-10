import { auth } from "@/lib/auth";
import { LandingFooter } from "@/modules/landing/components/landing-footer";
import { LandingNavbar } from "@/modules/landing/components/landing-header";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    // redirect("/dashboard");
  }
  return (
    <>
      {/* <LandingNavbar /> */}
      {children}
      {/* <LandingFooter /> */}
    </>
  );
}
