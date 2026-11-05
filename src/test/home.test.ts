import { describe, expect, it } from "vitest";
import { builds, cases, featuredKpis, getCase, recognition, site } from "@/lib/content";
import { homeSchema, slotIds } from "@/lib/content-schema";
import { slotItems } from "@/lib/home";

describe("home slots", () => {
  it("returns nothing below the minimum and slices to the maximum", () => {
    expect(slotItems([1, 2], { id: "impact", min: 3 })).toBeNull();
    expect(slotItems([1, 2, 3, 4, 5], { id: "impact", min: 3, max: 4 })).toEqual([1, 2, 3, 4]);
    expect(slotItems([], { id: "latest" })).toBeNull();
    expect(slotItems([1], { id: "latest" })).toEqual([1]);
  });

  it("settings validate, and every known slot is configured once", () => {
    const home = homeSchema.parse(site.pages.home);
    expect(home.slots.map((s) => s.id).sort()).toEqual([...slotIds].sort());
    expect(home.slots[0]?.id).toBe("hero");
    expect(home.slots.at(-1)?.id).toBe("next");
  });

  it("rejects a missing hero slot, a repeated slot and an unknown slot", () => {
    const home = site.pages.home as Record<string, unknown> & { slots: { id: string }[] };
    const noHero = { ...home, slots: home.slots.filter((s) => s.id !== "hero") };
    const twice = { ...home, slots: [...home.slots, { id: "impact" }] };
    const unknown = { ...home, slots: [...home.slots, { id: "banner" }] };
    expect(homeSchema.safeParse(noHero).success).toBe(false);
    expect(homeSchema.safeParse(twice).success).toBe(false);
    expect(homeSchema.safeParse(unknown).success).toBe(false);
  });

  it("the impact strip has the featured numbers and never a masked one", () => {
    expect(featuredKpis.length).toBeGreaterThanOrEqual(3);
    expect(featuredKpis.every((k) => k.masked !== true)).toBe(true);
  });

  it("the recognition slot has at least the three items it needs", () => {
    const rule = homeSchema.parse(site.pages.home).slots.find((s) => s.id === "recognition");
    expect(recognition.length).toBeGreaterThanOrEqual(rule?.min ?? 1);
  });
});

describe("work lineup", () => {
  const featured = cases.filter((c) => c.placement === "work" && c.featured);

  it("runs Zeta, then JPMorganChase, then HashedIn", () => {
    expect(featured.map((c) => c.slug)).toEqual([
      "zeta-agentic-platform",
      "jpmorganchase-agentic-pdlc",
      "hashedin-agent-roi",
    ]);
  });

  it("Zeta is the one full case; the other two are snapshots", () => {
    expect(featured.map((c) => c.depth)).toEqual(["full", "snapshot", "snapshot"]);
  });

  it("the JPMorganChase card shows only masked values and no digits", () => {
    const jpm = getCase("jpmorganchase-agentic-pdlc");
    expect(jpm).toBeDefined();
    expect(jpm?.chips.length).toBe(3);
    for (const chip of jpm?.chips ?? []) {
      expect(chip.masked).toBe(true);
      expect(/\d/.test(chip.text)).toBe(false);
    }
    for (const kpi of jpm?.kpis ?? []) expect(kpi.masked).toBe(true);
  });

  it("Nexus is a build with a case-study page, and is not in the Projects list", () => {
    const nexus = getCase("nexus-fleet-intelligence");
    expect(nexus?.placement).toBe("builds");
    expect(nexus?.depth).toBe("full");
    expect(featured.some((c) => c.slug === "nexus-fleet-intelligence")).toBe(false);
    expect(builds.some((b) => b.caseStudy === "nexus-fleet-intelligence")).toBe(true);
  });
});
