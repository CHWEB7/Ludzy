/**
 * Create public.events in Supabase via direct Postgres connection.
 * Reads: <project-root>/.env.local
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { ENV_LOCAL_PATH, loadEnvLocal } from "./load-env-local.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaSqlPath = join(__dirname, "..", "supabase", "events-schema-minimal.sql");
const gallerySqlPath = join(__dirname, "..", "supabase", "events-gallery-migration.sql");

const PLACEHOLDERS = new Set([
  "your_new_password_here",
  "your_database_password",
  "PUT_YOUR_NEW_PASSWORD_HERE",
]);

function buildConnectionStrings(vars) {
  if (vars.SUPABASE_DB_URL) {
    return [vars.SUPABASE_DB_URL];
  }

  const url = vars.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const password = vars.SUPABASE_DB_PASSWORD ?? "";
  const ref = url.match(/https:\/\/([a-z0-9-]+)\.supabase\.co/i)?.[1];
  if (!ref || !password) return [];

  const enc = encodeURIComponent(password);
  return [
    `postgresql://postgres:${enc}@db.${ref}.supabase.co:5432/postgres`,
    `postgresql://postgres.${ref}:${enc}@db.${ref}.supabase.co:5432/postgres`,
  ];
}

function printEnvSummary(vars) {
  const password = vars.SUPABASE_DB_PASSWORD ?? "";
  console.log(`Env file: ${ENV_LOCAL_PATH}`);
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${vars.NEXT_PUBLIC_SUPABASE_URL ? "set" : "MISSING"}`);
  console.log(`SUPABASE_DB_PASSWORD: ${password ? "set (" + password.length + " chars)" : "MISSING"}`);
}

async function connectAndSetup(connectionString) {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    const schemaSql = readFileSync(schemaSqlPath, "utf8");
    await client.query(schemaSql);

    const gallerySql = readFileSync(gallerySqlPath, "utf8");
    await client.query(gallerySql);

    const check = await client.query("select to_regclass('public.events') as events_table");
    const gallery = await client.query(`
      select column_name
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'events'
        and column_name = 'gallery_images'
    `);
    const bucket = await client.query(`
      select public from storage.buckets where id = 'event-images'
    `);

    return (
      check.rows[0]?.events_table === "events" &&
      gallery.rows.length > 0 &&
      bucket.rows[0]?.public === true
    );
  } finally {
    await client.end();
  }
}

const loaded = loadEnvLocal();
if (!loaded.ok) {
  console.error(`Env file not found:\n  ${loaded.path}\n\nCopy env.local.template to .env.local`);
  process.exit(1);
}

const vars = loaded.vars;
printEnvSummary(vars);

if (PLACEHOLDERS.has(vars.SUPABASE_DB_PASSWORD ?? "")) {
  console.error("\nReplace the placeholder password in .env.local with your real database password.");
  process.exit(1);
}

const connectionStrings = buildConnectionStrings(vars);
if (connectionStrings.length === 0) {
  console.error("\nMissing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_DB_PASSWORD in .env.local");
  process.exit(1);
}

let lastError = null;
for (let i = 0; i < connectionStrings.length; i++) {
  try {
    console.log(`Connecting (method ${i + 1}/${connectionStrings.length})…`);
    const ok = await connectAndSetup(connectionStrings[i]);
    if (ok) {
      console.log("Success: events table, gallery_images column, and public image bucket are ready.");
      process.exit(0);
    }
    console.error("SQL ran but events table was not found.");
    process.exit(1);
  } catch (err) {
    lastError = err instanceof Error ? err : new Error(String(err));
    if (!lastError.message.toLowerCase().includes("password authentication failed")) {
      break;
    }
  }
}

console.error("Setup failed:", lastError?.message ?? "Unknown error");

if (lastError?.message.toLowerCase().includes("password authentication failed")) {
  console.error(
    "\nThe database password in .env.local does not match Supabase.\n\n" +
      "1. Open https://supabase.com/dashboard/project/czmskyxsyzoojibrvbon/settings/database\n" +
      "2. Click 'Reset database password' and set a new one (avoid # characters)\n" +
      "3. Update .env.local: SUPABASE_DB_PASSWORD=your_new_password\n" +
      "4. Save as UTF-8 in Cursor, then run: npm run setup-events\n\n" +
      "Or paste the full URI from Supabase → Connect → URI into .env.local as:\n" +
      "  SUPABASE_DB_URL=postgresql://...\n",
  );
}

process.exit(1);
