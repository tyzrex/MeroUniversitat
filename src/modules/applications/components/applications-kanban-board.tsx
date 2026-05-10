"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { updateApplicationStatusAction } from "@/modules/applications/actions/update-application-status.action";
import {
  APPLICATION_STATUS_LABELS,
  applicationStatusLabel,
} from "@/modules/applications/lib/application-status-labels";
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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from "react";

export type KanbanViewMode = "board" | "university" | "member";

type Props = {
  cards: KanbanBoardCard[];
  currentUserId: string;
  view: KanbanViewMode;
  /** Merge duplicate uni+program rows with avatar strip (board view). */
  compact: boolean;
};

const MIME = "application/x-mero-application-id";

const selectClass =
  "border-input bg-background w-full rounded-lg border px-2 py-1.5 text-[11px] font-medium shadow-xs focus-visible:ring-2 focus-visible:ring-[#4a52c8]/30 focus-visible:outline-none";

const selectClassMinimal =
  "border-input bg-background max-w-[140px] rounded-lg border px-2 py-1 text-[10px] font-medium shadow-xs focus-visible:ring-2 focus-visible:ring-[#4a52c8]/30 focus-visible:outline-none";

function clusterKey(card: KanbanBoardCard) {
  return `${card.universityName.trim()}\n${card.programLabel.trim()}`;
}

function bucketColumnItems(
  items: KanbanBoardCard[],
  compact: boolean,
): { key: string; cards: KanbanBoardCard[] }[] {
  if (!compact) {
    return items.map((c) => ({ key: c.id, cards: [c] }));
  }
  const m = new Map<string, KanbanBoardCard[]>();
  for (const c of items) {
    const k = clusterKey(c);
    const arr = m.get(k) ?? [];
    arr.push(c);
    m.set(k, arr);
  }
  return [...m.entries()].map(([key, cards]) => ({ key, cards }));
}

