import { describe, expect, it } from "vitest";
import { cases } from "@/lib/content";
import {
  limits,
  makeSchemas,
  proofSchema,
  siteSchema,
  taxonomySchema,
  writingSchema,
} from "@/lib/content-schema";

const json = import.meta.glob<unknown>("/content/**/*.json", { eager: true, import: "default" });
const md = import.meta.glob<string>("/content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const taxonomy = taxonomySchema.parse(json["/content/taxonomy.json"]);
const { caseSchema, journeySchema, buildsSchema } = makeSchemas(taxonomy);

const caseFiles = Object.keys(json).filter((p) => p.startsWith("/content/work/"));
const sections = ["## Context", "## Users and pain points", "## Solution", "## What I owned"];

const first = caseFiles[0] as string;
const valid = json[first] as Record<string, unknown>;

describe("content files", () => {
  it("validates the top-level files", () => {
    expect(siteSchema.safeParse(json["/content/site.json"]).success).toBe(true);
    expect(journeySchema.safeParse(json["/content/journey.json"]).success).toBe(true);
    expect(buildsSchema.safeParse(json["/content/builds.json"]).success).toBe(true);
    expect(writingSchema.safeParse(json["/content/writing.json"]).success).toBe(true);
    expect(proofSchema.safeParse(json["/content/proof.json"]).success).toBe(true);
  });

  it("validates every case; a full case has a markdown body with the four sections", () => {
    expect(caseFiles.length).toBeGreaterThan(0);
    const slugs = new Set<string>();
    for (const file of caseFiles) {
      const parsed = caseSchema.safeParse(json[file]);
      expect(parsed.success, `${file} failed validation`).toBe(true);
      if (!parsed.success) continue;
      expect(file).toBe(`/content/work/${parsed.data.slug}.json`);
      expect(slugs.has(parsed.data.slug)).toBe(false);
      slugs.add(parsed.data.slug);
      if (parsed.data.depth === "full") {
        const body = md[file.replace(/\.json$/, ".md")];
        expect(body, `${file} has no markdown body`).toBeDefined();
        for (const heading of sections) expect(body).toContain(heading);
      }
    }
  });

  it("points every build's case study at an existing case", () => {
    const slugs = new Set(cases.map((c) => c.slug));
    const builds = buildsSchema.parse(json["/content/builds.json"]);
    for (const b of builds)
      if (b.caseStudy !== undefined) expect(slugs.has(b.caseStudy)).toBe(true);
  });

  it("flags between 1 and 4 featured KPIs for the home page", () => {
    const featured = caseFiles.flatMap((file) => {
      const parsed = caseSchema.safeParse(json[file]);
      return parsed.success ? parsed.data.kpis.filter((k) => k.featured === true) : [];
    });
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.length).toBeLessThanOrEqual(4);
  });

  it("keeps private files out of /content", () => {
    for (const file of [...Object.keys(json), ...Object.keys(md)])
      expect(file).not.toContain(".private.");
  });

  it("hides any item that contains a TODO placeholder", () => {
    for (const c of cases) {
      for (const line of c.brief) expect(line).not.toContain("TODO:");
    }
  });
});

describe("content rules", () => {
  it("rejects a missing required field and an unknown field", () => {
    const { title: _title, ...withoutTitle } = valid;
    expect(caseSchema.safeParse(withoutTitle).success).toBe(false);
    expect(caseSchema.safeParse({ ...valid, surprise: true }).success).toBe(false);
  });

  it("rejects over-length values", () => {
    expect(caseSchema.safeParse({ ...valid, title: "x".repeat(limits.title + 1) }).success).toBe(
      false,
    );
    expect(
      caseSchema.safeParse({ ...valid, tagline: "x".repeat(limits.tagline + 1) }).success,
    ).toBe(false);
    expect(
      caseSchema.safeParse({ ...valid, summary: "x".repeat(limits.summary + 1) }).success,
    ).toBe(false);
    expect(
      caseSchema.safeParse({ ...valid, chips: [{ text: "x".repeat(limits.chip + 1) }] }).success,
    ).toBe(false);
    const kpi = { label: "L", value: "x".repeat(limits.kpiValue + 1), how: "H" };
    expect(caseSchema.safeParse({ ...valid, kpis: [kpi] }).success).toBe(false);
  });

  it("rejects a fourth chip", () => {
    const chips = [{ text: "a" }, { text: "b" }, { text: "c" }, { text: "d" }];
    expect(caseSchema.safeParse({ ...valid, chips }).success).toBe(false);
  });

  it("rejects a value outside the taxonomy", () => {
    expect(caseSchema.safeParse({ ...valid, status: "Nope" }).success).toBe(false);
    expect(caseSchema.safeParse({ ...valid, tags: ["nope"] }).success).toBe(false);
    expect(caseSchema.safeParse({ ...valid, placement: "elsewhere" }).success).toBe(false);
    expect(caseSchema.safeParse({ ...valid, depth: "mention" }).success).toBe(false);
  });

  it("accepts a masked KPI and rejects a masked KPI that carries digits", () => {
    const masked = { label: "Cycle time", value: "X%", how: "Measured on live use", masked: true };
    expect(caseSchema.safeParse({ ...valid, kpis: [masked] }).success).toBe(true);
    expect(caseSchema.safeParse({ ...valid, kpis: [{ ...masked, value: "20%" }] }).success).toBe(
      false,
    );
    expect(caseSchema.safeParse({ ...valid, kpis: [{ ...masked, value: "XX%" }] }).success).toBe(
      false,
    );
  });

  it("rejects a masked chip that carries digits", () => {
    expect(
      caseSchema.safeParse({ ...valid, chips: [{ text: "Cycle time down X%", masked: true }] })
        .success,
    ).toBe(true);
    expect(
      caseSchema.safeParse({ ...valid, chips: [{ text: "Cycle time down 20%", masked: true }] })
        .success,
    ).toBe(false);
  });
});
