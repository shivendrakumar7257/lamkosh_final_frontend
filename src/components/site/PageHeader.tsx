import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="border-b border-border">
      <div className="container-lux max-w-3xl py-16 md:py-24">
        <Reveal>
          <nav className="flex gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">{title}</span>
          </nav>
          <p className="eyebrow mt-8">{eyebrow}</p>
          <h1 className="display-lg mt-4">{title}</h1>
          {intro ? <p className="body-lux mt-6">{intro}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}

export function Prose({ sections }: { sections: { heading: string; body: string[] }[] }) {
  return (
    <div className="container-lux max-w-3xl py-16">
      {sections.map((s) => (
        <Reveal key={s.heading} className="mb-12">
          <h2 className="display-md">{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p} className="body-lux mt-4">
              {p}
            </p>
          ))}
        </Reveal>
      ))}
    </div>
  );
}
