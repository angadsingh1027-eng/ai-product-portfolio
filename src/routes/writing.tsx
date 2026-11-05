import { createFileRoute } from "@tanstack/react-router";
import { pageHead, site, titled, writing } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";

const p = site.pages.writing;

export const Route = createFileRoute("/writing")({
  head: () => pageHead(titled(p.title), p.description),
  component: Writing,
});

function Writing() {
  return (
    <>
      <PageHeader title={p.title} description={p.description} />
      {writing.length === 0 ? (
        <p className="max-w-xl text-lg">{p.empty}</p>
      ) : (
        <ul className="divide-y border-y">
          {writing.map((w) => (
            <li key={w.title}>
              <a href={w.href} target="_blank" rel="noreferrer" className="group block py-5 sm:flex sm:gap-8">
                <span className="block w-24 shrink-0 text-sm text-muted-foreground">{w.date}</span>
                <span>
                  <span className="block font-serif text-2xl group-hover:text-primary">{w.title}</span>
                  <span className="mt-1 block text-muted-foreground">{w.excerpt}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {p.linkedin && (
        <a href={p.linkedin.href} target="_blank" rel="noreferrer" className="mt-8 inline-block text-sm text-primary hover:underline">{p.linkedin.label} ↗</a>
      )}
    </>
  );
}
