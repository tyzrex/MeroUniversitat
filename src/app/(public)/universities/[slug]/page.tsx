import { getUniversityBySlug } from "@/modules/community/services/university.service";
import { Container } from "@/modules/shared/components/container";
import Link from "next/link";
import { notFound } from "next/navigation";

const DEGREE_LABEL: Record<string, string> = {
  BACHELOR: "Bachelor",
  MASTER: "Master",
  PHD: "PhD",
  DIPLOMA: "Diploma",
  AUSBILDUNG: "Ausbildung",
  OTHER: "Other",
};

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);
  if (!uni) {
    return { title: "University | MeroUniversität" };
  }
  return {
    title: `${uni.name} | MeroUniversität`,
    description: uni.description ?? `Programs and details for ${uni.name} in ${uni.city}.`,
  };
}

export default async function UniversityDetailPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);
  if (!uni) {
    notFound();
  }

  return (
    <main className="from-slate-50 to-white bg-gradient-to-b pb-24 pt-10">
      <Container className="max-w-[1500px]">
        <nav className="text-muted-foreground mb-8 text-sm">
          <Link className="hover:text-foreground font-medium" href="/universities">
            Universities
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{uni.name}</span>
        </nav>

        <header className="border-b border-slate-200/80 pb-10">
          <div className="flex flex-wrap items-start gap-6">
            <div className="bg-primary/10 flex size-20 shrink-0 items-center justify-center rounded-2xl text-3xl font-bold text-[#0d2145]">
              {uni.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-balance text-3xl font-extrabold tracking-tight text-[#0d2145] md:text-4xl">
                {uni.name}
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                {uni.city}
                {uni.state ? `, ${uni.state}` : ""}
              </p>
              {uni.website ? (
                <a
                  className="text-primary mt-3 inline-block text-sm font-semibold underline-offset-4 hover:underline"
                  href={uni.website}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Official website
                </a>
              ) : null}
            </div>
          </div>
          {uni.description ? (
            <p className="text-muted-foreground mt-8 max-w-3xl text-base leading-relaxed">
              {uni.description}
            </p>
          ) : null}
        </header>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-[#0d2145]">Programs</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {uni.programs.length} program
            {uni.programs.length === 1 ? "" : "s"} linked to this institution in our
            database.
          </p>

          {uni.programs.length === 0 ? (
            <p className="text-muted-foreground mt-6 text-sm">
              No programs imported yet for this university.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/80">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-[#0d2145]">
                      Program
                    </th>
                    <th className="px-4 py-3 font-semibold text-[#0d2145]">
                      Degree
                    </th>
                    <th className="px-4 py-3 font-semibold text-[#0d2145]">
                      Subject
                    </th>
                    <th className="px-4 py-3 font-semibold text-[#0d2145]">
                      Language
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uni.programs.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-[#0d2145]">
                        {p.name}
                      </td>
                      <td className="text-muted-foreground px-4 py-3">
                        {DEGREE_LABEL[p.degree] ?? p.degree}
                      </td>
                      <td className="text-muted-foreground px-4 py-3">
                        {p.subject}
                      </td>
                      <td className="text-muted-foreground px-4 py-3">
                        {p.language}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="text-muted-foreground mt-12 text-sm">
          Share how your application went on the{" "}
          <Link
            className="text-primary font-semibold underline-offset-4 hover:underline"
            href="/community-data"
          >
            community acceptance form
          </Link>
          .
        </p>
      </Container>
    </main>
  );
}
