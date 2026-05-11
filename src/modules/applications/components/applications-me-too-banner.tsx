export function ApplicationsMeTooBanner() {
  return (
    <section
      aria-labelledby="me-too-heading"
      className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-muted/70 via-background to-background p-6 md:p-8"
    >
      <div className="relative z-[1] max-w-[min(100%,42rem)]">
        <h2
          id="me-too-heading"
          className="text-lg font-extrabold tracking-tight text-foreground md:text-xl"
        >
          What is &quot;Me too&quot;?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
          When a teammate adds an application to your shared team, you can use{" "}
          <strong className="font-semibold text-orange-700">Me too</strong> to
          create your own linked row for the same university—without retyping
          everything. Your progress and documents stay separate; the team still
          sees who applied where.
        </p>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-4 hidden h-28 w-36 rounded-2xl bg-primary/10 opacity-90 shadow-inner md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 top-8 hidden size-24 rounded-full bg-primary/15 blur-2xl md:block"
      />
    </section>
  );
}
