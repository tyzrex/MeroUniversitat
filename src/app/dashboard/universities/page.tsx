import { Container } from "@/modules/shared/components/container";
import Link from "next/link";

export default function DashboardUniversitiesPage() {
  return (
    <Container className="max-w-3xl py-2">
      <h1 className="text-3xl font-extrabold tracking-tight text-[#0d2145]">
        Universities
      </h1>
      <p className="text-muted-foreground mt-3 text-base leading-relaxed">
        Browse and compare institutions in the public directory. Your application
        tracker will eventually link here from your dashboard.
      </p>
      <Link
        className="mt-8 inline-flex h-11 items-center rounded-xl bg-[#0d2145] px-6 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#1a3461]"
        href="/universities"
      >
        Open university directory
      </Link>
    </Container>
  );
}
