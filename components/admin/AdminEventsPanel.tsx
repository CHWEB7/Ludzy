"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";
import { isAdminEmail } from "@/lib/auth/admin-access";
import type { EventRecord } from "@/lib/events-db";

type EventForm = {
  event_type: "previous" | "upcoming";
  title: string;
  slug: string;
  date_display: string;
  event_date: string;
  venue: string;
  location: string;
  time_display: string;
  set_type: string;
  excerpt: string;
  summary: string;
  details: string;
  body: string;
  image_url: string;
  published: boolean;
  sort_order: number;
};

const emptyForm: EventForm = {
  event_type: "previous",
  title: "",
  slug: "",
  date_display: "",
  event_date: "",
  venue: "",
  location: "",
  time_display: "",
  set_type: "",
  excerpt: "",
  summary: "",
  details: "",
  body: "",
  image_url: "",
  published: false,
  sort_order: 0,
};

async function getAccessToken(): Promise<string | null> {
  const supabase = createAdminBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export function AdminEventsPanel() {
  const router = useRouter();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    if (!data.session?.user || !isAdminEmail(data.session.user.email)) {
      router.replace("/admin/login");
      return false;
    }
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal.currentLevel !== "aal2") {
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
      const json = (await res.json()) as { events?: EventRecord[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to load events");
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
      date_display: event.date_display,
      event_date: event.event_date?.slice(0, 10) ?? "",
      venue: event.venue ?? "",
      location: event.location ?? "",
      time_display: event.time_display ?? "",
      set_type: event.set_type ?? "",
      excerpt: event.excerpt ?? "",
      summary: event.summary ?? "",
      details: event.details ?? "",
      body: event.body.join("\n\n"),
      image_url: event.image_url ?? "",
      published: event.published,
      sort_order: event.sort_order,
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
      const headers = await authHeaders();
      const payload = {
        ...form,
        body: form.body
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean),
        event_date: form.event_date || null,
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

  async function signOut() {
    const supabase = createAdminBrowserClient();
    await supabase.auth.signOut();
    sessionStorage.clear();
    router.replace("/admin/login");
  }

  const inputClass =
    "mt-1 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-white";

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-[0.08em]">
            Manage events
          </h1>
          <p className="mt-2 text-sm text-white/45">
            Add past recaps and upcoming dates. Publish when ready to show on the public site.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => startNew("previous")} className="test-btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            + Past event
          </button>
          <button type="button" onClick={() => startNew("upcoming")} className="test-btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            + Upcoming
          </button>
          <button type="button" onClick={() => void signOut()} className="test-btn-primary px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            Sign out
          </button>
        </div>
      </div>

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
            Date (display) *
            <input required value={form.date_display} onChange={(e) => setForm({ ...form, date_display: e.target.value })} placeholder="Saturday 24 May 2026" className={inputClass} />
          </label>

          <label className="block text-xs text-white/50">
            Sort date (optional)
            <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className={inputClass} />
          </label>

          {form.event_type === "previous" ? (
            <>
              <label className="block text-xs text-white/50">
                Venue
                <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={inputClass} />
              </label>
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
                Time
                <input value={form.time_display} onChange={(e) => setForm({ ...form, time_display: e.target.value })} className={inputClass} />
              </label>
              <label className="block text-xs text-white/50">
                Location
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
              </label>
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
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">All events</p>
          {loading ? (
            <p className="text-sm text-white/40">Loading…</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-white/40">No events yet. Create one or run the seed SQL.</p>
          ) : (
            <ul className="space-y-3">
              {events.map((ev) => (
                <li key={ev.id} className="border border-white/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                        {ev.event_type} · {ev.published ? "Published" : "Draft"}
                      </p>
                      <p className="font-semibold text-white/90">{ev.title}</p>
                      <p className="text-xs text-white/45">{ev.date_display}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => startEdit(ev)} className="text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white">Edit</button>
                      <button type="button" onClick={() => void handleDelete(ev.id)} className="text-[10px] uppercase tracking-[0.15em] text-rose-400/70 hover:text-rose-300">Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
