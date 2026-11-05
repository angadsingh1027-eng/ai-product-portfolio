import { createFileRoute } from "@tanstack/react-router";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { cases, pageHead, site, titled } from "@/lib/content";

const p = site.pages.work;
const masked: string = site.labels.masked;
// Projects lists the cases placed in work. A case placed in builds is reached from the Builds page.
const projects = cases.filter((c) => c.placement === "work");

export const Route = createFileRoute("/work/")({
  head: () => pageHead(titled(p.title), p.description),
  component: Work,
});

function Work() {
  return (
    <>
      <PageHeader title={p.title} description={p.description} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {projects.map((c) => (
          <li key={c.slug}>
            <ContentCard
              variant="case"
              headingLevel="h2"
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
    </>
  );
}
