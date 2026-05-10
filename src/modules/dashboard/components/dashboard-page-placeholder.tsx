export function DashboardPagePlaceholder({
  title,
}: Readonly<{
  title: string;
}>) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm">
        Build out this section when you are ready.
      </p>
    </div>
  );
}
