import { marked } from "marked";

type Link = { label: string; href: string };
export type CaseMeta = {
  slug: string;
  order: number;
  title: string;
  company: string;
  year: string;
  summary: string;
  brief: string[];
  proof: Link[];
};
export type CaseStudy = CaseMeta & { html: string };

const json = import.meta.glob<unknown>("/content/**/*.json", { eager: true, import: "default" });
const md = import.meta.glob<string>("/content/**/*.md", { eager: true, query: "?raw", import: "default" });

function load<T>(path: string): T {
  const v = json[path];
  if (v === undefined) throw new Error(`Missing content file: ${path}`);
  return v as T;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const site = load<any>("/content/site.json");
export const builds = load<any[]>("/content/builds.json");
export const writing = load<any[]>("/content/writing.json");
export const journey = load<any[]>("/content/journey.json");
export const proof = load<any>("/content/proof.json");

export const cases: CaseStudy[] = Object.entries(json)
  .filter(([p]) => p.startsWith("/content/work/"))
  .map(([p, meta]) => {
    const body = md[p.replace(/\.json$/, ".md")] ?? "";
    return { ...(meta as CaseMeta), html: marked.parse(body, { async: false }) as string };
  })
  .sort((a, b) => a.order - b.order);

export const getCase = (slug: string) => cases.find((c) => c.slug === slug);

export const pageHead = (title: string, description: string) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
export const titled = (t: string) => `${t} — ${site.name}`;
