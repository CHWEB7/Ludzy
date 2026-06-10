import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
export const ENV_LOCAL_PATH = join(projectRoot, ".env.local");

function decodeEnvBuffer(buf) {
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return buf.toString("utf16le");
  }
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    return buf.toString("utf16be");
  }
  // UTF-16 LE without BOM (Notepad "Unicode") — ASCII chars at even indices, 0x00 at odd
  if (buf.length > 6 && buf[1] === 0x00 && buf[3] === 0x00 && buf[5] === 0x00) {
    return buf.toString("utf16le");
  }
  return buf.toString("utf8").replace(/^\uFEFF/, "");
}

export function loadEnvLocal() {
  if (!existsSync(ENV_LOCAL_PATH)) {
    return { ok: false, path: ENV_LOCAL_PATH, vars: {}, encoding: null, error: "file not found" };
  }

  const buf = readFileSync(ENV_LOCAL_PATH);
  const encoding =
    buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe
      ? "utf16le-bom"
      : buf.length > 6 && buf[1] === 0x00 && buf[3] === 0x00
        ? "utf16le"
        : "utf8";

  const raw = decodeEnvBuffer(buf);
  const vars = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) vars[key] = value;
  }

  return { ok: true, path: ENV_LOCAL_PATH, vars, encoding };
}
