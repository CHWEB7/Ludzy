"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminFaqsSetup } from "@/components/admin/AdminFaqsSetup";
import { AdminNav } from "@/components/admin/AdminNav";
import { verifyAdminAccessToken } from "@/lib/auth/check-admin-email-client";
import type { FaqRecord } from "@/lib/faqs-db";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";

type FaqForm = {
  question: string;
  answer: string;
  published: boolean;
};

const emptyForm: FaqForm = {
  question: "",
  answer: "",
  published: false,
};

async function getAccessToken(): Promise<string | null> {
  const supabase = createAdminBrowserClient();
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.access_token) return null;

  const expiresAtMs = (session.expires_at ?? 0) * 1000;
  if (expiresAtMs > 0 && expiresAtMs < Date.now() + 60_000) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    return refreshed.session?.access_token ?? session.access_token;
  }

  return session.access_token;
}

export function AdminFaqsPanel() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FaqRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FaqForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; question: string } | null>(null);
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
    const { data, error: userError } = await supabase.auth.getUser();
    const user = data.user;
    if (userError || !user) {
      router.replace("/admin/login");
      return false;
    }

    const token = (await supabase.auth.getSession()).data.session?.access_token;
    if (token) {
      const { allowed, reason } = await verifyAdminAccessToken(token);
      if (!allowed && reason !== "request_failed") {
        router.replace("/admin/login");
        return false;
      }
    }

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!aal || aal.currentLevel !== "aal2") {
      router.replace("/admin/mfa");
      return false;
    }
    return true;
  }, [router]);

  const loadFaqs = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true);
    setError(null);
    try {
      if (!(await ensureAuthed())) return;
      const headers = await authHeaders();
      const res = await fetch("/api/admin/faqs", { headers });
      const json = (await res.json()) as {
        faqs?: FaqRecord[];
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        if (json.code === "TABLE_MISSING") {
          setError(null);
          setFaqs([]);
          return;
        }
        throw new Error(json.error ?? "Failed to load FAQs");
      }
      setFaqs(json.faqs ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, ensureAuthed]);

  useEffect(() => {
    void loadFaqs();
  }, [loadFaqs]);

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(faq: FaqRecord) {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      published: faq.published,
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const headers = await authHeaders();
      const url = editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      setForm(emptyForm);
      setEditingId(null);
      await loadFaqs({ silent: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function persistOrder(nextFaqs: FaqRecord[]) {
    setReordering(true);
    setError(null);
    try {
      const headers = await authHeaders();
      const res = await fetch("/api/admin/faqs/reorder", {
        method: "POST",
        headers,
        body: JSON.stringify({ ordered_ids: nextFaqs.map((faq) => faq.id) }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Reorder failed");
      setFaqs(nextFaqs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reorder failed");
      await loadFaqs({ silent: true });
    } finally {
      setReordering(false);
    }
  }

  function moveFaq(id: string, direction: "up" | "down") {
    const index = faqs.findIndex((faq) => faq.id === id);
    if (index < 0) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const next = [...faqs];
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    void persistOrder(next);
  }

  function clearEditorIfEditing(id: string) {
    if (editingId !== id) return;
    setEditingId(null);
    setForm(emptyForm);
  }

  function requestDelete(id: string) {
    const target = faqs.find((faq) => faq.id === id);
    if (!target) return;
    setDeleteConfirmText("");
    setDeleteTarget({ id: target.id, question: target.question });
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
      const res = await fetch(`/api/admin/faqs/${deleteTarget.id}`, {
        method: "DELETE",
        headers,
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Delete failed");

      setFaqs((current) => current.filter((faq) => faq.id !== deleteTarget.id));
      clearEditorIfEditing(deleteTarget.id);
      cancelDelete();
      await loadFaqs({ silent: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
    }
  }

  const inputClass =
    "mt-1 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-white";

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <AdminNav
        title="FAQs"
        description="Add, edit, reorder, and publish frequently asked questions."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startNew}
          className="test-btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]"
        >
          + New FAQ
        </button>
      </div>

      <AdminFaqsSetup onReady={() => void loadFaqs({ silent: true })} />

      {error && <p className="mb-6 text-sm text-rose-400">{error}</p>}

      {deleteTarget && (
        <DeleteFaqDialog
          question={deleteTarget.question}
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
            {editingId ? "Edit FAQ" : "New FAQ"}
          </p>

          <label className="block text-xs text-white/50">
            Question *
            <input
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className={inputClass}
            />
          </label>

          <label className="block text-xs text-white/50">
            Answer *
            <textarea
              required
              rows={8}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className={inputClass}
            />
          </label>

          <label className="flex items-center gap-2 text-xs text-white/60">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published (visible on /faq)
          </label>

          <button
            type="submit"
            disabled={saving}
            className="test-btn-primary w-full py-3 text-[11px] font-bold uppercase tracking-[0.25em] disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Update FAQ" : "Create FAQ"}
          </button>
        </form>

        <div>
          <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
            All FAQs
          </p>
          {loading ? (
            <p className="text-sm text-white/40">Loading…</p>
          ) : faqs.length === 0 ? (
            <p className="text-sm text-white/40">No FAQs yet. Create one above.</p>
          ) : (
            <ul className="space-y-3">
              {faqs.map((faq, index) => (
                <li key={faq.id} className="border border-white/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                        {faq.published ? "Published" : "Draft"}
                      </p>
                      <p className="font-semibold text-white/90">{faq.question}</p>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/45">
                        {faq.answer}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={reordering || index === 0}
                          onClick={() => moveFaq(faq.id, "up")}
                          className="text-[10px] uppercase tracking-[0.15em] text-white/35 hover:text-white disabled:opacity-30"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          disabled={reordering || index === faqs.length - 1}
                          onClick={() => moveFaq(faq.id, "down")}
                          className="text-[10px] uppercase tracking-[0.15em] text-white/35 hover:text-white disabled:opacity-30"
                        >
                          Down
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(faq)}
                          className="text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDelete(faq.id)}
                          className="text-[10px] uppercase tracking-[0.15em] text-rose-400/70 hover:text-rose-300"
                        >
                          Delete
                        </button>
                      </div>
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

function DeleteFaqDialog({
  question,
  confirmText,
  deleting,
  onConfirmTextChange,
  onCancel,
  onConfirm,
}: {
  question: string;
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
        aria-labelledby="delete-faq-title"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-300/80">
          Delete FAQ
        </p>
        <h2 id="delete-faq-title" className="mt-3 font-display text-xl font-bold uppercase text-white">
          {question}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          This permanently removes the FAQ from the website and database. Type{" "}
          <strong className="text-white/80">delete</strong> to confirm.
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
            {deleting ? "Deleting…" : "Delete FAQ"}
          </button>
        </div>
      </div>
    </div>
  );
}
