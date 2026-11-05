export type NavItem = {
  label: string;
  to: string;
  // The least content the page needs before it appears in the nav (for example 2 posts).
  min?: { collection: string; count: number } | undefined;
};

// A nav item with a minimum disappears until its collection has enough items.
export function visibleNav(nav: NavItem[], counts: Record<string, number>): NavItem[] {
  return nav.filter((n) => n.min === undefined || (counts[n.min.collection] ?? 0) >= n.min.count);
}
