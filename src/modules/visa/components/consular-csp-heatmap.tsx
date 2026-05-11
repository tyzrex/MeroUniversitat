import { cn } from "@/lib/utils";

function monthKeys(): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = -6; i <= 6; i++) {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1),
    );
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    out.push(key);
  }
  return out;
}

function labelForMonthKey(key: string): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, 1));
  return d.toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

export function ConsularCspHeatmap({
  buckets,
}: Readonly<{
  buckets: Record<string, number>;
}>) {
  const keys = monthKeys();
  const max = Math.max(1, ...keys.map((k) => buckets[k] ?? 0));

  return (
    <section className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm ring-1 ring-border/60 md:p-8">
      <h2 className="text-lg font-bold text-foreground">
        When did people reach CSP submitted?
      </h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        Density of shared &quot;CSP submitted&quot; dates from users who opted into the
        community timeline (UTC months).
      </p>
      <div
        className="mt-6 grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${keys.length}, minmax(0, 1fr))`,
        }}
      >
        {keys.map((key) => {
          const n = buckets[key] ?? 0;
          const intensity = n / max;
          return (
            <div
              key={key}
              title={`${labelForMonthKey(key)}: ${n} shared`}
              className={cn(
                "flex aspect-square min-h-[36px] flex-col items-center justify-center rounded-lg border text-[10px] font-medium transition-colors",
                intensity === 0 && "border-border/60 bg-muted/40 text-muted-foreground",
                intensity > 0 &&
                  intensity < 0.25 &&
                  "border-emerald-100 bg-emerald-100/80 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-200",
                intensity >= 0.25 &&
                  intensity < 0.5 &&
                  "border-emerald-200 bg-emerald-300/90 text-emerald-950 dark:border-emerald-400/40 dark:bg-emerald-500/30 dark:text-emerald-100",
                intensity >= 0.5 &&
                  intensity < 0.75 &&
                  "border-blue-200 bg-blue-400 text-white dark:border-blue-400/40 dark:bg-blue-500/40 dark:text-blue-50",
                intensity >= 0.75 &&
                  "border-indigo-300 bg-indigo-600 text-white dark:border-indigo-400/50 dark:bg-indigo-500/50 dark:text-indigo-50",
              )}
            >
              <span className="hidden sm:inline">{n}</span>
            </div>
          );
        })}
      </div>
      <div className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-xs">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-3 rounded bg-muted/60" /> Low
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-3 rounded bg-emerald-300" /> Mid
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-3 rounded bg-blue-400" /> High
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-3 rounded bg-indigo-600" /> Peak
        </span>
      </div>
    </section>
  );
}
