/**
 * Apply deleted_at soft-delete column in Supabase.
 * Reads: <project-root>/.env.local
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { loadEnvLocal } from "./load-env-local.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, "..", "supabase", "events-soft-delete-migration.sql");

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

async function connectAndMigrate(connectionString) {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    const sql = readFileSync(sqlPath, "utf8");
    await client.query(sql);

    const column = await client.query(`
      select column_name
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'events'
        and column_name = 'deleted_at'
    `);

    return column.rows.length > 0;
  } finally {
    await client.end();
  }
}

const loaded = loadEnvLocal();
if (!loaded.ok) {
  console.error(`Env file not found:\n  ${loaded.path}`);
  process.exit(1);
}

const connectionStrings = buildConnectionStrings(loaded.vars);
if (connectionStrings.length === 0) {
  console.error("Missing Supabase DB credentials in .env.local");
  process.exit(1);
}

let lastError = null;
for (let i = 0; i < connectionStrings.length; i++) {
  try {
    console.log(`Connecting (method ${i + 1}/${connectionStrings.length})…`);
    const ok = await connectAndMigrate(connectionStrings[i]);
    if (ok) {
      console.log("Success: deleted_at soft-delete column is ready.");
      process.exit(0);
    }
    console.error("Migration ran but deleted_at column was not found.");
    process.exit(1);
  } catch (err) {
    lastError = err instanceof Error ? err : new Error(String(err));
    if (!lastError.message.toLowerCase().includes("password authentication failed")) {
      break;
    }
  }
}

console.error("Migration failed:", lastError?.message ?? "Unknown error");
process.exit(1);
