import { createFileRoute } from "@tanstack/react-router";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { pageHead, recognition, site, titled } from "@/lib/content";

const p = site.pages.recognition;
const kinds: Record<string, string> = site.labels.kinds;

export const Route = createFileRoute("/recognition")({
  head: () => pageHead(titled(p.title), p.description),
  component: Recognition,
});

function Recognition() {
  return (
    <>
      <PageHeader title={p.title} description={p.description} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {recognition.map((r) => (
          <li key={r.title}>
            <ContentCard
              variant="highlight"
              eyebrow={kinds[r.kind]}
              title={r.title}
              tagline={r.source}
              href={r.href}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
