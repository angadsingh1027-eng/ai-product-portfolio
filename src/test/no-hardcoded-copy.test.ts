import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// NF-07: words a visitor reads come from /content, not from components or routes.
// The 404 and error shells in __root.tsx are exempt; gallery.tsx draws all its words from fixtures.

const srcDir = path.resolve(__dirname, "..");
const exempt = new Set(["__root.tsx"]);

function files(dir: string): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".tsx") && !exempt.has(f))
    .map((f) => path.join(dir, f));
}

// JSX text between a closing > and the next <, with letters in it, and no { } inside.
const jsxText = />([^<>{}=]*[A-Za-z]{3,}[^<>{}=]*)</g;

describe("no hardcoded copy", () => {
  for (const file of [
    ...files(path.join(srcDir, "components")),
    ...files(path.join(srcDir, "routes")),
  ]) {
    it(`${path.relative(srcDir, file)} has no literal words in JSX`, () => {
      const body = readFileSync(file, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
      const found = [...body.matchAll(jsxText)]
        .map((m) => (m[1] ?? "").trim())
        // Skip code that sits between two JSX pieces (a semicolon or a return), which is not copy.
        .filter((t) => t.length > 0 && !/;|\breturn\b/.test(t));
      expect(found).toEqual([]);
    });
  }
});
