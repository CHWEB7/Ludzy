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
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.ADMIN_TEST_EMAIL ?? DEFAULT_EMAIL).trim().toLowerCase();
const password = process.env.ADMIN_TEST_PASSWORD ?? DEFAULT_PASSWORD;

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
});

if (error) {
  if (error.message.toLowerCase().includes("already")) {
    console.log(`User already exists: ${email}`);
    console.log("\nTo reset the password, use Supabase Dashboard → Authentication → Users.");
    console.log("\nEnsure this email is in your allowlist:");
    console.log(`  ADMIN_EMAILS=${email}`);
    console.log(`  NEXT_PUBLIC_ADMIN_EMAILS=${email}`);
    process.exit(0);
  }
  console.error("Failed to create user:", error.message);
  process.exit(1);
}

console.log("\nAdmin test user created.\n");
console.log("  Email:    ", email);
console.log("  Password: ", password);
console.log("\nAdd to .env.local and Vercel:");
console.log(`  ADMIN_EMAILS=${email}`);
console.log(`  NEXT_PUBLIC_ADMIN_EMAILS=${email}`);
console.log("\nThen sign in at /admin/login and complete MFA enrolment on first visit.");
if (data.user?.id) {
  console.log(`\nUser id: ${data.user.id}`);
}
