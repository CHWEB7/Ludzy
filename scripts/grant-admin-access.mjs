/**
 * Grant Supabase app_metadata.admin for an existing auth user.
 * No Vercel ADMIN_EMAILS change required after this runs.
 *
 * Usage:
 *   node --env-file=.env.local scripts/grant-admin-access.mjs events-admin@ludzy.online
 *
 * Preset:
 *   npm run grant-admin:events
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.argv[2] ?? process.env.ADMIN_TEST_EMAIL ?? "events-admin@ludzy.online")
  .trim()
  .toLowerCase();

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserByEmail(targetEmail) {
  let page = 1;
  while (page <= 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const user = data.users.find((u) => u.email?.trim().toLowerCase() === targetEmail);
    if (user) return user;
    if (data.users.length < 200) break;
    page += 1;
  }
  return null;
}

const user = await findUserByEmail(email);
if (!user) {
  console.error(`No Supabase auth user found for: ${email}`);
  console.error("Create the user first: npm run create-admin:events");
  process.exit(1);
}

const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
  app_metadata: { ...user.app_metadata, admin: true },
});

if (error) {
  console.error("Failed to grant admin access:", error.message);
  process.exit(1);
}

console.log(`Admin access granted for ${email}`);
console.log("They can sign in at /admin/login without changing sensitive Vercel env vars.");
if (data.user?.id) {
  console.log(`User id: ${data.user.id}`);
}
