"use client";

import { UniversityLogo } from "@/modules/community/components/university-logo";
import { FormInput } from "@/modules/shared/components/form-input";
import { searchUniversitiesAction } from "@/modules/community/actions/search-universities.action";
import { Badge } from "@/components/ui/badge";
import { Building2, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Uni = {
  id: string;
  name: string;
  city: string;
  logoUrl: string | null;
  imageUrl: string | null;
  verificationStatus: "APPROVED" | "PENDING" | "REJECTED";
};

type PickMeta = {
  label: string;
  logoSrc: string | null;
  verificationStatus: "APPROVED" | "PENDING" | "REJECTED";
};

export function UniversityPicker({
  value,
  onChange,
  initialLabel,
  initialLogoUrl,
  initialVerificationStatus,
}: Readonly<{
  value: string;
  onChange: (id: string) => void;
  /** When `value` is preset (e.g. edit page), show this instead of “University selected”. */
  initialLabel?: string;
  /** Resolved logo URL when `value` is preset (logo preferred over hero image in callers). */
  initialLogoUrl?: string | null;
  initialVerificationStatus?: "APPROVED" | "PENDING" | "REJECTED";
}>) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<PickMeta | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Uni[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const displayLabel = value
    ? (picked?.label ?? initialLabel ?? "University selected")
    : "";

  const logoSrc =
    value != null && value !== ""
      ? (picked?.logoSrc ?? initialLogoUrl ?? null)
      : null;

  const verificationStatus =
    value != null && value !== ""
      ? (picked?.verificationStatus ?? initialVerificationStatus ?? null)
      : null;

  const nameForLogo = displayLabel.split(/\s—\s/)[0]?.trim() || "University";

  const fetchList = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await searchUniversitiesAction(q, 50);
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchList(query);
    }, 280);
    return () => clearTimeout(t);
  }, [query, fetchList]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <UniversityLogo
              name={nameForLogo}
              logoUrl={logoSrc}
              size="xs"
              className="shadow-md shadow-black/5"
            />
            <div className="min-w-0">
              <span className="font-medium text-slate-900">{displayLabel}</span>
              {verificationStatus === "PENDING" ? (
                <Badge className="ml-2 h-5 rounded-full border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-900">
                  Unverified
                </Badge>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            className="text-primary shrink-0 text-sm font-semibold"
            onClick={() => {
              onChange("");
              setPicked(null);
              setQuery("");
            }}
          >
            Change
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <FormInput
              icon={Building2}
              placeholder="Search German universities…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              aria-autocomplete="list"
              aria-expanded={open}
              autoComplete="off"
            />
            {loading ? (
              <Loader2 className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-slate-400" />
            ) : null}
          </div>
          {open && items.length > 0 ? (
            <ul
              className="border-input bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border py-1 shadow-md"
              role="listbox"
            >
              {items.map((u) => (
                <li key={u.id} role="option" aria-selected={value === u.id}>
                  <button
                    type="button"
                    className="hover:bg-muted flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(u.id);
                      setPicked({
                        label: `${u.name} — ${u.city}`,
                        logoSrc: u.logoUrl ?? u.imageUrl ?? null,
                        verificationStatus: u.verificationStatus,
                      });
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <UniversityLogo
                      name={u.name}
                      logoUrl={u.logoUrl}
                      imageUrl={u.imageUrl}
                      size="xs"
                      className=""
                    />
                    <span className="min-w-0 flex-1">
                      <span className="font-medium">{u.name}</span>
                      {u.verificationStatus === "PENDING" ? (
                        <Badge className="ml-2 h-5 rounded-full border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-900">
                          Unverified
                        </Badge>
                      ) : null}
                      <span className="text-muted-foreground ml-2 text-xs">
                        {u.city}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </div>
  );
}