export function ApplicationsKanbanBoard({
  cards,
  currentUserId,
  view,
  compact,
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [dropTarget, setDropTarget] = useState<KanbanColumnId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dense = compact;

  const buckets = useMemo(() => {
    const next: Record<KanbanColumnId, KanbanBoardCard[]> = {
      research: [],
      prepare: [],
      pipeline: [],
      outcome: [],
    };
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
              <section
                key={uni}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/5"
              >
                <h2 className="border-b border-slate-100 pb-4 text-lg font-bold text-[#0d2145]">
                  {uni}
                  <span className="text-muted-foreground ml-2 text-sm font-semibold">
                    {items.length} application{items.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((a) => (
                    <KanbanApplicationCard
                      key={a.id}
                      card={a}
                      currentUserId={currentUserId}
                      draggable={false}
                      variant={dense ? "minimal" : "full"}
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
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/5"
              >
                <h2 className="border-b border-slate-100 pb-4 text-lg font-bold text-[#0d2145]">
                  {label}
                  <span className="text-muted-foreground ml-2 text-sm font-semibold">
                    {items.length} row{items.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((a) => (
                    <KanbanApplicationCard
                      key={a.id}
                      card={a}
                      currentUserId={currentUserId}
                      draggable={false}
                      variant={dense ? "minimal" : "full"}
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
      <section className="grid gap-4 lg:grid-cols-4">
        {KANBAN_COLUMNS.map((col) => {
          const items = buckets[col.id];
          const isDropTarget = dropTarget === col.id;
          const groups = bucketColumnItems(items, compact);

          return (
            <div
              key={col.id}
              className={cn(
                "flex min-h-[280px] flex-col rounded-2xl border bg-white/90 p-3 shadow-sm transition-colors sm:min-h-[320px] sm:p-4",
                isDropTarget
                  ? "border-primary ring-primary/30 ring-2"
                  : "border-slate-200/90",
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
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2 shrink-0 rounded-full", col.dot)} />
                    <h2 className="font-semibold text-[#0d2145]">{col.title}</h2>
                  </div>
                  <p className="text-muted-foreground mt-1 text-[11px] leading-snug">
                    {col.statusHint}
                  </p>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs font-medium">
                  {items.length}
                </span>
              </div>
              <ul className="flex flex-1 flex-col gap-2 overflow-y-auto">
                {items.length === 0 ? (
                  <li className="text-muted-foreground rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-center text-xs">
                    Drop cards here
                  </li>
                ) : (
                  groups.map(({ key, cards: groupCards }) =>
                    groupCards.length === 1 ? (
                      <li key={groupCards[0].id} className="list-none">
                        <KanbanApplicationCard
                          card={groupCards[0]}
                          currentUserId={currentUserId}
                          draggable
                          variant={compact ? "minimal" : "full"}
                          onStatusChange={runStatusUpdate}
                        />
                      </li>
                    ) : (
                      <li key={key} className="list-none">
                        <KanbanCluster
                          cards={groupCards}
                          currentUserId={currentUserId}
                          onStatusChange={runStatusUpdate}
                        />
                      </li>
                    ),
                  )
                )}
              </ul>
            </div>
          );
        })}
      </section>
    </KanbanShell>
  );
}

function KanbanCluster({
  cards,
  currentUserId,
  onStatusChange,
}: Readonly<{
  cards: KanbanBoardCard[];
  currentUserId: string;
  onStatusChange: (id: string, status: ApplicationStatusValue) => void;
}>) {
  const owners = useMemo(() => {
    const map = new Map<string, KanbanBoardCard>();
    for (const c of cards) {
      if (!map.has(c.userId)) map.set(c.userId, c);
    }
    return [...map.values()].sort((a, b) =>
      a.ownerName.localeCompare(b.ownerName),
    );
  }, [cards]);

  const statuses = useMemo(() => new Set(cards.map((c) => c.status)), [cards]);
  const statusSummary =
    statuses.size === 1
      ? applicationStatusLabel([...statuses][0])
      : `${statuses.size} stages`;

  const first = cards[0];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-gradient-to-b from-slate-50/90 to-white p-2 shadow-sm">
      <div className="flex items-start justify-between gap-2 border-b border-slate-100/90 pb-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#0d2145]">
            {first.universityName}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {first.programLabel}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex -space-x-2">
            {owners.slice(0, 5).map((o) => (
              <OwnerAvatar key={o.userId} card={o} className="z-0" />
            ))}
            {owners.length > 5 ? (
              <span className="z-10 flex size-7 items-center justify-center rounded-full border border-white bg-slate-200 text-[10px] font-bold text-slate-700 ring-2 ring-white">
                +{owners.length - 5}
              </span>
            ) : null}
          </div>
          <Badge variant="outline" className="h-6 text-[10px] font-semibold">
            {statusSummary}
          </Badge>
        </div>
      </div>
      <ul className="mt-2 space-y-1.5">
        {[...cards]
          .sort((a, b) => a.ownerName.localeCompare(b.ownerName))
          .map((c) => (
            <li key={c.id}>
              <KanbanApplicationCard
                card={c}
                currentUserId={currentUserId}
                draggable
                variant="minimal"
                onStatusChange={onStatusChange}
              />
            </li>
          ))}
      </ul>
    </div>
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
    <div className="text-muted-foreground rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm shadow-sm">
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
        alt={card.ownerName}
        width={28}
        height={28}
        className={cn(
          "size-7 rounded-full border border-white object-cover ring-2 ring-white",
          className,
        )}
        title={card.ownerName}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex size-7 items-center justify-center rounded-full border border-white bg-gradient-to-br from-slate-100 to-slate-200 text-[10px] font-bold text-slate-700 ring-2 ring-white",
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
}: Readonly<{
  card: KanbanBoardCard;
  currentUserId: string;
  draggable: boolean;
  onStatusChange: (id: string, status: ApplicationStatusValue) => void;
  variant?: "full" | "minimal";
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
          "flex gap-2 rounded-lg border border-slate-100 bg-white p-2 text-sm shadow-sm",
          canDrag ? "cursor-grab active:cursor-grabbing" : "",
        )}
      >
        <OwnerAvatar card={card} className="shrink-0" />
        <div className="min-w-0 flex-1">
          {!isOwner ? (
            <Badge variant="outline" className="mb-1 h-5 border-slate-200 px-1.5 text-[10px] font-semibold">
              {applicationStatusLabel(card.status)}
            </Badge>
          ) : null}
          <p className="truncate font-semibold text-[#0d2145] leading-tight">
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
            <div className="mt-1.5 flex flex-wrap items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
              <select
                className={selectClassMinimal}
                value={card.status}
                aria-label="Status"
                onChange={(e) =>
                  onStatusChange(card.id, e.target.value as ApplicationStatusValue)
                }
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {APPLICATION_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <Link
                className="text-primary text-[10px] font-semibold"
                href={`/dashboard/applications/${card.id}/edit`}
              >
                Edit
              </Link>
            </div>
          ) : (
            <p className="text-muted-foreground mt-1 text-[10px] italic">View only</p>
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
        "rounded-xl border border-slate-100 bg-white p-3 text-sm shadow-sm",
        canDrag ? "cursor-grab active:cursor-grabbing" : "",
      )}
    >
      <div className="flex gap-3">
        <OwnerAvatar card={card} className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          {!isOwner ? (
            <Badge variant="outline" className="mb-2 border-slate-200 font-semibold">
              {applicationStatusLabel(card.status)}
            </Badge>
          ) : null}
          <p className="font-semibold text-[#0d2145]">{card.universityName}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">{card.programLabel}</p>
          <p className="text-muted-foreground mt-2 text-xs">
            {card.ownerName}
            {card.teamLabel ? ` · ${card.teamLabel}` : ""}
          </p>

          {isOwner ? (
            <div className="mt-2 space-y-2" onMouseDown={(e) => e.stopPropagation()}>
              <label className="text-muted-foreground block text-[10px] font-bold uppercase tracking-[0.16em]">
                Status
              </label>
              <select
                className={selectClass}
                value={card.status}
                aria-label="Application pipeline status"
                onChange={(e) =>
                  onStatusChange(card.id, e.target.value as ApplicationStatusValue)
                }
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {APPLICATION_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <Link
                className="text-primary inline-block text-xs font-semibold"
                href={`/dashboard/applications/${card.id}/edit`}
              >
                Full edit
              </Link>
            </div>
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
