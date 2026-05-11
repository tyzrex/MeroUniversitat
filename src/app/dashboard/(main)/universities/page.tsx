import { buttonVariants } from "@/components/ui/button";
import { UniversitiesDirectoryHero } from "@/modules/community/components/community-data-hero";
import { cn } from "@/lib/utils";
import { UniversityLogo } from "@/modules/community/components/university-logo";
import { listUniversitiesDirectory } from "@/modules/community/services/university.service";
import { Container } from "@/modules/shared/components/container";
import { ArrowRight, MapPin, Search } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Universities | MeroUniversität",
};

export default async function DashboardUniversitiesPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string }>;
}>) {
  const q = (await searchParams).q ?? "";
  const universities = await listUniversitiesDirectory({
    query: q,
    limit: 72,
  });

  return (
    <div className="flex flex-col gap-8">
      <UniversitiesDirectoryHero
        resultCount={universities.length}
        hasSearchQuery={q.trim().length > 0}
      />

      <form
        className="rounded-3xl border border-border bg-card p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-border/40 sm:flex sm:items-center sm:gap-3"
        action="/dashboard/universities"
        method="get"
      >
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.8}
          />
          <input
            className="border-input bg-muted/60 ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-12 w-full rounded-2xl border px-4 pl-12 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            defaultValue={q}
            name="q"
            placeholder="Search name or city…"
            type="search"
          />
        </div>
        <button
          className="mt-3 h-12 w-full rounded-2xl bg-foreground px-6 text-sm font-bold text-background shadow-lg shadow-black/10 transition-colors hover:bg-foreground/90 dark:shadow-black/40 sm:mt-0 sm:w-auto"
          type="submit"
        >
          Search
        </button>
      </form>

      {universities.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-dashed border-border bg-card p-10 text-center ">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Search className="size-7" strokeWidth={1.8} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-foreground">
            No universities found
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-6">
            No universities match “{q}”. Try another search or run the seed
            script locally.
          </p>
        </section>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {universities.map((u) => (
            <li key={u.id}>
              <Link
                className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-border/40 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
                href={`/dashboard/universities/${u.slug}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <UniversityLogo
                      name={u.name}
                      logoUrl={u.logoUrl}
                      imageUrl={u.imageUrl}
                      size="md"
                      className="shadow-lg shadow-[#0d2145]/15"
                    />
                    <div className="min-w-0">
                      <p className="font-bold leading-6 text-foreground transition-colors group-hover:text-primary">
                        {u.name}
                      </p>
                      <p className="text-muted-foreground mt-1 inline-flex items-center gap-1.5 text-sm">
                        <MapPin className="size-4" strokeWidth={1.8} />
                        {u.city}
                        {u.state ? `, ${u.state}` : ""}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    strokeWidth={1.9}
                  />
                </div>

                {u.description ? (
                  <p className="text-muted-foreground mt-5 line-clamp-3 text-sm leading-6">
                    {u.description}
                  </p>
                ) : null}

                <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-5 text-xs font-bold text-muted-foreground">
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 text-violet-700 dark:text-violet-300">
                    {u._count.applications} application
                    {u._count.applications === 1 ? "" : "s"} tracked
                  </span>
                  {u.ranking != null ? (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                      Rank #{u.ranking}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 text-center">
        <Link
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 rounded-xl bg-background font-semibold",
          )}
          href="/dashboard/community-data"
        >
          Share your university outcome
        </Link>
      </div>
    </div>
  );
}
