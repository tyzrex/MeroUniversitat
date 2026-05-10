import { Container } from "@/modules/shared/components/container";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <Container className="max-w-3xl py-2">
      <h1 className="text-3xl font-extrabold tracking-tight text-[#0d2145]">
        Settings
      </h1>
      <p className="text-muted-foreground mt-3 text-base leading-relaxed">
        Manage your account and preferences.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            href="/dashboard/settings/profile"
          >
            <span className="font-semibold text-[#0d2145]">Profile</span>
            <span className="text-muted-foreground mt-2 text-sm">
              Name, bio, academics, and visibility
            </span>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            href="/dashboard/community-data/submissions"
          >
            <span className="font-semibold text-[#0d2145]">
              My contributions
            </span>
            <span className="text-muted-foreground mt-2 text-sm">
              Acceptance records you submitted while signed in
            </span>
          </Link>
        </li>
      </ul>
    </Container>
  );
}
