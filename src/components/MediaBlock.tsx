type Props = {
  href: string;
  label: string;
  poster?: string | undefined;
  posterAlt?: string | undefined;
  duration?: string | undefined;
};

// A link to a video or demo, with an optional poster. It never autoplays and loads no third-party script.
export function MediaBlock({ href, label, poster, posterAlt, duration }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-4 rounded-lg border p-4 hover:border-primary"
    >
      {poster ? (
        <img
          src={poster}
          alt={posterAlt ?? ""}
          width={160}
          height={90}
          loading="lazy"
          className="aspect-video w-40 shrink-0 rounded-md object-cover"
        />
      ) : null}
      <span>
        <span className="block font-medium group-hover:text-primary">{label} ↗</span>
        {duration ? <span className="block text-sm text-muted-foreground">{duration}</span> : null}
      </span>
    </a>
  );
}
