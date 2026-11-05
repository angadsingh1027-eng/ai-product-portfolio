import type { Kpi } from "@/lib/content";

// A withheld figure shown as a letter and a unit (X%, Y×). It looks like a real value, and screen
// readers are told the figure is withheld.
export function MaskedValue({ value, label }: { value: string; label?: string | undefined }) {
  return (
    <span>
      {value}
      {label ? <span className="sr-only"> ({label})</span> : null}
    </span>
  );
}

// The display value of a KPI: masked when the KPI says so, as written otherwise.
export function KpiValue({ kpi, maskedLabel }: { kpi: Kpi; maskedLabel?: string | undefined }) {
  return kpi.masked === true ? (
    <MaskedValue value={kpi.value} label={maskedLabel} />
  ) : (
    <>{kpi.value}</>
  );
}
