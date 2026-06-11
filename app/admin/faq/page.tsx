import { Suspense } from "react";
import { AdminFaqsPanel } from "@/components/admin/AdminFaqsPanel";

export default function AdminFaqPage() {
  return (
    <Suspense fallback={<div className="px-6 py-24 text-sm text-white/50">Loading…</div>}>
      <AdminFaqsPanel />
    </Suspense>
  );
}
