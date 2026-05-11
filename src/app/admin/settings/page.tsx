import { Badge } from "@/components/ui/badge";
import { ManualReviewToggle } from "@/modules/admin/components/manual-review-toggle";
import { requireAdminSession } from "@/modules/admin/server/guards";
import { getSiteSettings } from "@/modules/community/services/site-settings.service";
import { Settings, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Site settings | Admin",
};

export default async function AdminSiteSettingsPage() {
  await requireAdminSession();
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-border/40">
        <div className="relative bg-gradient-to-br from-[#0d2145] via-[#253980] to-[#4a52c8] p-7 text-white md:p-10">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_12%_18%,white_0,transparent_24%),radial-gradient(circle_at_88%_6%,white_0,transparent_22%)]" />
          <div className="relative max-w-4xl">
            <Badge className="mb-4 h-7 rounded-full border-white/20 bg-white/15 px-3 text-white backdrop-blur">
              Admin only
            </Badge>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
              Site settings
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/78">
              Manage global controls that affect moderation and public community
              data across MeroUniversität.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-3xl border border-border bg-card p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-border/40">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Settings className="size-6" strokeWidth={1.8} />
          </div>
          <h2 className="mt-5 text-lg font-bold text-foreground">
            Moderation controls
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Keep manual review enabled while the community data feature is new.
            You can switch it off when you are comfortable publishing valid
            records immediately.
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-muted p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldCheck
                className="size-4 text-emerald-600"
                strokeWidth={1.8}
              />
              Current behavior
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              New records are{" "}
              {settings.acceptanceManualReview
                ? "held for approval"
                : "published automatically"}
              .
            </p>
          </div>
        </aside>

        <ManualReviewToggle initial={settings.acceptanceManualReview} />
      </div>
    </div>
  );
}
