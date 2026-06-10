"use client";

import { useState } from "react";
import type { EventRecord } from "@/lib/events-db";

type PreviousEventsReorderListProps = {
  events: EventRecord[];
  reordering: boolean;
  onReorder: (orderedIds: string[]) => Promise<void>;
  onEdit: (event: EventRecord) => void;
  onDelete: (id: string) => void;
};

function reorderList(items: EventRecord[], fromId: string, toId: string): EventRecord[] {
  const fromIndex = items.findIndex((item) => item.id === fromId);
  const toIndex = items.findIndex((item) => item.id === toId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return items;

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function moveItem(items: EventRecord[], id: string, direction: "up" | "down"): EventRecord[] {
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return items;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return items;

  const next = [...items];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

export function PreviousEventsReorderList({
  events,
  reordering,
  onReorder,
  onEdit,
  onDelete,
}: PreviousEventsReorderListProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  async function applyOrder(nextEvents: EventRecord[]) {
    await onReorder(nextEvents.map((event) => event.id));
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const nextEvents = moveItem(events, id, direction);
    if (nextEvents === events) return;
    await applyOrder(nextEvents);
  }

  async function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      setDropTargetId(null);
      return;
    }

    const nextEvents = reorderList(events, draggingId, targetId);
    setDraggingId(null);
    setDropTargetId(null);

    if (nextEvents === events) return;
    await applyOrder(nextEvents);
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] leading-relaxed text-white/35">
        Drag to reorder how previous events appear on the public site. Top = shown first.
      </p>
      <ul className="space-y-3">
        {events.map((ev, index) => {
          const isDragging = draggingId === ev.id;
          const isDropTarget = dropTargetId === ev.id && draggingId !== ev.id;

          return (
            <li
              key={ev.id}
              draggable={!reordering}
              onDragStart={() => setDraggingId(ev.id)}
              onDragEnd={() => {
                setDraggingId(null);
                setDropTargetId(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDropTargetId(ev.id);
              }}
              onDragLeave={() => {
                if (dropTargetId === ev.id) setDropTargetId(null);
              }}
              onDrop={(event) => {
                event.preventDefault();
                void handleDrop(ev.id);
              }}
              className={`border p-4 transition ${
                isDragging
                  ? "border-white/25 bg-white/[0.04] opacity-60"
                  : isDropTarget
                    ? "border-emerald-400/40 bg-emerald-950/20"
                    : "border-white/10"
              } ${reordering ? "pointer-events-none opacity-70" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 flex-col items-center gap-1 pt-0.5">
                  <button
                    type="button"
                    onClick={() => void handleMove(ev.id, "up")}
                    disabled={reordering || index === 0}
                    aria-label={`Move ${ev.title} up`}
                    className="flex h-7 w-7 items-center justify-center border border-white/15 text-white/45 transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <path d="M6 9V3M3.5 5.5 6 3l2.5 2.5" />
                    </svg>
                  </button>
                  <span
                    className="flex h-8 w-7 cursor-grab items-center justify-center text-white/30 active:cursor-grabbing"
                    title="Drag to reorder"
                    aria-hidden
                  >
                    <svg viewBox="0 0 12 12" className="h-4 w-4" fill="currentColor" aria-hidden>
                      <circle cx="3.5" cy="2.5" r="1" />
                      <circle cx="8.5" cy="2.5" r="1" />
                      <circle cx="3.5" cy="6" r="1" />
                      <circle cx="8.5" cy="6" r="1" />
                      <circle cx="3.5" cy="9.5" r="1" />
                      <circle cx="8.5" cy="9.5" r="1" />
                    </svg>
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleMove(ev.id, "down")}
                    disabled={reordering || index === events.length - 1}
                    aria-label={`Move ${ev.title} down`}
                    className="flex h-7 w-7 items-center justify-center border border-white/15 text-white/45 transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <path d="M6 3v6M3.5 6.5 6 9l2.5-2.5" />
                    </svg>
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                        #{index + 1} · {ev.published ? "Published" : "Draft"}
                      </p>
                      <p className="font-semibold text-white/90">{ev.title}</p>
                      <p className="text-xs text-white/45">{ev.date_display}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(ev)}
                        className="text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(ev.id)}
                        className="text-[10px] uppercase tracking-[0.15em] text-rose-400/70 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {reordering && (
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Saving order…</p>
      )}
    </div>
  );
}
