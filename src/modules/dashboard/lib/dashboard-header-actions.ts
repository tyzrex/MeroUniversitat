import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Primary navy actions — consistent with auth CTAs, no drop shadow. */
export function dashboardPrimaryActionClass(className?: string) {
  return cn(
    buttonVariants({ size: "lg" }),
    "h-11 rounded-xl border-0 bg-[#0d2145] text-white hover:bg-[#1a3461]",
    className,
  );
}

/** Secondary outline actions for dashboard headers. */
export function dashboardOutlineActionClass(className?: string) {
  return cn(
    buttonVariants({ variant: "outline", size: "lg" }),
    "h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50",
    className,
  );
}
