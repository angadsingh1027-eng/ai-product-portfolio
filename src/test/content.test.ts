import { describe, expect, it } from "vitest";
import {
  buildsSchema,
  caseSchema,
  journeySchema,
  proofSchema,
  siteSchema,
  writingSchema,
} from "@/lib/content-schema";

const json = import.meta.glob<unknown>("/content/**/*.json", { eager: true, import: "default" });
const md = import.meta.glob<string>("/content/**/*.md", { eager: true, query: "?raw", import: "default" });

const caseFiles = Object.keys(json).filter((p) => p.startsWith("/content/work/"));
const sections = ["## Context", "## Users and pain points", "## Solution", "## What I owned"];

describe("content files", () => {
  it("validates the top-level files", () => {
    expect(siteSchema.safeParse(json["/content/site.json"]).success).toBe(true);
    expect(journeySchema.safeParse(json["/content/journey.json"]).success).toBe(true);
    expect(buildsSchema.safeParse(json["/content/builds.json"]).success).toBe(true);
    expect(writingSchema.safeParse(json["/content/writing.json"]).success).toBe(true);
    expect(proofSchema.safeParse(json["/content/proof.json"]).success).toBe(true);
  });

  it("validates every case and pairs it with a markdown body", () => {
    expect(caseFiles.length).toBeGreaterThan(0);
    const slugs = new Set<string>();
    for (const file of caseFiles) {
      const parsed = caseSchema.safeParse(json[file]);
      expect(parsed.success, `${file} failed validation`).toBe(true);
      if (!parsed.success) continue;
      expect(file).toBe(`/content/work/${parsed.data.slug}.json`);
      expect(slugs.has(parsed.data.slug)).toBe(false);
      slugs.add(parsed.data.slug);
      const body = md[file.replace(/\.json$/, ".md")];
      expect(body, `${file} has no markdown body`).toBeDefined();
      for (const heading of sections) expect(body).toContain(heading);
    }
  });

  it("flags between 1 and 4 featured KPIs for the home page", () => {
    const featured = caseFiles.flatMap((file) => {
      const parsed = caseSchema.safeParse(json[file]);
      return parsed.success ? parsed.data.kpis.filter((k) => k.featured === true) : [];
    });
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.length).toBeLessThanOrEqual(4);
  });

  it("keeps gated content out of /content", () => {
    for (const file of [...Object.keys(json), ...Object.keys(md)]) expect(file).not.toContain(".private.");
  });

  it("fails on a missing required field or an unknown field", () => {
    const first = caseFiles[0];
    expect(first).toBeDefined();
    const valid = json[first as string] as Record<string, unknown>;
    const { title: _title, ...withoutTitle } = valid;
    expect(caseSchema.safeParse(withoutTitle).success).toBe(false);
    expect(caseSchema.safeParse({ ...valid, surprise: true }).success).toBe(false);
  });
});
