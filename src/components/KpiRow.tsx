import type { Kpi } from "@/lib/content";
import { KpiValue } from "@/components/MaskedValue";

// One row of a numbers table: what was measured, how, and the value.
export function KpiRow({ kpi, maskedLabel }: { kpi: Kpi; maskedLabel?: string | undefined }) {
  return (
    <li className="flex items-baseline justify-between gap-6 py-3">
      <div>
        <p className="font-medium">{kpi.label}</p>
        <p className="text-sm text-muted-foreground">
          {kpi.how}
          {kpi.scope ? ` · ${kpi.scope}` : null}
        </p>
      </div>
      <p className="shrink-0 text-right font-serif text-2xl text-primary">
        <KpiValue kpi={kpi} maskedLabel={maskedLabel} />
      </p>
    </li>
  );
}
