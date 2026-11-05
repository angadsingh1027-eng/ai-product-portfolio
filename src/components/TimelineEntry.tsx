import type { JourneyEntry } from "@/lib/content";

// One role or school on the Journey timeline. Render inside <ol className="space-y-10 border-l pl-6">.
export function TimelineEntry({
  entry,
  headingLevel = "h3",
}: {
  entry: JourneyEntry;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <li className="relative">
      <span className="absolute -left-7.25 top-2 size-2.5 rounded-full bg-primary" />
      <p className="text-sm text-muted-foreground">{entry.period}</p>
      <Heading className="mt-1 font-serif text-2xl">{entry.role}</Heading>
      <p className="text-sm font-medium">{entry.company}</p>
      {entry.summary ? <p className="mt-2 text-muted-foreground">{entry.summary}</p> : null}
    </li>
  );
}
