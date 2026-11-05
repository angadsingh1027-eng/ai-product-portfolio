import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Nothing on this site is gated (ADR-014). This test fails if gate code or gate wording returns.
// The patterns are built from fragments so this file does not match itself.
const patterns = [
  new RegExp("Depth" + "Gate"),
  new RegExp("VITE_" + "GATE"),
  new RegExp("verify" + "-password"),
  new RegExp("\\bgat" + "ed\\b", "i"),
  new RegExp("\\bgat" + "e\\b", "i"),
];

const root = path.resolve(__dirname, "../..");
const skip = new Set(["node_modules", ".output", ".git", ".wrangler", "ui", "routeTree.gen.ts"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|json|md)$/.test(name)) out.push(full);
  }
  return out;
}

describe("no gate", () => {
  it("leaves no gate code or wording in the source or the content", () => {
    const files = [
      ...walk(path.join(root, "src")),
      ...walk(path.join(root, "content")),
      path.join(root, "package.json"),
    ];
    const self = path.resolve(__filename);
    for (const file of files) {
      if (path.resolve(file) === self) continue;
      const body = readFileSync(file, "utf8");
      for (const re of patterns) {
        expect(re.test(body), `${path.relative(root, file)} matches ${re}`).toBe(false);
      }
    }
  });
});
