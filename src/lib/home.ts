export type SlotId =
  "hero" | "impact" | "how" | "work" | "media" | "recognition" | "latest" | "next";

// One home slot as set in content/site.json: its place in the order, and the fewest and most items it shows.
export type SlotConfig = { id: SlotId; min?: number | undefined; max?: number | undefined };

export type Principle = { title: string; text: string };

// The items a slot shows, or null when it has fewer than its minimum so the slot hides itself.
export function slotItems<T>(items: T[], cfg: SlotConfig): T[] | null {
  const shown = items.slice(0, cfg.max ?? items.length);
  return shown.length >= (cfg.min ?? 1) ? shown : null;
}
