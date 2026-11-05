import { createFileRoute } from "@tanstack/react-router";
import { journey, pageHead, site, titled } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { DepthGate } from "@/components/DepthGate";

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
          <li key={j.id} className="relative">
            <span className="absolute -left-[29px] top-2 size-2.5 rounded-full bg-primary" />
            <p className="text-sm text-muted-foreground">{j.period}</p>
            <h2 className="mt-1 font-serif text-2xl">{j.role}</h2>
            <p className="text-sm font-medium">{j.company}</p>
            <p className="mt-2 text-muted-foreground">{j.summary}</p>
            {j.gated && <DepthGate id={`role:${j.id}`} />}
          </li>
        ))}
      </ol>
    </>
  );
}
