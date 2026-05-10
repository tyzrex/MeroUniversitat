"use client";

import { FormInput } from "@/modules/shared/components/form-input";
import { searchUniversitiesAction } from "@/modules/community/actions/search-universities.action";
import { Building2, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Uni = { id: string; name: string; city: string };

export function UniversityPicker({
  value,
  onChange,
  initialLabel,
}: Readonly<{
  value: string;
  onChange: (id: string) => void;
  /** When `value` is preset (e.g. deep link), show this instead of “University selected”. */
  initialLabel?: string;
}>) {
  const [query, setQuery] = useState("");
  const [pickedLabel, setPickedLabel] = useState(initialLabel ?? "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Uni[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const displayLabel = value ? pickedLabel || "University selected" : "";

  useEffect(() => {
    if (value && initialLabel) {
      setPickedLabel(initialLabel);
    }
  }, [value, initialLabel]);

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
          <span className="font-medium text-slate-900">{displayLabel}</span>
          <button
            type="button"
            className="text-primary shrink-0 text-sm font-semibold"
            onClick={() => {
              onChange("");
              setPickedLabel("");
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
                    className="hover:bg-muted flex w-full px-3 py-2.5 text-left text-sm"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(u.id);
                      setPickedLabel(`${u.name} — ${u.city}`);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <span className="font-medium">{u.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {u.city}
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
