import { db } from "@/lib/db";

const DEFAULT_ID = "default";

export async function getSiteSettings() {
  return db.siteSettings.upsert({
    where: { id: DEFAULT_ID },
    create: { id: DEFAULT_ID },
    update: {},
  });
}

export async function setAcceptanceManualReview(enabled: boolean) {
  await db.siteSettings.upsert({
    where: { id: DEFAULT_ID },
    create: { id: DEFAULT_ID, acceptanceManualReview: enabled },
    update: { acceptanceManualReview: enabled },
  });
}
