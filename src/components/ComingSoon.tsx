import { Reveal, fadeUp } from "@/utils/motion";

/**
 * Temporary section shell used by routes that are built in later phases.
 * Keeps routing/navigation testable without shipping empty pages.
 */
export default function ComingSoon({
  title,
  subtitle,
  phase,
}: {
  title: string;
  subtitle: string;
  phase: string;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-ocean opacity-10" />
      <div className="container-tp relative text-center">
        <Reveal variants={fadeUp}>
          <span className="inline-block rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {phase}
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold text-foreground md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}
