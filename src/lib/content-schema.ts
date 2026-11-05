import { z } from "zod";

// Schemas for every file in /content. Unknown fields are errors (.strict()).
// Used by `npm run content:validate` (src/test/content.test.ts); not imported by the app.

const text = z.string().min(1);

const link = z.object({ label: text, href: z.string().url(), type: z.string().optional() }).strict();

const kpi = z.object({ label: text, value: text, how: text, featured: z.boolean().optional() }).strict();

export const caseSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    order: z.number(),
    title: text,
    company: text,
    year: text,
    role: text,
    domain: text,
    summary: text,
    brief: z.array(text).min(1).max(5),
    kpis: z.array(kpi),
    proof: z.array(link),
    tags: z.array(text),
    hasPrivateDepth: z.boolean(),
  })
  .strict();

export const journeySchema = z.array(
  z
    .object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      role: text,
      company: text,
      period: text,
      summary: text.optional(),
      gated: z.boolean().optional(),
    })
    .strict(),
);

export const buildsSchema = z.array(
  z.object({ title: text, year: text, description: text, stack: text, href: z.string().url() }).strict(),
);

export const writingSchema = z.array(
  z.object({ title: text, date: text, excerpt: text, href: z.string().url() }).strict(),
);

export const proofSchema = z
  .object({
    links: z.array(z.object({ type: text, title: text, source: text, href: z.string().url().optional() }).strict()),
  })
  .strict();

export const siteSchema = z
  .object({
    name: text,
    role: text,
    location: text,
    photo: z.object({ src: text, alt: text }).strict(),
    nav: z.array(z.object({ label: text, to: text }).strict()),
    footer: text,
    pages: z.object({}).passthrough(),
    case: z.object({}).passthrough(),
    gate: z.object({}).passthrough(),
  })
  .strict();
