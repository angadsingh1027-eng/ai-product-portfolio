import type { ReactNode } from "react";

type Props = {
  heading: string;
  intro?: string | undefined;
  // How many items the section has, and the least it needs to be worth showing.
  count: number;
  min?: number | undefined;
  children: ReactNode;
};

// A page section that hides itself when it has too little content, so nothing reads as "coming soon".
export function Section({ heading, intro, count, min = 1, children }: Props) {
  if (count < min) return null;
  return (
    <section className="mt-16 sm:mt-24">
      <h2 className="mb-6 font-serif text-3xl">{heading}</h2>
      {intro ? <p className="mb-6 max-w-xl text-foreground">{intro}</p> : null}
      {children}
    </section>
  );
}
