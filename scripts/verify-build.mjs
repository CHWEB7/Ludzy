/**
 * Run typecheck + next build and always write logs to verify-build.log
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logPath = join(root, "verify-build.log");
const lines = [];

function run(label, args) {
  lines.push(`\n=== ${label} ===\n`);
  const result = spawnSync(args[0], args.slice(1), {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  lines.push(result.stdout ?? "");
  lines.push(result.stderr ?? "");
  lines.push(`\nExit code: ${result.status ?? "unknown"}\n`);
  writeFileSync(logPath, lines.join(""), "utf8");
  return result.status ?? 1;
}

const tscCode = run("tsc --noEmit", ["npx", "tsc", "--noEmit"]);
if (tscCode !== 0) {
  console.error(`Typecheck failed. See ${logPath}`);
  process.exit(tscCode);
}

const buildCode = run("next build", ["npx", "next", "build"]);
if (buildCode !== 0) {
  console.error(`Build failed. See ${logPath}`);
  process.exit(buildCode);
}

console.log(`Build OK. Log: ${logPath}`);
