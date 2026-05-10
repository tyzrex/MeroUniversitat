"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white px-4">
      <SidebarTrigger className="-ml-1 text-slate-600" />
      <Separator className="mr-1 h-6 bg-border" orientation="vertical" />
      <div className="relative max-w-xl flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
          strokeWidth={1.75}
        />
        <Input
          className="h-10 rounded-lg border-slate-200/90 bg-slate-50/80 pr-4 pl-10 text-sm shadow-none"
          placeholder="Search anything…"
          type="search"
        />
      </div>
    </header>
  );
}
