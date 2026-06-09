import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {reason === "idle" && (
          <p className="mb-6 rounded border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-200/90">
            Signed out due to inactivity. Please sign in again with MFA.
          </p>
        )}
        <AdminLoginForm />
      </div>
    </div>
  );
}
