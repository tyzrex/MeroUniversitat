"use client";

import { cn } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS } from "@/modules/applications/lib/application-status-labels";
import { APPLICATION_STATUSES } from "@/modules/applications/schema/application-form-schema";
import { Filter, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

type TeamOption = { id: string; name: string };

export function ApplicationsFilterBar({
  teamOptions,
}: Readonly<{
  teamOptions: TeamOption[];
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentTeam = searchParams.get("team") ?? "";
  const currentStatus = searchParams.get("status") ?? "";
  const currentSearch = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  const hasFilters = currentTeam || currentStatus || currentSearch;

  const applyFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`/dashboard/applications?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyFilter("q", searchInput.trim());
  }

  function clearAll() {
    setSearchInput("");
    startTransition(() => {
      router.push("/dashboard/applications");
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.03]">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Filter className="size-4" strokeWidth={1.8} />
          Filters
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" strokeWidth={1.8} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search university…"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#4a52c8]/40 focus:bg-white focus:ring-2 focus:ring-[#4a52c8]/10"
          />
        </form>

        {/* Team filter */}
        {teamOptions.length > 0 ? (
          <select
            value={currentTeam}
            onChange={(e) => applyFilter("team", e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-[#4a52c8]/40 focus:ring-2 focus:ring-[#4a52c8]/10"
          >
            <option value="">All teams</option>
            <option value="solo">Solo only</option>
            {teamOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        ) : null}

        {/* Status filter */}
        <select
          value={currentStatus}
          onChange={(e) => applyFilter("status", e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-[#4a52c8]/40 focus:ring-2 focus:ring-[#4a52c8]/10"
        >
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {APPLICATION_STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        {/* Clear */}
        {hasFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700",
            )}
          >
            <X className="size-3.5" strokeWidth={2} />
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
