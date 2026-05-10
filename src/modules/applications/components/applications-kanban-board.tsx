"use client";

import { ApplicationStatusPill } from "@/modules/applications/components/application-status-pill";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { updateApplicationStatusAction } from "@/modules/applications/actions/update-application-status.action";
import { APPLICATION_STATUS_LABELS } from "@/modules/applications/lib/application-status-labels";
import {
  type KanbanBoardCard,
  type KanbanColumnId,
  KANBAN_COLUMNS,
  kanbanColumnToDefaultStatus,
  statusToKanbanColumn,
} from "@/modules/applications/lib/kanban-columns";
import {
  APPLICATION_STATUSES,
  type ApplicationStatusValue,
} from "@/modules/applications/schema/application-form-schema";
import { UniversityLogo } from "@/modules/community/components/university-logo";
import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from "react";

export type KanbanViewMode =
  | "board"
  | "university"
  | "member"
  | "team"
  | "solo";

type Props = {
  cards: KanbanBoardCard[];
  currentUserId: string;
  view: KanbanViewMode;
};

const MIME = "application/x-mero-application-id";

const selectClass =
  "border-input bg-background w-full rounded-lg border px-2 py-1.5 text-[11px] font-medium focus-visible:ring-2 focus-visible:ring-[#4a52c8]/30 focus-visible:outline-none";

const selectClassMinimal =
  "border-input bg-background max-w-[160px] rounded-lg border px-2 py-1 text-[10px] font-medium focus-visible:ring-2 focus-visible:ring-[#4a52c8]/30 focus-visible:outline-none";

const DEFAULT_COUNTRY = "Germany";

function emptyBuckets(): Record<KanbanColumnId, KanbanBoardCard[]> {
  const next = {} as Record<KanbanColumnId, KanbanBoardCard[]>;
  for (const col of KANBAN_COLUMNS) {
    next[col.id] = [];
  }
  return next;
}

