import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Primary navy actions — consistent with auth CTAs, no drop shadow. */
export function dashboardPrimaryActionClass(className?: string) {
  return cn(
    buttonVariants({ size: "lg" }),
    "h-11 rounded-xl border-0 bg-foreground text-background hover:bg-foreground/90",
    className,
  );
}

/** Secondary outline actions for dashboard headers. */
export function dashboardOutlineActionClass(className?: string) {
  return cn(
    buttonVariants({ variant: "outline", size: "lg" }),
    "h-11 rounded-xl border-border bg-background hover:bg-muted",
    className,
  );
}

/** Indigo filled — distinct from navy primary (e.g. Join team). */
export function dashboardAccentActionClass(className?: string) {
  return cn(
    buttonVariants({ size: "lg" }),
    "h-11 rounded-xl border-0 bg-primary text-primary-foreground shadow-md hover:bg-primary/90",
    className,
  );
}
