import { z } from "zod";

// Schemas for every file in /content. Unknown fields are errors (.strict()).
// Used by `npm run content:validate` (src/test/content.test.ts); not imported by the app.

// Maximum lengths, in characters (requirement DS-32).
export const limits = {
  title: 60,
  tagline: 110,
  chip: 24,
  kpiValue: 18,
  summary: 280,
  chips: 3,
} as const;

const text = z.string().min(1);

// Allowed values for every choice list live in content/taxonomy.json.
export const taxonomySchema = z
  .object({
    status: z.array(text).min(1),
    buildKind: z.array(text).min(1),
    depth: z.array(text).min(1),
    placement: z.array(text).min(1),
    highlightKind: z.array(text).min(1),
    tags: z.array(text).min(1),
  })
  .strict();
export type Taxonomy = z.infer<typeof taxonomySchema>;

// A masked value stands in for a figure that is withheld: one letter and an optional unit (X%, Y×).
export const maskedValue = /^[XYZ][%×x]?$/;

const oneOf = (values: readonly string[]) =>
  z.string().refine((v) => values.includes(v), { message: `must be one of: ${values.join(", ")}` });

const link = z
  .object({
    label: text,
    href: z.string().url(),
    type: z.string().optional(),
    hero: z.boolean().optional(),
  })
  .strict();

const kpi = z
  .object({
    label: text,
    value: text.max(limits.kpiValue),
    how: text,
    scope: text.optional(),
    masked: z.boolean().optional(),
    featured: z.boolean().optional(),
    featuredOrder: z.number().optional(),
  })
  .strict()
  .superRefine((k, ctx) => {
    if (k.masked === true && !maskedValue.test(k.value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: "A masked value must be one letter and an optional unit, such as X% or Y×",
      });
    }
  });

const chip = z
  .object({ text: text.max(limits.chip), masked: z.boolean().optional() })
  .strict()
  .superRefine((c, ctx) => {
    if (c.masked === true && /\d/.test(c.text)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["text"],
        message: "A masked chip must contain no digits",
      });
    }
  });

const slug = z.string().regex(/^[a-z0-9-]+$/);

// Schemas that depend on the taxonomy.
export function makeSchemas(t: Taxonomy) {
  const caseSchema = z
    .object({
      slug,
      order: z.number(),
      title: text.max(limits.title),
      tagline: text.max(limits.tagline),
      company: text,
      year: text,
      role: text,
      domain: text,
      summary: text.max(limits.summary),
      status: oneOf(t.status).optional(),
      depth: oneOf(t.depth.filter((d) => d !== "mention")),
      placement: oneOf(t.placement),
      featured: z.boolean(),
      chips: z.array(chip).max(limits.chips),
      brief: z.array(text).min(1).max(5),
      kpis: z.array(kpi),
      proof: z.array(link),
      tags: z.array(oneOf(t.tags)),
    })
    .strict();

  const journeySchema = z.array(
    z
      .object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        role: text,
        company: text,
        period: text,
        summary: text.max(limits.summary).optional(),
        kpis: z.array(kpi).optional(),
      })
      .strict(),
  );

  const buildsSchema = z.array(
    z
      .object({
        title: text.max(limits.title),
        year: text,
        description: text.max(limits.tagline),
        stack: text,
        href: z.string().url(),
        kind: oneOf(t.buildKind),
        status: oneOf(t.status),
        caseStudy: slug.optional(),
      })
      .strict(),
  );

  return { caseSchema, journeySchema, buildsSchema };
}

export const writingSchema = z.array(
  z.object({ title: text, date: text, excerpt: text, href: z.string().url() }).strict(),
);

export const proofSchema = z
  .object({
    links: z.array(
      z
        .object({ type: text, title: text, source: text, href: z.string().url().optional() })
        .strict(),
    ),
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
  })
  .strict();
