import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { listUniversitiesDirectory } from "@/modules/community/services/university.service";
import { Container } from "@/modules/shared/components/container";
import { ArrowRight, Building2, MapPin, Search } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Universities | MeroUniversität",
};

export default async function UniversitiesDirectoryPage({
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
    <main className="from-slate-50 via-white to-slate-50/80 bg-gradient-to-b py-10 pb-24">
      <Container className="max-w-[1500px]">
        <header className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.03]">
          <div className="relative bg-gradient-to-br from-[#0d2145] via-[#263b8b] to-[#4a52c8] p-7 text-white md:p-10">
            <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_12%_18%,white_0,transparent_24%),radial-gradient(circle_at_88%_6%,white_0,transparent_22%)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-100">
                  <Building2 className="size-4" strokeWidth={1.8} />
                  University directory
                </p>
                <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                  Find universities in Germany
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/78 md:text-lg">
                  Search by university name, city, or state and open polished
                  profiles with linked programs and community contribution
                  paths.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                  Showing
                </p>
                <p className="mt-1 text-3xl font-extrabold">
                  {universities.length}
                </p>
                <p className="text-sm text-white/70">universities</p>
              </div>
            </div>
          </div>
        </header>

        <form
          className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] sm:flex sm:items-center sm:gap-3"
          action="/universities"
          method="get"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400"
              strokeWidth={1.8}
            />
            <input
              className="border-input bg-slate-50/80 ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-12 w-full rounded-2xl border px-4 pl-12 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              defaultValue={q}
              name="q"
              placeholder="Search name, city, or state…"
              type="search"
            />
          </div>
          <button
            className="mt-3 h-12 w-full rounded-2xl bg-[#0d2145] px-6 text-sm font-bold text-white shadow-lg shadow-[#0d2145]/15 transition-colors hover:bg-[#1a3461] sm:mt-0 sm:w-auto"
            type="submit"
          >
            Search
          </button>
        </form>

        {universities.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
              <Search className="size-7" strokeWidth={1.8} />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#0d2145]">
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
                  className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
                  href={`/universities/${u.slug}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#0d2145] text-xl font-bold text-white shadow-lg shadow-[#0d2145]/15">
                        {u.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold leading-6 text-[#0d2145] transition-colors group-hover:text-[#4a52c8]">
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
                      className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#4a52c8]"
                      strokeWidth={1.9}
                    />
                  </div>

                  {u.description ? (
                    <p className="text-muted-foreground mt-5 line-clamp-3 text-sm leading-6">
                      {u.description}
                    </p>
                  ) : null}

                  <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-5 text-xs font-bold text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {u._count.programs} program
                      {u._count.programs === 1 ? "" : "s"}
                    </span>
                    {u.ranking != null ? (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[#4a52c8]">
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
              "h-11 rounded-xl bg-white font-semibold",
            )}
            href="/community-data"
          >
            Share your university outcome
          </Link>
        </div>
      </Container>
    </main>
  );
}
