import { createFileRoute, Link } from "@tanstack/react-router";
import { cases, pageHead, site } from "@/lib/content";

const p = site.pages.home;

export const Route = createFileRoute("/")({
  head: () => pageHead(p.title, p.description),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="py-8 sm:py-16">
        <p className="text-sm font-medium text-primary">{p.eyebrow}</p>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">{p.headline}</h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">{p.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={p.primaryCta.to} className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">{p.primaryCta.label}</Link>
          <Link to={p.secondaryCta.to} className="rounded-md border px-5 py-2.5 text-sm font-medium hover:border-foreground">{p.secondaryCta.label}</Link>
        </div>
      </section>
      <section className="mt-12">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">{p.featuredHeading}</h2>
        <ul className="divide-y border-y">
          {cases.map((c) => (
            <li key={c.slug}>
              <Link to="/work/$slug" params={{ slug: c.slug }} className="group block py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-2xl group-hover:text-primary">{c.title}</span>
                  <span className="shrink-0 text-sm text-muted-foreground">{c.year}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{c.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
