import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Foundation checks (DS-01 to DS-06): color contrast, a visible focus ring, reduced motion, and no
// arbitrary sizes in new components.

const srcDir = path.resolve(__dirname, "..");
const css = readFileSync(path.join(srcDir, "styles.css"), "utf8");
const rootBlock = /:root\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";

function token(name: string): string {
  const m = new RegExp(`--${name}:\\s*([^;]+);`).exec(rootBlock);
  if (!m?.[1]) throw new Error(`Missing token --${name}`);
  return m[1].trim();
}

// oklch(L C h) to relative luminance, using the OKLab to linear sRGB matrices.
function luminance(value: string): number {
  const m = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(value);
  if (!m) throw new Error(`Not an oklch color: ${value}`);
  const L = Number(m[1]);
  const C = Number(m[2]);
  const h = (Number(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const r = clamp(4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s);
  const g = clamp(-1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s);
  const bl = clamp(-0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s);
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

function contrast(fg: string, bg: string): number {
  const [hi, lo] = [luminance(token(fg)), luminance(token(bg))].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

// Text and background pairs the site actually uses (light theme). WCAG AA needs 4.5 to 1.
const pairs: [string, string][] = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["muted-foreground", "background"],
  ["muted-foreground", "muted"],
  ["primary", "background"],
  ["primary", "muted"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["accent-foreground", "accent"],
  ["destructive-foreground", "destructive"],
];

describe("foundations", () => {
  for (const [fg, bg] of pairs) {
    it(`${fg} on ${bg} meets WCAG AA contrast`, () => {
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it("defines a visible focus ring and respects reduced motion", () => {
    expect(css).toContain(":focus-visible");
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  it("uses no arbitrary sizes in the new components", () => {
    const dir = path.join(srcDir, "components");
    const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));
    // Existing routes use a few arbitrary values; they are cleaned up with their pages (PR 3 and PR 4).
    for (const f of files) {
      const body = readFileSync(path.join(dir, f), "utf8");
      expect(
        /\b-?(text|p|px|py|m|mx|my|gap|w|h|top|left|right|bottom)-\[/.test(body),
        `${f} has an arbitrary value`,
      ).toBe(false);
    }
  });
});
