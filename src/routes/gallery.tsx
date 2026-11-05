import { createFileRoute } from "@tanstack/react-router";
import { Chip } from "@/components/Chip";
import { ContentCard } from "@/components/ContentCard";
import { KpiRow } from "@/components/KpiRow";
import { MediaBlock } from "@/components/MediaBlock";
import { NextStep } from "@/components/NextStep";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";
import { TimelineEntry } from "@/components/TimelineEntry";
import { site } from "@/lib/content";
import { fixtures as f } from "@/lib/gallery-fixtures";

// A hidden page that shows every component in every state. It is not linked and not indexed.
export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: f.title }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Gallery,
});

function Heading({ children }: { children: string }) {
  return <h2 className="mb-4 mt-12 text-sm font-medium text-muted-foreground">{children}</h2>;
}

function Gallery() {
  const masked: string = site.labels.masked;
  return (
    <>
      <PageHeader title={f.title} description={f.description} />

      <Heading>{f.headings.cards}</Heading>
      <ul className="grid gap-4 sm:grid-cols-2">
        {f.cards.map((c) => (
          <li key={c.title}>
            <ContentCard {...c} maskedLabel={masked} />
          </li>
        ))}
      </ul>

      <Heading>{f.headings.chips}</Heading>
      <ul className="flex flex-wrap gap-2">
        {f.chips.map((c) => (
          <li key={c.chip.text}>
            <Chip chip={c.chip} variant={c.variant} maskedLabel={masked} />
          </li>
        ))}
      </ul>

      <Heading>{f.headings.kpis}</Heading>
      <ul className="divide-y border-y">
        {f.kpis.map((k) => (
          <KpiRow key={k.label} kpi={k} maskedLabel={masked} />
        ))}
      </ul>

      <Heading>{f.headings.tiles}</Heading>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {f.kpis.map((k) => (
          <StatTile key={k.label} kpi={k} maskedLabel={masked} />
        ))}
      </ul>

      <Heading>{f.headings.section}</Heading>
      <Section heading={f.sectionDemo.heading} intro={f.sectionDemo.intro} count={2} min={2}>
        <p>{f.sectionDemo.intro}</p>
      </Section>

      <Heading>{f.headings.hidden}</Heading>
      <Section heading={f.sectionDemo.heading} count={0}>
        <p>{f.sectionDemo.intro}</p>
      </Section>
      <p className="text-sm text-muted-foreground">{f.hiddenNote}</p>

      <Heading>{f.headings.timeline}</Heading>
      <ol className="space-y-10 border-l pl-6">
        {f.timeline.map((e) => (
          <TimelineEntry key={e.id} entry={e} />
        ))}
      </ol>

      <Heading>{f.headings.media}</Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        <MediaBlock {...f.media.withPoster} />
        <MediaBlock {...f.media.withoutPoster} />
      </div>

      <Heading>{f.headings.nextStep}</Heading>
      <NextStep heading={f.nextStep.heading} intro={f.nextStep.intro} items={f.nextStep.full} />
      <NextStep heading={f.nextStep.heading} items={f.nextStep.emailOnly} />
    </>
  );
}
