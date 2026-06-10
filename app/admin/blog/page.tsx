import { Suspense } from "react";
import { AdminBlogsPanel } from "@/components/admin/AdminBlogsPanel";

export default function AdminBlogPage() {
  return (
    <Suspense fallback={<div className="px-6 py-24 text-sm text-white/50">Loading…</div>}>
      <AdminBlogsPanel />
    </Suspense>
  );
}
