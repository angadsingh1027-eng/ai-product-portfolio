import { createFileRoute } from "@tanstack/react-router";
import { NextStep } from "@/components/NextStep";
import { PageHeader } from "@/components/PageHeader";
import { pageHead, site, titled } from "@/lib/content";

const p = site.pages.connect;

export const Route = createFileRoute("/connect")({
  head: () => pageHead(titled(p.title), p.description),
  component: Connect,
});

function Connect() {
  return (
    <>
      <PageHeader title={p.title} description={p.description} />
      <p className="max-w-xl text-lg">{p.body}</p>
      <p className="mt-2 text-sm text-muted-foreground">{site.location}</p>
      <NextStep heading={p.heading} items={p.links} />
    </>
  );
}
