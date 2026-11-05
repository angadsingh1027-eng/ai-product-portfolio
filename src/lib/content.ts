import { marked } from "marked";

export type Link = { label: string; href: string; type?: string };
export type Kpi = { label: string; value: string; how: string; featured?: boolean };
export type CaseMeta = {
  slug: string;
  order: number;
  title: string;
  company: string;
  year: string;
  role: string;
  domain: string;
  summary: string;
  brief: string[];
  kpis: Kpi[];
  proof: Link[];
  tags: string[];
  hasPrivateDepth: boolean;
};
export type CaseStudy = CaseMeta & { html: string };
export type JourneyEntry = {
  id: string;
  role: string;
  company: string;
  period: string;
  summary?: string;
  gated?: boolean;
};
export type ProofLink = { type: string; title: string; source: string; href?: string };
export type Build = { title: string; year: string; description: string; stack: string; href: string };
export type WritingPost = { title: string; date: string; excerpt: string; href: string };

const json = import.meta.glob<unknown>("/content/**/*.json", { eager: true, import: "default" });
const md = import.meta.glob<string>("/content/**/*.md", { eager: true, query: "?raw", import: "default" });

function load<T>(path: string): T {
  const v = json[path];
  if (v === undefined) throw new Error(`Missing content file: ${path}`);
  return v as T;
}

// Content may carry "TODO:" placeholders for facts not yet confirmed. Any list item that
// contains one is hidden, so the UI shows nothing instead of a guess.
const hasTodo = (v: unknown): boolean => {
  if (typeof v === "string") return v.includes("TODO:");
  if (Array.isArray(v)) return v.some(hasTodo);
  if (v !== null && typeof v === "object") return Object.values(v).some(hasTodo);
  return false;
};
const visible = <T>(items: T[]): T[] => items.filter((item) => !hasTodo(item));

/* eslint-disable @typescript-eslint/no-explicit-any */
export const site = load<any>("/content/site.json");
/* eslint-enable @typescript-eslint/no-explicit-any */
export const builds = visible(load<Build[]>("/content/builds.json"));
export const writing = visible(load<WritingPost[]>("/content/writing.json"));
export const journey = visible(load<JourneyEntry[]>("/content/journey.json"));
export const proof = { links: visible(load<{ links: ProofLink[] }>("/content/proof.json").links) };

export const cases: CaseStudy[] = Object.entries(json)
  .filter(([p]) => p.startsWith("/content/work/"))
  .map(([p, meta]) => {
    const m = meta as CaseMeta;
    const body = md[p.replace(/\.json$/, ".md")] ?? "";
    return {
      ...m,
      brief: visible(m.brief),
      kpis: visible(m.kpis),
      proof: visible(m.proof),
      html: marked.parse(body, { async: false }) as string,
    };
  })
  .sort((a, b) => a.order - b.order);

export const getCase = (slug: string) => cases.find((c) => c.slug === slug);

// Home and Proof numbers come from KPIs flagged `featured` in the case files, so a metric is edited once.
export const featuredKpis: Kpi[] = cases.flatMap((c) => c.kpis.filter((k) => k.featured === true)).slice(0, 4);
export const topVideo: Link | undefined = cases.flatMap((c) => c.proof).find((l) => l.type === "video");

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
