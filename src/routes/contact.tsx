import { createFileRoute } from "@tanstack/react-router";
import { pageHead, site, titled } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";

const p = site.pages.contact;

export const Route = createFileRoute("/contact")({
  head: () => pageHead(titled(p.title), p.description),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHeader title={p.title} description={p.description} />
      <p className="max-w-xl text-lg">{p.body}</p>
      <ul className="mt-8 divide-y border-y">
        {p.links.map((l: { label: string; value: string; href: string }) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer" className="group flex justify-between gap-4 py-4">
              <span className="text-muted-foreground">{l.label}</span>
              <span className="truncate group-hover:text-primary">{l.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
