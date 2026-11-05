import { createFileRoute, Link } from "@tanstack/react-router";
import { cases, featuredKpis, pageHead, site, topVideo } from "@/lib/content";

const p = site.pages.home;

export const Route = createFileRoute("/")({
  head: () => pageHead(p.title, p.description),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="py-8 sm:py-16">
        {site.photo && (
          <img src={site.photo.src} alt={site.photo.alt} width={96} height={96} className="mb-6 size-24 rounded-full object-cover" />
        )}
        <p className="text-sm font-medium text-primary">{p.eyebrow}</p>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">{p.headline}</h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">{p.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={p.primaryCta.to} className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">{p.primaryCta.label}</Link>
          <Link to={p.secondaryCta.to} className="rounded-md border px-5 py-2.5 text-sm font-medium hover:border-foreground">{p.secondaryCta.label}</Link>
        </div>
      </section>

      {featuredKpis.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">{p.statsHeading}</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featuredKpis.map((k) => (
              <li key={k.label} className="rounded-lg border p-4">
                <p className="break-words font-serif text-2xl text-primary sm:text-3xl">{k.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{k.label}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">{p.featuredHeading}</h2>
        <ul className="divide-y border-y">
          {cases.slice(0, 2).map((c) => (
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

      {topVideo && (
        <section className="mt-12">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">{p.videoHeading}</h2>
          <a href={topVideo.href} target="_blank" rel="noreferrer" className="inline-block rounded-full border px-4 py-2 text-sm hover:border-primary hover:text-primary">
            {topVideo.label} ↗
          </a>
        </section>
      )}

      <section className="mt-12">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {site.pages.contact.links.map((l: { label: string; href: string }) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">{l.label} ↗</a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
