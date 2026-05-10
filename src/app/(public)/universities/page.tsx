import { Container } from "@/modules/shared/components/container";
import Link from "next/link";

export default function PublicUniversitiesPage() {
  return (
    <main className="bg-slate-50 py-16">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0d2145]">
          Universities
        </h1>
        <p className="text-muted-foreground mt-3 text-base">
          A browsable directory is coming soon. For now you can track universities in
          your{" "}
          <Link
            className="text-primary font-semibold underline-offset-4 hover:underline"
            href="/dashboard/universities"
          >
            dashboard
          </Link>{" "}
          after signing in.
        </p>
      </Container>
    </main>
  );
}
