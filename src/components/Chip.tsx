import type { Chip as ChipData } from "@/lib/content";
import { cn } from "@/lib/utils";

export type ChipVariant = "metric" | "tag" | "tool";

type Props = {
  chip: ChipData;
  variant?: ChipVariant | undefined;
  maskedLabel?: string | undefined;
};

const tones: Record<ChipVariant, string> = {
  metric: "border-primary/40 font-medium text-foreground",
  tag: "text-muted-foreground",
  tool: "bg-muted text-muted-foreground",
};

// A short pill: a metric, a tag or a tool. A masked chip also tells screen readers the figure is withheld.
export function Chip({ chip, variant = "metric", maskedLabel }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-sm",
        tones[variant],
      )}
    >
      {chip.text}
      {chip.masked === true && maskedLabel ? (
        <span className="sr-only"> ({maskedLabel})</span>
      ) : null}
    </span>
  );
}
