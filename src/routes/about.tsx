import { createFileRoute, Link } from "@tanstack/react-router";
import { FiArrowRight, FiAward, FiCompass, FiHeart, FiShield, FiUsers } from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import { Button } from "@/components/common/Button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TrekVista Tours & Treks" },
      {
        name: "description",
        content: "Learn about TrekVista's mission, values and the team behind every unforgettable expedition.",
      },
      { property: "og:title", content: "About — TrekVista Tours & Treks" },
      {
        property: "og:description",
        content: "Our story, values and commitment to safe, meaningful Himalayan journeys.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: FiShield,
    title: "Safety first",
    description: "Certified trek leaders, high-altitude protocols and emergency-ready operations on every route.",
  },
  {
    icon: FiHeart,
    title: "Responsible travel",
    description: "Leave-no-trace practices and partnerships with local communities at every destination.",
  },
  {
    icon: FiCompass,
    title: "Expert curation",
    description: "Handpicked itineraries balancing adventure, comfort, culture and scenic impact.",
  },
];

const HIGHLIGHTS = [
  { value: "18K+", label: "Travellers Guided", icon: FiUsers },
  { value: "120+", label: "Curated Journeys", icon: FiCompass },
  { value: "12", label: "Years of Operations", icon: FiAward },
];

function AboutPage() {
  return (
    <UserLayout>
      <section className="bg-gradient-ocean py-20 text-primary-foreground">
        <div className="container-tp text-center">
          <span className="glass-dark inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.24em] uppercase">
            About TrekVista
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold md:text-5xl">
            Crafting mountain journeys that feel personal, safe and unforgettable
          </h1>
          <p className="mx-auto mt-4 max-w-2xl opacity-90">
            We started TrekVista to make high-quality adventure travel easier to access, without
            compromising on safety, authenticity or comfort.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-tp grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Our story</h2>
            <p className="mt-5 text-muted-foreground">
              TrekVista began as a small guide-led initiative serving friends and families who wanted
              thoughtfully planned Himalayan escapes. As word spread, we grew into a full-service
              travel platform connecting trekkers to curated packages, expert support and premium
              equipment.
            </p>
            <p className="mt-4 text-muted-foreground">
              Today, our team works with local hosts, expedition leaders and logistics partners to
              deliver consistent, transparent and memorable experiences from first inquiry to summit
              day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/packages">
                <Button>
                  Explore Packages <FiArrowRight />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">Talk to our team</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, value, label }) => (
              <article key={label} className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-20">
        <div className="container-tp">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">What we stand for</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </UserLayout>
  );
}
