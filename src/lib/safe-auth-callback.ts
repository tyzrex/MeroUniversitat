/** Only allow same-origin relative paths after sign-in / sign-up. */
export function safeAuthCallback(raw: string | null): string {
  if (!raw || typeof raw !== "string") return "/dashboard";
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return "/dashboard";
  return t;
}
