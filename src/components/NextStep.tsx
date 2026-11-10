import { Calendar, FileText, Github, Link as LinkIcon, Linkedin, Mail } from "lucide-react";

type Item = {
  label: string;
  value?: string | undefined;
  href?: string | undefined;
  // A name from the content file; an unknown name falls back to a plain link icon.
  icon?: string | undefined;
};

const icons = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  resume: FileText,
  calendar: Calendar,
};

type Props = {
  heading: string;
  intro?: string | undefined;
  items: Item[];
};

// What the visitor can do next: email, LinkedIn, resume, booking link. It shows only the items that
// have a value, and nothing at all when none do.
export function NextStep({ heading, intro, items }: Props) {
  const shown = items.filter((i) => i.value && i.href);
  if (shown.length === 0) return null;
  return (
    <section className="mt-16 sm:mt-24">
      <h2 className="mb-6 font-serif text-3xl">{heading}</h2>
      {intro ? <p className="mb-6 max-w-xl text-lg">{intro}</p> : null}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {shown.map((i) => {
          const Icon = icons[i.icon as keyof typeof icons] ?? LinkIcon;
          return (
            <li key={i.label}>
              <a
                href={i.href}
                title={i.value}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-primary hover:border-primary"
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                <span className="underline-offset-4 group-hover:underline">{i.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
