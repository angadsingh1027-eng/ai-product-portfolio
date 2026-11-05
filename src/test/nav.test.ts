import { describe, expect, it } from "vitest";
import { visibleNav, type NavItem } from "@/lib/nav";

const nav: NavItem[] = [
  { label: "Work", to: "/work" },
  { label: "Writing", to: "/writing", min: { collection: "posts", count: 2 } },
];

describe("navigation rule", () => {
  it("hides an item until its collection has enough items", () => {
    expect(visibleNav(nav, { posts: 0 }).map((n) => n.label)).toEqual(["Work"]);
    expect(visibleNav(nav, { posts: 1 }).map((n) => n.label)).toEqual(["Work"]);
    expect(visibleNav(nav, {}).map((n) => n.label)).toEqual(["Work"]);
  });

  it("shows the item once the minimum is met", () => {
    expect(visibleNav(nav, { posts: 2 }).map((n) => n.label)).toEqual(["Work", "Writing"]);
  });
});