export function ApplicationsKanbanBoard({ cards, currentUserId, view }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [dropTarget, setDropTarget] = useState<KanbanColumnId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buckets = useMemo(() => {
    const next = emptyBuckets();
    for (const c of cards) {
      next[statusToKanbanColumn(c.status)].push(c);
    }
    return next;
  }, [cards]);

  const byUniversity = useMemo(() => {
    const m = new Map<string, KanbanBoardCard[]>();
    for (const c of cards) {
      const k = c.universityName.trim() || "Unknown university";
      const arr = m.get(k) ?? [];
      arr.push(c);
      m.set(k, arr);
    }
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [cards]);

  const byMember = useMemo(() => {
    const m = new Map<string, KanbanBoardCard[]>();
    for (const c of cards) {
      const arr = m.get(c.userId) ?? [];
      arr.push(c);
      m.set(c.userId, arr);
    }
    return [...m.entries()]
      .map(([userId, items]) => ({
        userId,
        label: items[0]?.ownerName ?? "Member",
        items,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [cards]);

  const byTeam = useMemo(() => {
    const m = new Map<string, KanbanBoardCard[]>();
    for (const c of cards) {
      const key = c.teamId ?? "__personal__";
      const arr = m.get(key) ?? [];
      arr.push(c);
      m.set(key, arr);
    }
    return [...m.entries()]
      .map(([key, items]) => ({
        key,
        label:
          key === "__personal__"
            ? "Personal / solo"
            : (items[0]?.teamLabel ?? "Team"),
        items,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [cards]);

  const runStatusUpdate = useCallback(
    (applicationId: string, status: ApplicationStatusValue) => {
      const card = cards.find((c) => c.id === applicationId);
      if (!card || card.userId !== currentUserId || card.status === status) {
        return;
      }
      setError(null);
      startTransition(async () => {
        const res = await updateApplicationStatusAction({
          applicationId,
          status,
        });
        if (!res.ok) {
          setError(res.error);
          return;
        }
        router.refresh();
      });
    },
    [cards, currentUserId, router],
  );

  const runMove = useCallback(
    (applicationId: string, column: KanbanColumnId) => {
      const card = cards.find((c) => c.id === applicationId);
      if (!card || card.userId !== currentUserId) {
        return;
      }
      if (statusToKanbanColumn(card.status) === column) {
        return;
      }
      const nextStatus = kanbanColumnToDefaultStatus(column);
      runStatusUpdate(applicationId, nextStatus);
    },
    [cards, currentUserId, runStatusUpdate],
  );

  if (view === "university") {
    return (
      <KanbanShell error={error}>
        <div className="flex flex-col gap-8">
          {byUniversity.length === 0 ? (
            <EmptyKanban />
          ) : (
            byUniversity.map(([uni, items]) => (
              <UniversityGroupSection
                key={uni}
                title={uni}
                items={items}
                currentUserId={currentUserId}
                onStatusChange={runStatusUpdate}
              />
            ))
          )}
        </div>
      </KanbanShell>
    );
  }

  if (view === "member") {
    return (
      <KanbanShell error={error}>
        <div className="flex flex-col gap-8">
          {byMember.length === 0 ? (
            <EmptyKanban />
          ) : (
            byMember.map(({ userId, label, items }) => (
              <section
                key={userId}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h2 className="border-b border-slate-100 pb-4 text-lg font-bold text-[#0d2145]">
                  {label}
                  <span className="text-muted-foreground ml-2 text-sm font-semibold">
                    {items.length} application{items.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((a) => (
                    <KanbanApplicationCard
                      key={a.id}
                      card={a}
                      currentUserId={currentUserId}
                      draggable={false}
                      variant="full"
                      onStatusChange={runStatusUpdate}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </KanbanShell>
    );
  }

  if (view === "team") {
    return (
      <KanbanShell error={error}>
        <div className="flex flex-col gap-8">
          {byTeam.length === 0 ? (
            <EmptyKanban />
          ) : (
            byTeam.map(({ key, label, items }) => (
              <section
                key={key}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h2 className="border-b border-slate-100 pb-4 text-lg font-bold text-[#0d2145]">
                  {label}
                  <span className="text-muted-foreground ml-2 text-sm font-semibold">
                    {items.length} application{items.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((a) => (
                    <KanbanApplicationCard
                      key={a.id}
                      card={a}
                      currentUserId={currentUserId}
                      draggable={false}
                      variant="full"
                      onStatusChange={runStatusUpdate}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </KanbanShell>
    );
  }

  return (
    <KanbanShell error={error}>
      <div className="w-full min-w-0 max-w-full">
        <div className="overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch]">
          <section className="flex w-max gap-4 pb-2">
            {KANBAN_COLUMNS.map((col) => {
              const items = buckets[col.id];
              const isDropTarget = dropTarget === col.id;

              return (
                <div
                  key={col.id}
                  className={cn(
                    "flex min-h-[400px] max-h-[min(86vh,920px)] w-[min(94vw,340px)] shrink-0 flex-col overflow-hidden rounded-xl border bg-white p-3 transition-colors sm:w-[310px] lg:w-[328px] xl:w-[360px]",
                    isDropTarget
                      ? "border-[#4a52c8] ring-2 ring-[#4a52c8]/25"
                      : "border-slate-200",
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setDropTarget(col.id);
                  }}
                  onDragLeave={(e) => {
                    const next = e.relatedTarget as Node | null;
                    if (next && e.currentTarget.contains(next)) return;
                    setDropTarget((d) => (d === col.id ? null : d));
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDropTarget(null);
                    const id = e.dataTransfer.getData(MIME);
                    if (id) {
                      runMove(id, col.id);
                    }
                  }}
                >
                  <div className="mb-3 shrink-0 flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            col.dot,
                          )}
                        />
                        <h2 className="text-sm font-semibold text-[#0d2145]">
                          {col.title}
                        </h2>
                      </div>
                      <p className="text-muted-foreground mt-1 text-[10px] leading-snug">
                        {col.statusHint}
                      </p>
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs font-semibold tabular-nums">
                      {items.length}
                    </span>
                  </div>
                  <ul className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
                    {items.length === 0 ? (
                      <li className="text-muted-foreground rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs">
                        Drop cards here
                      </li>
                    ) : (
                      items.map((card) => (
                        <li key={card.id} className="list-none">
                          <KanbanApplicationCard
                            boardCard
                            card={card}
                            currentUserId={currentUserId}
                            draggable
                            variant="full"
                            onStatusChange={runStatusUpdate}
                          />
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </KanbanShell>
  );
}

function UniversityGroupSection({
  title,
  items,
  currentUserId,
  onStatusChange,
}: Readonly<{
  title: string;
  items: KanbanBoardCard[];
  currentUserId: string;
  onStatusChange: (id: string, status: ApplicationStatusValue) => void;
}>) {
  const owners = useMemo(() => {
    const map = new Map<string, KanbanBoardCard>();
    for (const c of items) {
      if (!map.has(c.userId)) map.set(c.userId, c);
    }
    return [...map.values()].sort((a, b) =>
      a.ownerName.localeCompare(b.ownerName),
    );
  }, [items]);

  const leadLogo = items[0]?.logoUrl ?? null;
  const leadName = title;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <UniversityLogo
            name={leadName}
            logoUrl={leadLogo}
            size="compact"
          />
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[#0d2145]">{title}</h2>
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <span aria-hidden>🇩🇪</span>
              {DEFAULT_COUNTRY}
              <span className="text-muted-foreground/80">
                · {items.length} application{items.length === 1 ? "" : "s"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-muted-foreground mr-2 text-xs font-semibold uppercase tracking-wide">
            Applicants
          </span>
          <div className="flex -space-x-2">
            {owners.slice(0, 6).map((o) => (
              <OwnerAvatar key={o.userId} card={o} />
            ))}
            {owners.length > 6 ? (
              <span className="z-10 flex size-8 items-center justify-center rounded-full border border-white bg-slate-100 text-[10px] font-bold text-slate-700 ring-2 ring-white">
                +{owners.length - 6}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((a) => (
          <KanbanApplicationCard
            key={a.id}
            card={a}
            currentUserId={currentUserId}
            draggable={false}
            variant="full"
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </section>
  );
}

function KanbanShell({
  children,
  error,
}: Readonly<{
  children: ReactNode;
  error: string | null;
}>) {
  return (
    <div>
      {error ? (
        <p
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function EmptyKanban() {
  return (
    <div className="text-muted-foreground rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm">
      No applications visible yet.
    </div>
  );
}

function OwnerAvatar({
  card,
  className,
}: Readonly<{ card: KanbanBoardCard; className?: string }>) {
  const initials =
    card.ownerName
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  if (card.ownerImage) {
    return (
      <Image
        src={card.ownerImage}
        alt=""
        width={32}
        height={32}
        className={cn(
          "size-8 rounded-full border border-white object-cover ring-2 ring-white",
          className,
        )}
        title={card.ownerName}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex size-8 items-center justify-center rounded-full border border-white bg-slate-100 text-[10px] font-bold text-slate-700 ring-2 ring-white",
        className,
      )}
      title={card.ownerName}
    >
      {initials}
    </span>
  );
}

function KanbanApplicationCard({
  card,
  currentUserId,
  draggable,
  onStatusChange,
  variant = "full",
  boardCard = false,
}: Readonly<{
  card: KanbanBoardCard;
  currentUserId: string;
  draggable: boolean;
  onStatusChange: (id: string, status: ApplicationStatusValue) => void;
  variant?: "full" | "minimal";
  /** Board view: drag between columns updates status; compact edit control. */
  boardCard?: boolean;
}>) {
  const isOwner = card.userId === currentUserId;
  const canDrag = draggable && isOwner;

  if (variant === "minimal") {
    return (
      <div
        draggable={canDrag}
        onDragStart={(e) => {
          if (!canDrag) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.setData(MIME, card.id);
          e.dataTransfer.effectAllowed = "move";
        }}
        className={cn(
          "flex gap-2 rounded-lg border border-slate-200 bg-white p-2 text-sm",
          canDrag ? "cursor-grab active:cursor-grabbing" : "",
        )}
      >
        <OwnerAvatar card={card} className="shrink-0" />
        <div className="min-w-0 flex-1">
          {!isOwner ? (
            <ApplicationStatusPill className="mb-1" status={card.status} />
          ) : null}
          <p className="truncate font-semibold leading-tight text-[#0d2145]">
            {card.universityName}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {card.programLabel}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            {card.ownerName}
            {card.teamLabel ? ` · ${card.teamLabel}` : ""}
          </p>
          {isOwner ? (
            <div
              className="mt-1.5 flex flex-wrap items-center gap-2"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <select
                className={selectClassMinimal}
                value={card.status}
                aria-label="Status"
                onChange={(e) =>
                  onStatusChange(
                    card.id,
                    e.target.value as ApplicationStatusValue,
                  )
                }
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {APPLICATION_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <Link
                className="text-[10px] font-semibold text-[#2563eb]"
                href={`/dashboard/applications/${card.id}/edit`}
              >
                Edit
              </Link>
            </div>
          ) : (
            <p className="text-muted-foreground mt-1 text-[10px] italic">
              View only
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      draggable={canDrag}
      onDragStart={(e) => {
        if (!canDrag) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData(MIME, card.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className={cn(
        "relative rounded-xl border border-slate-200 bg-white p-3 text-sm",
        canDrag ? "cursor-grab active:cursor-grabbing" : "",
      )}
    >
      {boardCard && isOwner ? (
        <Link
          href={`/dashboard/applications/${card.id}/edit`}
          className="absolute top-2 right-2 z-10 inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0d2145]"
          title="Edit application"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Pencil className="size-4" strokeWidth={2} />
          <span className="sr-only">Edit application</span>
        </Link>
      ) : null}

      <div className={cn("flex gap-3", boardCard && isOwner && "pr-9")}>
        <UniversityLogo
          name={card.universityName}
          logoUrl={card.logoUrl}
          size="compact"
        />
        <div className="min-w-0 flex-1">
          {!isOwner ? (
            <div className="mb-2">
              <ApplicationStatusPill status={card.status} />
            </div>
          ) : null}
          <p className="font-semibold leading-snug text-[#0d2145]">
            {card.universityName}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span aria-hidden>🇩🇪</span>
            {card.city ? `${card.city}, ${DEFAULT_COUNTRY}` : DEFAULT_COUNTRY}
          </p>
          <p className="mt-1 text-xs text-slate-600">{card.programLabel}</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            {card.intakeSemester?.trim()
              ? `${card.intakeSemester}`
              : "Intake TBD"}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <OwnerAvatar card={card} />
            <Badge
              variant="outline"
              className={cn(
                "border-slate-200 font-semibold",
                !card.teamLabel && "bg-slate-50 text-slate-600",
                card.teamLabel && "border-blue-200 bg-blue-50 text-blue-900",
              )}
            >
              {card.teamLabel ?? "Personal"}
            </Badge>
          </div>

          {isOwner ? (
            boardCard ? null : (
              <div
                className="mt-3 space-y-2"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <label className="text-muted-foreground block text-[10px] font-bold uppercase tracking-[0.14em]">
                  Status
                </label>
                <select
                  className={selectClass}
                  value={card.status}
                  aria-label="Application pipeline status"
                  onChange={(e) =>
                    onStatusChange(
                      card.id,
                      e.target.value as ApplicationStatusValue,
                    )
                  }
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {APPLICATION_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <Link
                  className="inline-block text-xs font-semibold text-[#2563eb]"
                  href={`/dashboard/applications/${card.id}/edit`}
                >
                  Full edit
                </Link>
              </div>
            )
          ) : (
            <p className="text-muted-foreground mt-3 text-xs italic">
              View only — not your row
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
