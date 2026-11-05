type Item = { label: string; value?: string | undefined; href?: string | undefined };

type Props = {
  heading: string;
  intro?: string | undefined;
  items: Item[];
};

// What the visitor can do next: email, LinkedIn, resume, booking link. It shows only the items that
// have a value, and nothing at all when none do.
export function NextStep({ heading, intro, items }: Props) {
  const shown = items.filter((i) => i.value && i.href);
  if (shown.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-sm font-medium text-muted-foreground">{heading}</h2>
      {intro ? <p className="mb-4 max-w-xl text-lg">{intro}</p> : null}
      <ul className="divide-y border-y">
        {shown.map((i) => (
          <li key={i.label}>
            <a
              href={i.href}
              target="_blank"
              rel="noreferrer"
              className="group flex justify-between gap-4 py-4"
            >
              <span className="text-muted-foreground">{i.label}</span>
              <span className="truncate text-primary underline-offset-4 group-hover:underline">
                {i.value}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
