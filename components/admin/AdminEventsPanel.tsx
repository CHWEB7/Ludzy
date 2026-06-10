"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminEventsSetup } from "@/components/admin/AdminEventsSetup";
import { AdminNav } from "@/components/admin/AdminNav";
import { LocationPicker } from "@/components/admin/LocationPicker";
import { checkAdminEmailAllowed } from "@/lib/auth/check-admin-email-client";
import {
  formatBritishLongDate,
  toDateInputValue,
  toTimeInputValue,
} from "@/lib/event-date-format";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";
import {
  EVENT_SOFT_DELETE_DAYS,
  formatEventPurgeDate,
} from "@/lib/event-soft-delete";
import type { EventRecord } from "@/lib/events-db";

type EventForm = {
  event_type: "previous" | "upcoming";
  title: string;
  slug: string;
  event_date: string;
  venue: string;
  location: string;
  maps_url: string;
  time_display: string;
  set_type: string;
  excerpt: string;
  summary: string;
  details: string;
  body: string;
  image_url: string;
  gallery_images: string[];
  published: boolean;
};

const emptyForm: EventForm = {
  event_type: "previous",
  title: "",
  slug: "",
  event_date: "",
  venue: "",
  location: "",
  maps_url: "",
  time_display: "",
  set_type: "",
  excerpt: "",
  summary: "",
  details: "",
  body: "",
  image_url: "",
  gallery_images: [],
  published: false,
};

