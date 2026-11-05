import { createFileRoute } from "@tanstack/react-router";
import { featuredKpis, pageHead, proof, site, titled } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";

const p = site.pages.proof;

export const Route = createFileRoute("/proof")({
  head: () => pageHead(titled(p.title), p.description),
  component: Proof,
});

function Proof() {
  return (
    <>
      <PageHeader title={p.title} description={p.description} />
      {featuredKpis.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featuredKpis.map((m) => (
            <li key={m.label} className="rounded-lg border p-5">
              <p className="break-words font-serif text-3xl text-primary">{m.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
            </li>
          ))}
        </ul>
      )}
      <ul className="mt-10 divide-y border-y">
        {proof.links.map((l) => {
          const body = (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{l.type}</p>
              <p className="mt-1 font-serif text-xl group-hover:text-primary">{l.title}</p>
              <p className="text-sm text-muted-foreground">{l.source}</p>
            </>
          );
          return (
            <li key={l.title}>
              {l.href ? (
                <a href={l.href} target="_blank" rel="noreferrer" className="group block py-5">{body}</a>
              ) : (
                <div className="py-5">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
