import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { builds, pageHead, site, titled } from "@/lib/content";

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
        {builds.map((b, i) => (
          <li key={b.title} className={`flex flex-col gap-2${i === 0 ? " sm:col-span-2" : ""}`}>
            <ContentCard
              variant="build"
              eyebrow={`${b.stack} · ${b.year}`}
              title={b.title}
              tagline={b.description}
              status={b.status}
              href={b.href}
            />
            {b.caseStudy ? (
              <Link
                to="/work/$slug"
                params={{ slug: b.caseStudy }}
                className="text-sm text-primary hover:underline"
              >
                {p.caseStudyLabel} →
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
      {p.moreLink && (
        <a
          href={p.moreLink.href}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block text-sm text-primary hover:underline"
        >
          {p.moreLink.label} ↗
        </a>
      )}
    </>
  );
}
