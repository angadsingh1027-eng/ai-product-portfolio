export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-12 sm:mb-16">
      <h1 className="font-serif text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-xl text-lg text-foreground">{description}</p>
    </header>
  );
}
