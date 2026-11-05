import { createFileRoute, Link } from "@tanstack/react-router";
import { cases, pageHead, site, titled } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";

const p = site.pages.work;

export const Route = createFileRoute("/work/")({
  head: () => pageHead(titled(p.title), p.description),
  component: Work,
});

function Work() {
  return (
    <>
      <PageHeader title={p.title} description={p.description} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {cases.map((c) => (
          <li key={c.slug}>
            <Link to="/work/$slug" params={{ slug: c.slug }} className="group block h-full rounded-lg border p-6 hover:border-primary">
              <p className="text-sm text-muted-foreground">{c.company} · {c.year}</p>
              <h2 className="mt-2 font-serif text-2xl group-hover:text-primary">{c.title}</h2>
              <p className="mt-2 text-muted-foreground">{c.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
