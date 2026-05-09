import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Container } from "@/modules/shared/components/container";
import { Badge } from "@/components/ui/badge";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230d2145' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Badge
              variant="outline"
              className="mb-6 gap-1.5 rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
            >
              <span className="size-1.5 rounded-full bg-blue-500" />
              Built for Nepali students. By the community. 🇳🇵
            </Badge>

            <h1 className="text-balance text-4xl font-extrabold leading-[1.12] tracking-tight text-[#0d2145] md:text-5xl lg:text-[3.75rem]">
              Germany applications made{" "}
              <span className="text-primary">transparent</span> for Nepali
              students.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
              Search universities, explore real student profiles, track your
              applications, get timelines and collaborate with your team — all
              in one platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ size: "xl", variant: "gradient" }),
                  "font-bold px-6",
                )}
              >
                Start Your German Mission →
              </Link>
              <Link
                href="/universities"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xl" }),
                )}
              >
                Explore Universities
                <Search className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right: Hero illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="image-wrap">
              <Image
                src="/heroimage.webp"
                alt="Nepali students heading to Germany"
                width={700}
                height={700}
                className="h-full w-full object-cover "
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
