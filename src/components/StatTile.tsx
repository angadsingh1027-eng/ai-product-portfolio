import type { Kpi } from "@/lib/content";
import { KpiValue } from "@/components/MaskedValue";

// A big number with its label, for the Home impact strip.
export function StatTile({ kpi, maskedLabel }: { kpi: Kpi; maskedLabel?: string | undefined }) {
  return (
    <li className="rounded-lg border p-4">
      <p className="break-words font-serif text-2xl text-primary sm:text-3xl">
        <KpiValue kpi={kpi} maskedLabel={maskedLabel} />
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{kpi.label}</p>
    </li>
  );
}
