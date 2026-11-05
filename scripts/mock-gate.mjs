// Local stand-in for the gate backend, so the site runs without Supabase.
// Same contract as the real one: POST /verify-password { slug, password } -> 200 { content } | 401 | 429.
// Run: npm run gate:mock, then put VITE_GATE_API_URL=http://localhost:8787 in .env.local.
// It serves placeholder text from scripts/mock-gate-fixtures/, never real private content.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { timingSafeEqual } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.MOCK_GATE_PORT ?? 8787);
const PASSWORD = process.env.MOCK_GATE_PASSWORD ?? "demo-password";
const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), "mock-gate-fixtures");
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60_000;
const attempts = new Map();

const send = (res, status, body) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  res.end(JSON.stringify(body));
};

const sameString = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

const limited = (ip) => {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
};

createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST" || req.url !== "/verify-password") return send(res, 404, { error: "not found" });
  if (limited(req.socket.remoteAddress ?? "local")) return send(res, 429, { error: "rate limited" });

  let raw = "";
  for await (const chunk of req) raw += chunk;
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return send(res, 400, { error: "bad request" });
  }
  const { slug, password } = payload ?? {};
  if (typeof slug !== "string" || typeof password !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    return send(res, 400, { error: "bad request" });
  }
  if (!sameString(password, PASSWORD)) return send(res, 401, { error: "denied" });

  const content = await readFile(path.join(FIXTURES, `${slug}.md`), "utf8").catch(
    () => `## Depth (mock)\n\nPlaceholder text from the local mock gate for \`${slug}\`.`,
  );
  return send(res, 200, { content });
}).listen(PORT, () => {
  console.log(`Mock gate on http://localhost:${PORT}/verify-password (password: ${PASSWORD})`);
});
