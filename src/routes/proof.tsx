import { createFileRoute } from "@tanstack/react-router";
import { pageHead, proof, site, titled } from "@/lib/content";
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
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {proof.metrics.map((m: { value: string; label: string }) => (
          <li key={m.label} className="rounded-lg border p-6">
            <p className="font-serif text-4xl text-primary">{m.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
          </li>
        ))}
      </ul>
      <ul className="mt-10 divide-y border-y">
        {proof.links.map((l: { type: string; title: string; source: string; href: string }) => (
          <li key={l.title}>
            <a href={l.href} target="_blank" rel="noreferrer" className="group block py-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{l.type}</p>
              <p className="mt-1 font-serif text-xl group-hover:text-primary">{l.title}</p>
              <p className="text-sm text-muted-foreground">{l.source}</p>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
