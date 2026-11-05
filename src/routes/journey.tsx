import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { TimelineEntry } from "@/components/TimelineEntry";
import { journey, pageHead, site, titled } from "@/lib/content";

const p = site.pages.journey;

export const Route = createFileRoute("/journey")({
  head: () => pageHead(titled(p.title), p.description),
  component: Journey,
});

function Journey() {
  return (
    <>
      <PageHeader title={p.title} description={p.description} />
      <ol className="space-y-10 border-l pl-6">
        {journey.map((j) => (
          <TimelineEntry key={j.id} entry={j} />
        ))}
      </ol>
    </>
  );
}
