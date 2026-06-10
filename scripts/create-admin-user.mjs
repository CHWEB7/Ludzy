/**
 * Create a test admin user in Supabase Auth.
 *
 * Usage (Node 20+):
 *   node --env-file=.env.local scripts/create-admin-user.mjs
 *
 * Or with explicit env:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-admin-user.mjs
 *
 * Optional overrides:
 *   ADMIN_TEST_EMAIL=test-admin@ludzy.online
 *   ADMIN_TEST_PASSWORD=YourStrongPassword123!
 *
 * Presets:
 *   node --env-file=.env.local scripts/create-admin-user.mjs events
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const PRESETS = {
  events: {
    email: "events-admin@ludzy.online",
    password: "LudzyEvents-Admin2026!",
  },
};

const DEFAULT_EMAIL = "test-admin@ludzy.online";
const DEFAULT_PASSWORD = "LudzyAdmin-Test2026!";

function generatePassword() {
  const suffix = randomBytes(6).toString("base64url");
  return `LudzyTest-${suffix}!9`;
}

function validatePassword(password) {
  const errors = [];
  if (password.length < 12) errors.push("at least 12 characters");
  if (!/[A-Z]/.test(password)) errors.push("uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("special character");
  return errors;
}

const preset = process.argv[2] ? PRESETS[process.argv[2]] : undefined;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (
  process.env.ADMIN_TEST_EMAIL ??
  preset?.email ??
  DEFAULT_EMAIL
).trim().toLowerCase();
const password = process.env.ADMIN_TEST_PASSWORD ?? preset?.password ?? DEFAULT_PASSWORD;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Add them to .env.local, then run:\n" +
      "  node --env-file=.env.local scripts/create-admin-user.mjs",
  );
  process.exit(1);
}

const passwordErrors = validatePassword(password);
if (passwordErrors.length > 0) {
  console.error(`Password must include: ${passwordErrors.join(", ")}`);
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  app_metadata: { admin: true },
});

if (error) {
  if (error.message.toLowerCase().includes("already")) {
    const { data: listed } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = listed?.users.find(
      (user) => user.email?.trim().toLowerCase() === email,
    );
    if (existing) {
      await supabase.auth.admin.updateUserById(existing.id, {
        app_metadata: { ...existing.app_metadata, admin: true },
      });
    }
    console.log(`User already exists: ${email}`);
    console.log("Granted app_metadata.admin = true in Supabase.");
    console.log("\nThey can sign in at /admin/login (no Vercel ADMIN_EMAILS change needed).");
    console.log("\nOptional allowlist fallback:");
    console.log(`  ADDITIONAL_ADMIN_EMAILS=${email}`);
    process.exit(0);
  }
  console.error("Failed to create user:", error.message);
  process.exit(1);
}

console.log("\nAdmin test user created.\n");
console.log("  Email:    ", email);
console.log("  Password: ", password);
console.log("\nOptional allowlist fallback (not required when app_metadata.admin is set):");
console.log(`  ADDITIONAL_ADMIN_EMAILS=${email}`);
console.log("\nThen sign in at /admin/login and complete MFA enrolment on first visit.");
if (data.user?.id) {
  console.log(`\nUser id: ${data.user.id}`);
}
