import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Container } from "@/modules/shared/components/container";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

type Props = Readonly<{
  title: string;
  description?: string;
}>;

export function DashboardPagePlaceholder({
  description = "This workspace is ready for the next feature build-out.",
  title,
}: Props) {
  return (
    <Container className="max-w-[1500px] py-2">
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.03]">
        <div className="relative bg-gradient-to-br from-[#0d2145] via-[#263b8b] to-[#4a52c8] p-7 text-white md:p-10">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_12%_18%,white_0,transparent_24%),radial-gradient(circle_at_88%_6%,white_0,transparent_22%)]" />
          <div className="relative max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-100">
              <Sparkles className="size-4" strokeWidth={1.8} />
              Coming soon
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/78">
              {description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 rounded-xl bg-white text-[#0d2145] shadow-lg shadow-black/10 hover:bg-white/90",
                )}
                href="/dashboard/community-data"
              >
                Share acceptance data
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 rounded-xl border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#0d2145]",
                )}
                href="/dashboard"
              >
                Back to overview
                <ArrowRight className="size-4" strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
