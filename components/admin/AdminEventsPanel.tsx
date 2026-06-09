"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { LocationPicker } from "@/components/admin/LocationPicker";
import { checkAdminEmailAllowed } from "@/lib/auth/check-admin-email-client";
import {
  formatBritishLongDate,
  toDateInputValue,
  toTimeInputValue,
} from "@/lib/event-date-format";
import { EVENTS_TABLE_SETUP_MESSAGE } from "@/lib/supabase/table-errors";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);

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
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user || !(await checkAdminEmailAllowed(data.session.user.email ?? "")).allowed) {
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

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!(await ensureAuthed())) return;
      const headers = await authHeaders();
      const res = await fetch("/api/admin/events", { headers });
      const json = (await res.json()) as {
        events?: EventRecord[];
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        if (json.code === "TABLE_MISSING") {
          setSetupRequired(true);
          setError(null);
          setEvents([]);
          return;
        }
        throw new Error(json.error ?? "Failed to load events");
      }
      setSetupRequired(false);
      setEvents(json.events ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, ensureAuthed]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (loading) return;
    const editId = searchParams.get("edit");
    const type = searchParams.get("type");
    if (editId) {
      const ev = events.find((e) => e.id === editId);
      if (ev) startEdit(ev);
    } else if (type === "previous" || type === "upcoming") {
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
      published: event.published,
    });
  }

  async function handleUpload(file: File) {
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
      setForm((f) => ({ ...f, image_url: json.url ?? "" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
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
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event permanently?")) return;
    try {
      const headers = await authHeaders();
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE", headers });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Delete failed");
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
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

      {setupRequired && (
        <div className="mb-6 space-y-4 rounded border border-amber-500/30 bg-amber-950/30 px-4 py-4 text-sm text-amber-100/90">
          <p>{EVENTS_TABLE_SETUP_MESSAGE}</p>
          <ol className="list-decimal space-y-2 pl-5 text-amber-100/75">
            <li>Open your Supabase project → <strong className="text-amber-100">SQL Editor</strong></li>
            <li>Paste and run the file <code className="text-amber-50">supabase/events-schema.sql</code> from this repo</li>
            <li>In Supabase → <strong className="text-amber-100">Table Editor</strong>, confirm you see an <code className="text-amber-50">events</code> table</li>
            <li>Refresh this page (wait ~30 seconds after running SQL if it still errors)</li>
          </ol>
          <p className="text-xs text-amber-200/60">
            Use the same Supabase project as your Vercel env vars{" "}
            <code className="text-amber-50">NEXT_PUBLIC_SUPABASE_URL</code>.
          </p>
        </div>
      )}

      {error && <p className="mb-6 text-sm text-rose-400">{error}</p>}

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
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleUpload(f); }} className="mt-1 text-sm text-white/60" />
            {uploading && <span className="ml-2 text-xs text-white/40">Uploading…</span>}
            {form.image_url && (
              <p className="mt-2 truncate text-xs text-emerald-400/80">{form.image_url}</p>
            )}
          </label>

          <label className="flex items-center gap-2 text-xs text-white/60">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published (visible on website)
          </label>

          <button type="submit" disabled={saving} className="test-btn-primary w-full py-3 text-[11px] font-bold uppercase tracking-[0.25em] disabled:opacity-50">
            {saving ? "Saving…" : editingId ? "Update event" : "Create event"}
          </button>
        </form>

        <div>
          <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
            All events
          </p>
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
                        <EventListItem ev={ev} onEdit={startEdit} onDelete={handleDelete} />
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
                        <EventListItem ev={ev} onEdit={startEdit} onDelete={handleDelete} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventListItem({
  ev,
  onEdit,
  onDelete,
}: {
  ev: EventRecord;
  onEdit: (event: EventRecord) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
          {ev.event_type} · {ev.published ? "Published" : "Draft"}
        </p>
        <p className="font-semibold text-white/90">{ev.title}</p>
        <p className="text-xs text-white/45">{ev.date_display}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onEdit(ev)}
          className="text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => void onDelete(ev.id)}
          className="text-[10px] uppercase tracking-[0.15em] text-rose-400/70 hover:text-rose-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
