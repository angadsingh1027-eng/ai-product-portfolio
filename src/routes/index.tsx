import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentCard } from "@/components/ContentCard";
import { MediaBlock } from "@/components/MediaBlock";
import { NextStep } from "@/components/NextStep";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";
import { builds, cases, featuredKpis, pageHead, recognition, site, topVideo } from "@/lib/content";
import { slotItems, type Principle, type SlotConfig } from "@/lib/home";

const p = site.pages.home;
const slots: SlotConfig[] = p.slots;
const principles: Principle[] = p.principles;
const masked: string = site.labels.masked;
const kinds: Record<string, string> = site.labels.kinds;
const featuredCases = cases.filter((c) => c.placement === "work" && c.featured);
const contactLinks: { label: string; value: string; href: string }[] = site.pages.connect.links;

export const Route = createFileRoute("/")({
  head: () => pageHead(p.title, p.description),
  component: Index,
});

function Hero() {
  return (
    <section className="py-8 sm:py-16">
      {site.photo && (
        <img
          src={site.photo.src}
          alt={site.photo.alt}
          width={96}
          height={96}
          className="mb-6 size-24 rounded-full object-cover"
        />
      )}
      <p className="text-sm font-medium text-primary">{p.eyebrow}</p>
      <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">{p.headline}</h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">{p.intro}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to={p.primaryCta.to}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          {p.primaryCta.label}
        </Link>
        <Link
          to={p.secondaryCta.to}
          className="rounded-md border px-5 py-2.5 text-sm font-medium hover:border-foreground"
        >
          {p.secondaryCta.label}
        </Link>
      </div>
    </section>
  );
}

// One home slot. A slot with fewer items than its minimum renders nothing.
function Slot({ cfg }: { cfg: SlotConfig }) {
  switch (cfg.id) {
    case "hero":
      return <Hero />;
    case "impact": {
      const items = slotItems(featuredKpis, cfg);
      if (!items) return null;
      return (
        <Section heading={p.statsHeading} count={items.length}>
          <ul className="grid gap-3 sm:grid-cols-3">
            {items.map((k) => (
              <StatTile key={k.label} kpi={k} maskedLabel={masked} />
            ))}
          </ul>
        </Section>
      );
    }
    case "how": {
      const items = slotItems(principles, cfg);
      if (!items) return null;
      return (
        <Section heading={p.principlesHeading} count={items.length}>
          <ul className="grid gap-6 sm:grid-cols-3">
            {items.map((x) => (
              <li key={x.title}>
                <h3 className="font-serif text-xl">{x.title}</h3>
                <p className="mt-2 text-muted-foreground">{x.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      );
    }
    case "work": {
      const items = slotItems(featuredCases, cfg);
      if (!items) return null;
      return (
        <Section heading={p.featuredHeading} count={items.length}>
          <ul className="grid gap-4">
            {items.map((c) => (
              <li key={c.slug}>
                <ContentCard
                  variant="case"
                  eyebrow={`${c.company} · ${c.year}`}
                  title={c.title}
                  tagline={c.tagline}
                  status={c.status}
                  chips={c.chips}
                  caseSlug={c.depth === "full" ? c.slug : undefined}
                  maskedLabel={masked}
                />
              </li>
            ))}
          </ul>
        </Section>
      );
    }
    case "media": {
      const items = slotItems(topVideo ? [topVideo] : [], cfg);
      if (!items) return null;
      return (
        <Section heading={p.videoHeading} count={items.length}>
          {items.map((v) => (
            <MediaBlock key={v.href} href={v.href} label={v.label} />
          ))}
        </Section>
      );
    }
    case "recognition": {
      const items = slotItems(recognition, cfg);
      if (!items) return null;
      return (
        <Section heading={p.recognitionHeading} count={items.length}>
          <ul className="grid gap-4 sm:grid-cols-3">
            {items.map((l) => (
              <li key={l.title}>
                <ContentCard
                  variant="highlight"
                  eyebrow={kinds[l.kind]}
                  title={l.title}
                  tagline={l.source}
                  href={l.href}
                />
              </li>
            ))}
          </ul>
        </Section>
      );
    }
    case "latest": {
      const items = slotItems(builds, cfg);
      if (!items) return null;
      return (
        <Section heading={p.latestHeading} count={items.length}>
          {items.map((b) => (
            <ContentCard
              key={b.title}
              variant="build"
              eyebrow={`${b.stack} · ${b.year}`}
              title={b.title}
              tagline={b.description}
              status={b.status}
              href={b.href}
            />
          ))}
        </Section>
      );
    }
    case "next":
      return (
        <NextStep heading={p.nextHeading} intro={site.pages.connect.body} items={contactLinks} />
      );
    default:
      return null;
  }
}

function Index() {
  return (
    <>
      {slots.map((cfg) => (
        <Slot key={cfg.id} cfg={cfg} />
      ))}
    </>
  );
}