async function getAccessToken(): Promise<string | null> {
  const supabase = createAdminBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export function AdminEventsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [deletedEvents, setDeletedEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const authHeaders = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) throw new Error("Not signed in");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  const ensureAuthed = useCallback(async () => {
    const supabase = createAdminBrowserClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;
    if (error || !user || !(await checkAdminEmailAllowed(user.email ?? "")).allowed) {
      router.replace("/admin/login");
      return false;
    }
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!aal || aal.currentLevel !== "aal2") {
      router.replace("/admin/mfa");
      return false;
    }
    return true;
  }, [router]);

  const loadEvents = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true);
    setError(null);
    try {
      if (!(await ensureAuthed())) return;
      const headers = await authHeaders();
      const res = await fetch("/api/admin/events", { headers });
      const json = (await res.json()) as {
        events?: EventRecord[];
        deletedEvents?: EventRecord[];
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        if (json.code === "TABLE_MISSING") {
          setError(null);
          setEvents([]);
          setDeletedEvents([]);
          return;
        }
        throw new Error(json.error ?? "Failed to load events");
      }
      setEvents(json.events ?? []);
      setDeletedEvents(json.deletedEvents ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, ensureAuthed]);

  const appliedSearchKey = useRef<string | null>(null);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (loading) return;

    const editId = searchParams.get("edit");
    const type = searchParams.get("type");
    const searchKey = editId ? `edit:${editId}` : type ? `type:${type}` : null;
    if (!searchKey || appliedSearchKey.current === searchKey) return;

    if (editId) {
      const ev = events.find((e) => e.id === editId);
      if (!ev) return;
      appliedSearchKey.current = searchKey;
      startEdit(ev);
      return;
    }

    if (type === "previous" || type === "upcoming") {
      appliedSearchKey.current = searchKey;
      startNew(type);
    }
  }, [searchParams, events, loading]);

  function startNew(type: "previous" | "upcoming") {
    setEditingId(null);
    setForm({ ...emptyForm, event_type: type });
  }

  function startEdit(event: EventRecord) {
    setEditingId(event.id);
    setForm({
      event_type: event.event_type,
      title: event.title,
      slug: event.slug ?? "",
      event_date: toDateInputValue(event.event_date),
      venue: event.venue ?? "",
      location: event.location ?? "",
      maps_url: event.maps_url ?? "",
      time_display: toTimeInputValue(event.time_display),
      set_type: event.set_type ?? "",
      excerpt: event.excerpt ?? "",
      summary: event.summary ?? "",
      details: event.details ?? "",
      body: event.body.join("\n\n"),
      image_url: event.image_url ?? "",
      gallery_images: event.gallery_images ?? [],
      published: event.published,
    });
  }

  async function handleUpload(file: File, target: "cover" | "gallery" = "cover") {
    setUploading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      if (target === "gallery") {
        setForm((f) => ({
          ...f,
          gallery_images: json.url ? [...f.gallery_images, json.url] : f.gallery_images,
        }));
      } else {
        setForm((f) => ({ ...f, image_url: json.url ?? "" }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryImage(index: number) {
    setForm((f) => ({
      ...f,
      gallery_images: f.gallery_images.filter((_, i) => i !== index),
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!form.event_date) {
        setError("Please select a date.");
        setSaving(false);
        return;
      }
      const headers = await authHeaders();
      const payload = {
        ...form,
        date_display: formatBritishLongDate(form.event_date),
        body: form.body
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean),
        event_date: form.event_date || null,
        maps_url: form.maps_url || null,
        time_display: form.time_display || null,
      };

      const url = editingId ? `/api/admin/events/${editingId}` : "/api/admin/events";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      setForm(emptyForm);
      setEditingId(null);
      await loadEvents({ silent: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function clearEditorIfEditing(id: string) {
    if (editingId !== id) return;
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleArchive(id: string) {
    const target = events.find((event) => event.id === id);
    if (!target) return;
    if (
      !confirm(
        `Archive "${target.title}"?\n\nThis only moves this event to previous events. Other events are not changed.`,
      )
    ) {
      return;
    }

    try {
      const headers = await authHeaders();
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ archive: true }),
      });
      const json = (await res.json()) as { event?: EventRecord; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Archive failed");

      if (json.event) {
        setEvents((current) =>
          current.map((event) => (event.id === id ? (json.event as EventRecord) : event)),
        );
      }
      clearEditorIfEditing(id);
      await loadEvents({ silent: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Archive failed");
    }
  }

  function requestDelete(id: string) {
    const target = events.find((event) => event.id === id);
    if (!target) return;
    setDeleteConfirmText("");
    setDeleteTarget({ id: target.id, title: target.title });
  }

  function cancelDelete() {
    setDeleteTarget(null);
    setDeleteConfirmText("");
    setDeleting(false);
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteConfirmText.trim().toLowerCase() !== "delete") return;

    setDeleting(true);
    setError(null);
    try {
      const headers = await authHeaders();
      const res = await fetch(`/api/admin/events/${deleteTarget.id}`, {
        method: "DELETE",
        headers,
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Delete failed");

      setEvents((current) => current.filter((event) => event.id !== deleteTarget.id));
      clearEditorIfEditing(deleteTarget.id);
      cancelDelete();
      await loadEvents({ silent: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
    }
  }

  async function handleRestore(id: string) {
    const target = deletedEvents.find((event) => event.id === id);
    if (!target) return;
    if (!confirm(`Restore "${target.title}"?\n\nIt will return to your event list as a draft.`)) {
      return;
    }

    try {
      const headers = await authHeaders();
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ restore: true }),
      });
      const json = (await res.json()) as { event?: EventRecord; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Restore failed");

      setDeletedEvents((current) => current.filter((event) => event.id !== id));
      if (json.event) {
        setEvents((current) => [json.event as EventRecord, ...current]);
      }
      await loadEvents({ silent: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Restore failed");
    }
  }

  const previousEvents = events.filter((e) => e.event_type === "previous");
  const upcomingEvents = events.filter((e) => e.event_type === "upcoming");

  const inputClass =
    "mt-1 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-white";

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <AdminNav
        title="Events"
        description="Add, edit, and publish past recaps and upcoming diary dates."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <button type="button" onClick={() => startNew("previous")} className="test-btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
          + Past event
        </button>
        <button type="button" onClick={() => startNew("upcoming")} className="test-btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
          + Upcoming
        </button>
      </div>

      <AdminEventsSetup onReady={() => void loadEvents({ silent: true })} />

      {error && <p className="mb-6 text-sm text-rose-400">{error}</p>}

      {deleteTarget && (
        <DeleteEventDialog
          title={deleteTarget.title}
          confirmText={deleteConfirmText}
          deleting={deleting}
          onConfirmTextChange={setDeleteConfirmText}
          onCancel={cancelDelete}
          onConfirm={() => void confirmDelete()}
        />
      )}

      <div className="grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSave} className="space-y-4 border border-white/10 p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
            {editingId ? "Edit event" : "New event"}
          </p>

          <label className="block text-xs text-white/50">
            Type
            <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value as EventForm["event_type"] })} className={inputClass}>
              <option value="previous">Previous (blog recap)</option>
              <option value="upcoming">Upcoming (diary)</option>
            </select>
          </label>

          <label className="block text-xs text-white/50">
            Title *
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          </label>

          {form.event_type === "previous" && (
            <label className="block text-xs text-white/50">
              URL slug
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" className={inputClass} />
            </label>
          )}

          <label className="block text-xs text-white/50">
            Date *
            <input
              type="date"
              required
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className={inputClass}
            />
            {form.event_date && (
              <p className="mt-1 text-[10px] text-white/35">
                Displays as: {formatBritishLongDate(form.event_date)}
              </p>
            )}
          </label>

          {form.event_type === "previous" ? (
            <>
              <LocationPicker
                label="Venue"
                value={form.venue}
                mapsUrl={form.maps_url}
                onChange={(venue, mapsUrl) => setForm({ ...form, venue, maps_url: mapsUrl })}
                className={inputClass}
                placeholder="Search venue or address…"
              />
              <label className="block text-xs text-white/50">
                Excerpt *
                <textarea required rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputClass} />
              </label>
              <label className="block text-xs text-white/50">
                Full recap (paragraphs separated by blank lines)
                <textarea rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className={inputClass} />
              </label>
            </>
          ) : (
            <>
              <label className="block text-xs text-white/50">
                Time (24-hour)
                <input
                  type="time"
                  step="60"
                  value={form.time_display}
                  onChange={(e) => setForm({ ...form, time_display: e.target.value })}
                  className={inputClass}
                />
              </label>
              <LocationPicker
                label="Location"
                value={form.location}
                mapsUrl={form.maps_url}
                onChange={(location, mapsUrl) =>
                  setForm({ ...form, location, maps_url: mapsUrl })
                }
                className={inputClass}
                placeholder="Search venue or address…"
              />
              <label className="block text-xs text-white/50">
                Set type
                <input value={form.set_type} onChange={(e) => setForm({ ...form, set_type: e.target.value })} className={inputClass} />
              </label>
              <label className="block text-xs text-white/50">
                Summary
                <textarea rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className={inputClass} />
              </label>
              <label className="block text-xs text-white/50">
                Details (shown when expanded)
                <textarea rows={4} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className={inputClass} />
              </label>
            </>
          )}

          <label className="block text-xs text-white/50">
            Cover image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleUpload(f, "cover");
              }}
              className="mt-1 text-sm text-white/60"
            />
            {uploading && <span className="ml-2 text-xs text-white/40">Uploading…</span>}
            {form.image_url && (
              <div className="mt-2 space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image_url}
                  alt=""
                  className="h-24 w-full max-w-xs object-cover brightness-90"
                />
                <p className="truncate text-xs text-emerald-400/80">{form.image_url}</p>
              </div>
            )}
          </label>

          {form.event_type === "previous" && (
            <div className="block text-xs text-white/50">
              <span>Gallery images (shown on recap page only)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  for (const file of files) void handleUpload(file, "gallery");
                  e.target.value = "";
                }}
                className="mt-1 text-sm text-white/60"
              />
              {form.gallery_images.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {form.gallery_images.map((url, index) => (
                    <li key={`${url}-${index}`} className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-12 w-16 object-cover brightness-90" />
                      <p className="min-w-0 flex-1 truncate text-[10px] text-white/45">{url}</p>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="shrink-0 text-[10px] uppercase tracking-[0.15em] text-rose-400/70 hover:text-rose-300"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 text-xs text-white/60">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published (visible on website)
          </label>

          <button type="submit" disabled={saving} className="test-btn-primary w-full py-3 text-[11px] font-bold uppercase tracking-[0.25em] disabled:opacity-50">
            {saving ? "Saving…" : editingId ? "Update event" : "Create event"}
          </button>
        </form>

        <div>
          <div className="mb-6 flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              All events
            </p>
            <SoftDeleteInfoIcon />
          </div>
          {loading ? (
            <p className="text-sm text-white/40">Loading…</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-white/40">No events yet. Create one or run the seed SQL.</p>
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                  Upcoming ({upcomingEvents.length})
                </h3>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-white/35">No upcoming events yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {upcomingEvents.map((ev) => (
                      <li key={ev.id} className="border border-white/10 p-4">
                        <EventListItem
                          ev={ev}
                          onEdit={startEdit}
                          onArchive={handleArchive}
                          onDelete={requestDelete}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                  Previous ({previousEvents.length})
                </h3>
                {previousEvents.length === 0 ? (
                  <p className="text-sm text-white/35">No previous events yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {previousEvents.map((ev) => (
                      <li key={ev.id} className="border border-white/10 p-4">
                        <EventListItem
                          ev={ev}
                          onEdit={startEdit}
                          onArchive={handleArchive}
                          onDelete={requestDelete}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <details className="mt-8 border border-white/10 bg-black/30">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 marker:content-none [&::-webkit-details-marker]:hidden">
              <span>Deleted events ({deletedEvents.length})</span>
              <SoftDeleteInfoIcon />
            </summary>
            <div className="border-t border-white/10 px-4 py-4">
              {deletedEvents.length === 0 ? (
                <p className="text-sm text-white/35">
                  No recently deleted events. Deleted items appear here for {EVENT_SOFT_DELETE_DAYS} days.
                </p>
              ) : (
                <ul className="space-y-3">
                  {deletedEvents.map((ev) => (
                    <li key={ev.id} className="border border-white/10 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-rose-300/70">
                            Deleted · {ev.event_type}
                          </p>
                          <p className="font-semibold text-white/80">{ev.title}</p>
                          <p className="text-xs text-white/45">{ev.date_display}</p>
                          {ev.deleted_at && (
                            <p className="mt-2 text-[10px] text-white/35">
                              Permanently removed after {formatEventPurgeDate(ev.deleted_at)}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleRestore(ev.id)}
                          className="shrink-0 text-[10px] uppercase tracking-[0.15em] text-emerald-300/80 hover:text-emerald-200"
                        >
                          Restore
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

function SoftDeleteInfoIcon() {
  const label = `Deleting removes an event from the website straight away. It is kept in the database for ${EVENT_SOFT_DELETE_DAYS} days, then permanently removed. You can restore it from Deleted events during that time.`;

  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/20 text-[10px] font-bold leading-none text-white/45"
      title={label}
      aria-label={label}
      role="img"
    >
      i
    </span>
  );
}

function DeleteEventDialog({
  title,
  confirmText,
  deleting,
  onConfirmTextChange,
  onCancel,
  onConfirm,
}: {
  title: string;
  confirmText: string;
  deleting: boolean;
  onConfirmTextChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const canDelete = confirmText.trim().toLowerCase() === "delete";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
      <div
        className="w-full max-w-md border border-white/15 bg-black p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-event-title"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-300/80">
          Delete event
        </p>
        <h2 id="delete-event-title" className="mt-3 font-display text-xl font-bold uppercase text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          This removes the event from the website immediately. It stays in the database for{" "}
          {EVENT_SOFT_DELETE_DAYS} days under <strong className="text-white/80">Deleted events</strong>, then is
          permanently removed. Type <strong className="text-white/80">delete</strong> to confirm.
        </p>
        <p className="mt-3 flex items-start gap-2 text-xs text-white/40">
          <SoftDeleteInfoIcon />
          <span>Only this event is affected. Others stay unchanged.</span>
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => onConfirmTextChange(e.target.value)}
          placeholder="Type delete"
          autoFocus
          className="mt-5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-white"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="test-btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canDelete || deleting}
            className="border border-rose-500/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300 transition hover:border-rose-400 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {deleting ? "Deleting…" : "Delete event"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventListItem({
  ev,
  onEdit,
  onArchive,
  onDelete,
}: {
  ev: EventRecord;
  onEdit: (event: EventRecord) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3" data-event-id={ev.id}>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
          {ev.event_type} · {ev.published ? "Published" : "Draft"}
        </p>
        <p className="font-semibold text-white/90">{ev.title}</p>
        <p className="text-xs text-white/45">{ev.date_display}</p>
      </div>
      <div className="flex shrink-0 flex-wrap justify-end gap-2">
        {ev.event_type === "upcoming" && (
          <button
            type="button"
            onClick={() => void onArchive(ev.id)}
            className="text-[10px] uppercase tracking-[0.15em] text-amber-300/80 hover:text-amber-200"
          >
            Archive
          </button>
        )}
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
  );
}
