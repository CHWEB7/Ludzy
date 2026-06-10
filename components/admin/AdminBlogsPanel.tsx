"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminBlogsSetup } from "@/components/admin/AdminBlogsSetup";
import { AdminNav } from "@/components/admin/AdminNav";
import { verifyAdminAccessToken } from "@/lib/auth/check-admin-email-client";
import { BLOG_TAGS } from "@/lib/blog-tags";
import type { BlogRecord } from "@/lib/blogs-db";
import {
  eventImageUploadHint,
  prepareEventImageFile,
} from "@/lib/event-image-prepare";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";

type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image_url: string;
  gallery_images: string[];
  tags: string[];
  published: boolean;
};

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  image_url: "",
  gallery_images: [],
  tags: [],
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

export function AdminBlogsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadingRef = useRef(false);
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
    const { data, error: userError } = await supabase.auth.getUser();
    const user = data.user;
    if (userError || !user) {
      if (!uploadingRef.current) router.replace("/admin/login");
      return false;
    }

    const token = (await supabase.auth.getSession()).data.session?.access_token;
    if (token) {
      const { allowed, reason } = await verifyAdminAccessToken(token);
      if (!allowed && reason !== "request_failed") {
        if (!uploadingRef.current) router.replace("/admin/login");
        return false;
      }
    }

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!aal || aal.currentLevel !== "aal2") {
      if (!uploadingRef.current) router.replace("/admin/mfa");
      return false;
    }
    return true;
  }, [router]);

  const loadBlogs = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true);
    setError(null);
    try {
      if (!(await ensureAuthed())) return;
      const headers = await authHeaders();
      const res = await fetch("/api/admin/blogs", { headers });
      const json = (await res.json()) as {
        blogs?: BlogRecord[];
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        if (json.code === "TABLE_MISSING") {
          setError(null);
          setBlogs([]);
          return;
        }
        throw new Error(json.error ?? "Failed to load blogs");
      }
      setBlogs(json.blogs ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, ensureAuthed]);

  const appliedSearchKey = useRef<string | null>(null);

  useEffect(() => {
    void loadBlogs();
  }, [loadBlogs]);

  useEffect(() => {
    if (loading) return;

    const editId = searchParams.get("edit");
    const searchKey = editId ? `edit:${editId}` : null;
    if (!searchKey || appliedSearchKey.current === searchKey) return;

    if (editId) {
      const blog = blogs.find((item) => item.id === editId);
      if (!blog) return;
      appliedSearchKey.current = searchKey;
      startEdit(blog);
    }
  }, [searchParams, blogs, loading]);

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(blog: BlogRecord) {
    setEditingId(blog.id);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt ?? "",
      body: blog.body.join("\n\n"),
      image_url: blog.image_url ?? "",
      gallery_images: blog.gallery_images ?? [],
      tags: blog.tags,
      published: blog.published,
    });
  }

  function toggleTag(tagId: string) {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tagId)
        ? current.tags.filter((id) => id !== tagId)
        : [...current.tags, tagId],
    }));
  }

  async function handleUpload(file: File, target: "cover" | "gallery" = "cover") {
    uploadingRef.current = true;
    setUploading(true);
    setUploadStatus("Optimising image…");
    setUploadError(null);
    try {
      const prepared = await prepareEventImageFile(file, target);
      setUploadStatus("Uploading…");

      const token = await getAccessToken();
      if (!token) {
        setUploadError("Session expired. Save your work, then sign in again.");
        return;
      }
      const fd = new FormData();
      fd.append("file", prepared.file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setUploadError(json.error ?? "Upload failed");
        return;
      }
      if (target === "gallery") {
        setForm((f) => ({
          ...f,
          gallery_images: json.url ? [...f.gallery_images, json.url] : f.gallery_images,
        }));
      } else {
        setForm((f) => ({ ...f, image_url: json.url ?? "" }));
      }
      setUploadStatus(
        `Uploaded ${prepared.width}×${prepared.height}px (${Math.round(prepared.outputBytes / 1024)} KB)`,
      );
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
      setUploadStatus(null);
    } finally {
      uploadingRef.current = false;
      setUploading(false);
    }
  }

  async function handleGalleryFiles(files: FileList | File[]) {
    const list = Array.from(files);
    for (const file of list) {
      await handleUpload(file, "gallery");
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
      const headers = await authHeaders();
      const payload = {
        ...form,
        body: form.body
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean),
      };

      const url = editingId ? `/api/admin/blogs/${editingId}` : "/api/admin/blogs";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      setForm(emptyForm);
      setEditingId(null);
      await loadBlogs({ silent: true });
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

  function requestDelete(id: string) {
    const target = blogs.find((blog) => blog.id === id);
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
      const res = await fetch(`/api/admin/blogs/${deleteTarget.id}`, {
        method: "DELETE",
        headers,
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Delete failed");

      setBlogs((current) => current.filter((blog) => blog.id !== deleteTarget.id));
      clearEditorIfEditing(deleteTarget.id);
      cancelDelete();
      await loadBlogs({ silent: true });
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
        title="Blog"
        description="Create, edit, and publish blog posts with genre tags."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startNew}
          className="test-btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]"
        >
          + New post
        </button>
      </div>

      <AdminBlogsSetup onReady={() => void loadBlogs({ silent: true })} />

      {error && <p className="mb-6 text-sm text-rose-400">{error}</p>}

      {deleteTarget && (
        <DeleteBlogDialog
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
            {editingId ? "Edit post" : "New post"}
          </p>

          <label className="block text-xs text-white/50">
            Title *
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </label>

          <label className="block text-xs text-white/50">
            URL slug
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto-generated if empty"
              className={inputClass}
            />
          </label>

          <label className="block text-xs text-white/50">
            Excerpt *
            <textarea
              required
              rows={3}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className={inputClass}
            />
          </label>

          <label className="block text-xs text-white/50">
            Body (paragraphs separated by blank lines)
            <textarea
              rows={8}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className={inputClass}
            />
          </label>

          <fieldset className="block text-xs text-white/50">
            <legend className="text-xs text-white/50">Tags</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {BLOG_TAGS.map((tag) => (
                <label
                  key={tag.id}
                  className={`flex cursor-pointer items-center gap-2 border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] transition ${
                    form.tags.includes(tag.id)
                      ? "border-white/40 bg-white/[0.06] text-white"
                      : "border-white/10 text-white/45 hover:border-white/25"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.tags.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                    className="sr-only"
                  />
                  {tag.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block text-xs text-white/50">
            Cover image
            <p className="mt-1 text-[10px] leading-relaxed text-white/35">
              {eventImageUploadHint("cover")} Portrait photos are centre-cropped to fit.
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleUpload(f, "cover");
                e.target.value = "";
              }}
              className="mt-1 text-sm text-white/60 disabled:opacity-50"
            />
            {(uploading || uploadStatus) && (
              <span className="ml-2 text-xs text-white/40">
                {uploading ? uploadStatus ?? "Working…" : uploadStatus}
              </span>
            )}
            {uploadError && (
              <p className="mt-2 text-xs text-rose-400" role="alert">
                {uploadError}
              </p>
            )}
            {form.image_url && (
              <div className="mt-2 space-y-2">
                <div className="relative aspect-[16/10] w-full max-w-xs overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image_url}
                    alt=""
                    className="h-full w-full object-cover brightness-90"
                  />
                </div>
                <p className="truncate text-xs text-emerald-400/80">{form.image_url}</p>
              </div>
            )}
          </label>

          <div className="block text-xs text-white/50">
            <span>Gallery images (optional)</span>
            <p className="mt-1 text-[10px] leading-relaxed text-white/35">
              {eventImageUploadHint("gallery")} Upload one or several at a time.
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={uploading}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length > 0) void handleGalleryFiles(files);
                e.target.value = "";
              }}
              className="mt-1 text-sm text-white/60 disabled:opacity-50"
            />
            {form.gallery_images.length > 0 && (
              <ul className="mt-3 space-y-2">
                {form.gallery_images.map((url, index) => (
                  <li key={`${url}-${index}`} className="flex items-center gap-3">
                    <div className="relative h-12 w-20 shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover brightness-90" />
                    </div>
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

          <label className="flex items-center gap-2 text-xs text-white/60">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published (visible on website)
          </label>

          <button
            type="submit"
            disabled={saving}
            className="test-btn-primary w-full py-3 text-[11px] font-bold uppercase tracking-[0.25em] disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Update post" : "Create post"}
          </button>
        </form>

        <div>
          <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
            All posts
          </p>
          {loading ? (
            <p className="text-sm text-white/40">Loading…</p>
          ) : blogs.length === 0 ? (
            <p className="text-sm text-white/40">No posts yet. Create one above.</p>
          ) : (
            <ul className="space-y-3">
              {blogs.map((blog) => (
                <li key={blog.id} className="border border-white/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                        {blog.published ? "Published" : "Draft"}
                      </p>
                      <p className="font-semibold text-white/90">{blog.title}</p>
                      <p className="text-xs text-white/45">/{blog.slug}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(blog)}
                        className="text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => requestDelete(blog.id)}
                        className="text-[10px] uppercase tracking-[0.15em] text-rose-400/70 hover:text-rose-300"
                      >
                        Delete
                      </button>
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

function DeleteBlogDialog({
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
        aria-labelledby="delete-blog-title"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-300/80">
          Delete post
        </p>
        <h2 id="delete-blog-title" className="mt-3 font-display text-xl font-bold uppercase text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          This permanently removes the post from the website and database. Type{" "}
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
            {deleting ? "Deleting…" : "Delete post"}
          </button>
        </div>
      </div>
    </div>
  );
}
