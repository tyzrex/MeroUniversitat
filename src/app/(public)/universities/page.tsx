import { listUniversitiesDirectory } from "@/modules/community/services/university.service";
import { Container } from "@/modules/shared/components/container";
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
    <main className="from-slate-50 to-white bg-gradient-to-b py-12 pb-24">
      <Container className="max-w-[1500px]">
        <header className="mb-10">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-[#0d2145] md:text-4xl">
            Universities in Germany
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
            Browse institutions from our directory. Search by name or city — seed
            data locally if the list is empty.
          </p>
        </header>

        <form
          className="mb-10 flex max-w-xl flex-wrap gap-3"
          action="/universities"
          method="get"
        >
          <input
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring shadow-xs h-11 min-w-[200px] flex-1 rounded-xl border px-4 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            defaultValue={q}
            name="q"
            placeholder="Search name or city…"
            type="search"
          />
          <button
            className="h-11 shrink-0 rounded-xl bg-[#0d2145] px-6 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#1a3461]"
            type="submit"
          >
            Search
          </button>
        </form>

        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {universities.map((u) => (
            <li key={u.id}>
              <Link
                className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/5 transition-shadow hover:shadow-md"
                href={`/universities/${u.slug}`}
              >
                <div className="flex gap-4">
                  <div className="bg-primary/10 flex size-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-[#0d2145]">
                    {u.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0d2145]">{u.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {u.city}
                      {u.state ? `, ${u.state}` : ""}
                    </p>
                  </div>
                </div>
                {u.description ? (
                  <p className="text-muted-foreground mt-3 line-clamp-2 text-sm leading-relaxed">
                    {u.description}
                  </p>
                ) : null}
                <p className="text-muted-foreground mt-4 text-xs font-medium">
                  {u._count.programs} program
                  {u._count.programs === 1 ? "" : "s"}
                  {u.ranking != null ? ` · Rank #${u.ranking}` : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {universities.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No universities match “{q}”. Try another search or run{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
              npm run seed:universities
            </code>
            .
          </p>
        ) : null}
      </Container>
    </main>
  );
}
