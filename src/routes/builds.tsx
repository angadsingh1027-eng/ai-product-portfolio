import { createFileRoute } from "@tanstack/react-router";
import { builds, pageHead, site, titled } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";

const p = site.pages.builds;

export const Route = createFileRoute("/builds")({
  head: () => pageHead(titled(p.title), p.description),
  component: Builds,
});

function Builds() {
  return (
    <>
      <PageHeader title={p.title} description={p.description} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {builds.map((b) => (
          <li key={b.title}>
            <a href={b.href} target="_blank" rel="noreferrer" className="group block h-full rounded-lg border p-6 hover:border-primary">
              <div className="flex justify-between text-sm text-muted-foreground"><span>{b.stack}</span><span>{b.year}</span></div>
              <h2 className="mt-2 font-serif text-2xl group-hover:text-primary">{b.title}</h2>
              <p className="mt-2 text-muted-foreground">{b.description}</p>
            </a>
          </li>
        ))}
      </ul>
      {p.moreLink && (
        <a href={p.moreLink.href} target="_blank" rel="noreferrer" className="mt-8 inline-block text-sm text-primary hover:underline">{p.moreLink.label} ↗</a>
      )}
    </>
  );
}
