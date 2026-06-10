import { loadEnvLocal, ENV_LOCAL_PATH } from "./load-env-local.mjs";

const loaded = loadEnvLocal();
console.log("Env file path:", ENV_LOCAL_PATH);
console.log("File found:", loaded.ok);
console.log("Detected encoding:", loaded.encoding ?? "n/a");

if (!loaded.ok) {
  process.exit(1);
}

const keys = Object.keys(loaded.vars);
console.log("Variables found:", keys.length ? keys.join(", ") : "(none)");

for (const key of [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_DB_PASSWORD",
  "ADMIN_EMAILS",
]) {
  const value = loaded.vars[key];
  console.log(
    `${key}:`,
    value && value.length > 0 ? `set (${value.length} chars)` : "MISSING or empty",
  );
}
