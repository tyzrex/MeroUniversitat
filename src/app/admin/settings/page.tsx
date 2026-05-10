import { ManualReviewToggle } from "@/modules/admin/components/manual-review-toggle";
import { requireAdminSession } from "@/modules/admin/server/guards";
import { getSiteSettings } from "@/modules/community/services/site-settings.service";

export const metadata = {
  title: "Site settings | Admin",
};

export default async function AdminSiteSettingsPage() {
  await requireAdminSession();
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[#0d2145] md:text-3xl">
        Site settings
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
        Controls that affect everyone on the platform.
      </p>
      <div className="mt-10 max-w-xl">
        <ManualReviewToggle initial={settings.acceptanceManualReview} />
      </div>
    </div>
  );
}
