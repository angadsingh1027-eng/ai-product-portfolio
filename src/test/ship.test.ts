import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cases, journey, site } from "@/lib/content";

const publicDir = path.resolve(__dirname, "../../public");
const digits = /\d/;

describe("sitemap", () => {
  it("lists the site pages and every full case, and nothing else", () => {
    const xml = readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
    const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
    const pages = ["/", ...site.nav.map((n: { to: string }) => n.to)];
    const full = cases.filter((c) => c.depth === "full").map((c) => `/work/${c.slug}`);
    const expected = [...pages, ...full].map((p) => (p === "/" ? site.url : `${site.url}${p}`)).sort();
    expect(listed).toEqual(expected);
  });

  it("is named in robots.txt", () => {
    const robots = readFileSync(path.join(publicDir, "robots.txt"), "utf8");
    expect(robots).toContain(`Sitemap: ${site.url}/sitemap.xml`);
  });
});

describe("withheld figures", () => {
  it("shows no digit on the JPMorganChase card except the model name", () => {
    const jpm = cases.find((c) => c.company === "JPMorganChase");
    expect(jpm).toBeDefined();
    const shown = [
      ...(jpm?.chips.map((c) => c.text) ?? []),
      ...(jpm?.kpis.map((k) => k.value) ?? []),
    ];
    for (const t of shown) expect(digits.test(t), t).toBe(false);
  });

  it("gives the JPMorganChase role in Journey no figures", () => {
    const role = journey.find((j) => j.company === "JPMorganChase");
    expect(digits.test(role?.summary ?? "")).toBe(false);
    expect(role?.kpis ?? []).toEqual([]);
  });
});
