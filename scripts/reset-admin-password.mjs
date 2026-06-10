/**
 * Reset password (and grant admin metadata) for an existing Supabase auth user.
 *
 * Usage:
 *   node --env-file=.env.local scripts/reset-admin-password.mjs events-admin@ludzy.online
 *
 * Preset:
 *   npm run reset-admin:events
 */

import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal } from "./load-env-local.mjs";

const PRESETS = {
  events: {
    email: "events-admin@ludzy.online",
    password: "LudzyEvents-Admin2026!",
  },
};

const presetName = process.argv[2];
const preset = presetName && PRESETS[presetName] ? PRESETS[presetName] : null;
const email = (
  preset?.email ??
  process.argv[2] ??
  process.env.ADMIN_TEST_EMAIL ??
  "events-admin@ludzy.online"
)
  .trim()
  .toLowerCase();
const password =
  preset?.password ?? process.env.ADMIN_TEST_PASSWORD ?? "LudzyEvents-Admin2026!";

const loaded = loadEnvLocal();
if (loaded.ok) {
  for (const [key, value] of Object.entries(loaded.vars)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing required keys in .env.local:\n");
  if (!url) console.error("  - NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceKey) console.error("  - SUPABASE_SERVICE_ROLE_KEY");
  console.error(
    "\nGet both from Supabase → Project Settings → API:\n" +
      "  https://supabase.com/dashboard/project/czmskyxsyzoojibrvbon/settings/api\n\n" +
      "Add to .env.local (UTF-8, no quotes needed):\n" +
      "  NEXT_PUBLIC_SUPABASE_URL=https://czmskyxsyzoojibrvbon.supabase.co\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=paste_service_role_secret_here\n",
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

let user = await findUserByEmail(email);

if (!user) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { admin: true },
  });
  if (error) {
    console.error("User not found and create failed:", error.message);
    process.exit(1);
  }
  console.log("\nAdmin user created.\n");
  console.log("  Email:   ", email);
  console.log("  Password:", password);
  if (data.user?.id) console.log(`  User id: ${data.user.id}`);
  process.exit(0);
}

const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
  password,
  email_confirm: true,
  app_metadata: { ...user.app_metadata, admin: true },
});

if (error) {
  console.error("Failed to reset password:", error.message);
  process.exit(1);
}

console.log("\nAdmin password reset and access granted.\n");
console.log("  Email:   ", email);
console.log("  Password:", password);
console.log("\nSign in at https://www.ludzy.online/admin/login");
if (data.user?.id) console.log(`  User id: ${data.user.id}`);
