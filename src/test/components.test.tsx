import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chip } from "@/components/Chip";
import { ContentCard } from "@/components/ContentCard";
import { KpiRow } from "@/components/KpiRow";
import { NextStep } from "@/components/NextStep";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

const LABEL = "Figure withheld";

describe("components", () => {
  it("Section renders nothing below its minimum and its content at or above it", () => {
    const hidden = render(
      <Section heading="Heading" count={1} min={2}>
        <p>Body</p>
      </Section>,
    );
    expect(hidden.container.firstChild).toBeNull();
    hidden.unmount();

    render(
      <Section heading="Heading" count={2} min={2}>
        <p>Body</p>
      </Section>,
    );
    expect(screen.queryByText("Heading")).not.toBeNull();
    expect(screen.queryByText("Body")).not.toBeNull();
  });

  it("NextStep shows only the items that have a value, and nothing when none do", () => {
    const empty = render(<NextStep heading="Next" items={[{ label: "Resume" }]} />);
    expect(empty.container.firstChild).toBeNull();
    empty.unmount();

    render(
      <NextStep
        heading="Next"
        items={[{ label: "Email", value: "a@b.co", href: "mailto:a@b.co" }, { label: "Resume" }]}
      />,
    );
    expect(screen.queryByText("Email")).not.toBeNull();
    expect(screen.queryByText("Resume")).toBeNull();
  });

  it("a masked chip tells screen readers the figure is withheld; a plain chip does not", () => {
    const masked = render(
      <Chip chip={{ text: "Cycle time down X%", masked: true }} maskedLabel={LABEL} />,
    );
    expect(masked.container.textContent).toContain(LABEL);
    masked.unmount();

    const plain = render(<Chip chip={{ text: "~30% deflected" }} maskedLabel={LABEL} />);
    expect(plain.container.textContent).not.toContain(LABEL);
  });

  it("a masked KPI row shows the masked value, the label and the scope note", () => {
    const { container } = render(
      <ul>
        <KpiRow
          kpi={{
            label: "Cycle time",
            value: "X%",
            how: "Measured on live use",
            scope: "estimated",
            masked: true,
          }}
          maskedLabel={LABEL}
        />
      </ul>,
    );
    expect(container.textContent).toContain("X%");
    expect(container.textContent).toContain(LABEL);
    expect(container.textContent).toContain("estimated");
  });

  it("a plain stat tile shows the value and the label only", () => {
    const { container } = render(
      <ul>
        <StatTile
          kpi={{ label: "Calls deflected", value: "~30%", how: "Routing" }}
          maskedLabel={LABEL}
        />
      </ul>,
    );
    expect(container.textContent).toContain("~30%");
    expect(container.textContent).not.toContain(LABEL);
  });

  it("ContentCard shows at most three chips and is a link only when it has one", () => {
    const chips = [{ text: "a" }, { text: "b" }, { text: "c" }, { text: "d" }];
    const linked = render(
      <ContentCard variant="build" title="Build" chips={chips} href="https://example.com" />,
    );
    expect(linked.container.querySelectorAll("li").length).toBe(3);
    expect(linked.container.querySelector("a")).not.toBeNull();
    linked.unmount();

    const plain = render(<ContentCard variant="case" title="Snapshot" />);
    expect(plain.container.querySelector("a")).toBeNull();
  });
});
