import { Suspense } from "react";
import { AdminEventsPanel } from "@/components/admin/AdminEventsPanel";

export default function AdminEventsPage() {
  return (
    <Suspense fallback={<div className="px-6 py-24 text-sm text-white/50">Loading…</div>}>
      <AdminEventsPanel />
    </Suspense>
  );
}
