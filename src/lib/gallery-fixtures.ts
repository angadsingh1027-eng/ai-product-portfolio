import type { Chip, JourneyEntry, Kpi } from "@/lib/content";
import type { CardVariant } from "@/components/ContentCard";
import type { ChipVariant } from "@/components/Chip";

// Sample data for the hidden gallery route. It is not real content: it only shows each component
// in each state. The route is noindex and is not linked from anywhere.

type SampleCard = {
  variant: CardVariant;
  title: string;
  tagline?: string;
  eyebrow?: string;
  status?: string;
  chips?: Chip[];
  href?: string;
  caseSlug?: string;
};

type SampleChip = { chip: Chip; variant: ChipVariant };

export const fixtures = {
  title: "Component gallery",
  description: "Every component in every state, with sample data. Not linked and not indexed.",
  headings: {
    cards: "Card: case, snapshot, build, highlight and minimal",
    chips: "Chip: metric, tag, tool and masked",
    kpis: "KPI row: plain, with a scope note, masked",
    tiles: "Stat tile: plain and masked",
    section: "Section: shown at or above its minimum",
    hidden: "Section: hidden below its minimum renders nothing",
    timeline: "Timeline entry: with and without a summary",
    media: "Media block: with and without a poster",
    nextStep: "Next step: all fields, and email only",
  },
  sectionDemo: {
    heading: "Sample section",
    intro: "A section appears when it has at least its minimum number of items.",
  },
  hiddenNote: "The section above this line has no items, so it rendered nothing.",
  cards: [
    {
      variant: "case",
      eyebrow: "Sample company · 2025",
      title: "Sample case study",
      tagline: "A one-line outcome statement of up to 110 characters",
      status: "Shipped",
      chips: [{ text: "~30% calls deflected" }, { text: "3-tier AI routing" }],
      caseSlug: "zeta-agentic-platform",
    },
    {
      variant: "case",
      eyebrow: "Sample company · 2026",
      title: "Sample snapshot",
      tagline: "A snapshot has no page of its own, so the card is not a link",
      status: "Shipped",
      chips: [
        { text: "Cycle time down X%", masked: true },
        { text: "Failures down Y×", masked: true },
        { text: "Time freed Z%", masked: true },
      ],
    },
    {
      variant: "build",
      eyebrow: "AI agent · 2025",
      title: "Sample build",
      tagline: "A live prototype with an external link",
      status: "Live",
      href: "https://example.com",
    },
    {
      variant: "highlight",
      eyebrow: "Award · 2025",
      title: "Sample award",
      tagline: "Who gave it, and for what",
    },
    { variant: "case", title: "Title only" },
  ] satisfies SampleCard[],
  chips: [
    { chip: { text: "~30% deflected" }, variant: "metric" },
    { chip: { text: "agentic-ai" }, variant: "tag" },
    { chip: { text: "GPT-4o" }, variant: "tool" },
    { chip: { text: "Cycle time down X%", masked: true }, variant: "metric" },
  ] satisfies SampleChip[],
  kpis: [
    { label: "Call volume deflected", value: "~30%", how: "3-tier routing" },
    {
      label: "Market opportunity",
      value: "$500M+ ARR",
      how: "Sized from public data",
      scope: "estimated",
    },
    { label: "Discovery cycle time", value: "X%", how: "Measured on live use", masked: true },
  ] satisfies Kpi[],
  timeline: [
    {
      id: "sample-role",
      role: "Sample role",
      company: "Sample company",
      period: "2025 – 2026",
      summary: "One line on what it was.",
    },
    {
      id: "sample-school",
      role: "Entry without a summary",
      company: "Sample school",
      period: "2013",
    },
  ] satisfies JourneyEntry[],
  media: {
    withPoster: {
      href: "https://example.com",
      label: "Watch the demo",
      duration: "2:27",
      poster: "/angad-singh-photo.png",
      posterAlt: "Sample poster",
    },
    withoutPoster: { href: "https://example.com", label: "Watch the demo", duration: "2:27" },
  },
  nextStep: {
    heading: "Next step",
    intro: "Email is the fastest way to reach me.",
    full: [
      { label: "Email", value: "name@example.com", href: "mailto:name@example.com" },
      { label: "LinkedIn", value: "linkedin.com/in/sample", href: "https://example.com" },
      { label: "Resume", value: "Download the PDF", href: "https://example.com" },
    ],
    emailOnly: [
      { label: "Email", value: "name@example.com", href: "mailto:name@example.com" },
      { label: "Resume" },
    ],
  },
};
