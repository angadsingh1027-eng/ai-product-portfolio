import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCase, pageHead, site, titled } from "@/lib/content";
import { DepthGate } from "@/components/DepthGate";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const c = getCase(params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) =>
    loaderData ? pageHead(titled(loaderData.title), loaderData.summary) : { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] },
  component: CasePage,
});

function CasePage() {
  const c = Route.useLoaderData();
  const t = site.case;
  return (
    <article>
      <Link to="/work" className="text-sm text-muted-foreground hover:text-primary">← {t.back}</Link>
      <p className="mt-8 text-sm text-muted-foreground">{c.company} · {c.year}</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{c.title}</h1>
      <p className="mt-2 text-muted-foreground">{c.role} · {c.domain}</p>

      <section className="mt-8 rounded-lg border-l-2 border-primary bg-muted/50 p-5 sm:p-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">{t.briefHeading}</h2>
        <ol className="mt-3 space-y-2">
          {c.brief.slice(0, 5).map((line, i) => (
            <li key={i} className="flex gap-3"><span className="text-muted-foreground tabular-nums">{i + 1}</span><span>{line}</span></li>
          ))}
        </ol>
      </section>

      {c.proof.length > 0 && (
        <section className="mt-6">
          <h2 className="sr-only">{t.proofHeading}</h2>
          <ul className="flex flex-wrap gap-2">
            <li className="py-1.5 pr-1 text-sm font-medium text-muted-foreground">{t.proofHeading}:</li>
            {c.proof.map((l) => (
              <li key={l.href + l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className="inline-block rounded-full border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">{l.label} ↗</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {c.kpis.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">{t.kpiHeading}</h2>
          <ul className="mt-3 divide-y border-y">
            {c.kpis.map((k) => (
              <li key={k.label} className="flex items-baseline justify-between gap-6 py-3">
                <div>
                  <p className="font-medium">{k.label}</p>
                  <p className="text-sm text-muted-foreground">{k.how}</p>
                </div>
                <p className="shrink-0 text-right font-serif text-2xl text-primary">{k.value}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="prose-content mt-10" dangerouslySetInnerHTML={{ __html: c.html }} />

      {c.hasPrivateDepth && (
        <section className="mt-12"><DepthGate id={c.slug} /></section>
      )}
    </article>
  );
}
