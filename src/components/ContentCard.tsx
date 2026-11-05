import { Link } from "@tanstack/react-router";
import type { Chip as ChipData } from "@/lib/content";
import { Chip } from "@/components/Chip";
import { cn } from "@/lib/utils";

export type CardVariant = "case" | "build" | "highlight";

type Props = {
  variant: CardVariant;
  title: string;
  tagline?: string | undefined;
  eyebrow?: string | undefined;
  status?: string | undefined;
  chips?: ChipData[] | undefined;
  // An external link, or the slug of a case page. With neither, the card is not a link (a snapshot).
  href?: string | undefined;
  caseSlug?: string | undefined;
  maskedLabel?: string | undefined;
};

const titleSize: Record<CardVariant, string> = {
  case: "text-2xl",
  build: "text-2xl",
  highlight: "text-xl",
};

const frame = "group block h-full rounded-lg border p-6";
const linked = "hover:border-primary";

// One card for cases, builds and highlights: eyebrow, title, tagline, up to three chips, a status.
export function ContentCard({
  variant,
  title,
  tagline,
  eyebrow,
  status,
  chips,
  href,
  caseSlug,
  maskedLabel,
}: Props) {
  const body = (
    <>
      {eyebrow || status ? (
        <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
          <span>{eyebrow}</span>
          <span>{status}</span>
        </div>
      ) : null}
      <h3 className={cn("mt-2 font-serif group-hover:text-primary", titleSize[variant])}>
        {title}
      </h3>
      {tagline ? <p className="mt-2 text-muted-foreground">{tagline}</p> : null}
      {chips && chips.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {chips.slice(0, 3).map((c) => (
            <li key={c.text}>
              <Chip chip={c} maskedLabel={maskedLabel} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );

  if (caseSlug !== undefined) {
    return (
      <Link to="/work/$slug" params={{ slug: caseSlug }} className={cn(frame, linked)}>
        {body}
      </Link>
    );
  }
  if (href !== undefined) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cn(frame, linked)}>
        {body}
      </a>
    );
  }
  return <div className={frame}>{body}</div>;
}
