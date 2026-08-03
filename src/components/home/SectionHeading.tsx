import { Reveal, fadeUp } from "@/utils/motion";

/** Shared eyebrow + title + subtitle block for home sections. */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal variants={fadeUp} className={align === "center" ? "text-center" : "text-left"}>
      <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.24em] text-primary uppercase">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      {subtitle ? (
        <p
          className={`mt-3 max-w-2xl text-muted-foreground ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
