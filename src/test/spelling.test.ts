import { describe, expect, it } from "vitest";

// ADR-018: all copy uses US spelling. This scans content for common British forms.
const files = import.meta.glob<string>("/content/**/*.{json,md}", {
  eager: true,
  query: "?raw",
  import: "default",
});
const british =
  /\b\w*(isation|ised|ising|ises|colour|behaviour|favour|centre|programme|licence|catalogue|labour|grey|judgement|artefact|analyse|modelling|cancelled)\w*/gi;
// Words that match the pattern but are US spellings.
const allowed = new Set(["rising", "raising", "promising", "advising", "supervising", "comprising", "enterprises", "enterprise"]);

describe("US spelling", () => {
  it("has no British spellings in content", () => {
    const hits: string[] = [];
    for (const [file, body] of Object.entries(files)) {
      for (const m of body.matchAll(british)) {
        const w = m[0].toLowerCase();
        if (!allowed.has(w)) hits.push(`${file}: ${m[0]}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
