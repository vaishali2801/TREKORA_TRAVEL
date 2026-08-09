import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiX, FiUser } from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import SectionHeading from "@/components/home/SectionHeading";
import { Button } from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import { EVENTS, EVENT_CATEGORIES, type EventItem } from "@/data/events";
import { fadeUp, staggerContainer } from "@/utils/motion";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Adventure Events & Photo Walks — TrekVista" },
      {
        name: "description",
        content:
          "Join TrekVista weekend treks, monastery photo walks, kayak festivals and astro photography bootcamps. Reserve your seat online.",
      },
      { property: "og:title", content: "Adventure Events & Photo Walks — TrekVista" },
      {
        property: "og:description",
        content: "Weekend treks, photo walks, festivals and workshops you can join solo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventsPage,
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function EventsPage() {
  const [category, setCategory] = useState<string>("All");
  const [active, setActive] = useState<EventItem | null>(null);

  const list = useMemo(
    () => (category === "All" ? EVENTS : EVENTS.filter((e) => e.category === category)),
    [category],
  );

  return (
    <UserLayout>
      <section className="bg-gradient-ocean py-20 text-primary-foreground">
        <div className="container-tp text-center">
          <span className="glass-dark inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.24em] uppercase">
            Events & Photography
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Join a trip that starts this season
          </h1>
          <p className="mx-auto mt-4 max-w-2xl opacity-90">
            Small-group treks, guided photo walks, festivals and skill workshops — hosted by our
            certified guides and resident photographers.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-tp">
          <div className="flex flex-wrap justify-center gap-3">
            {["All", ...EVENT_CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  category === c
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <motion.div
            key={category}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {list.map((e) => {
              const filled = Math.round(((e.totalSeats - e.seats) / e.totalSeats) * 100);
              return (
                <motion.article
                  key={e._id}
                  variants={fadeUp}
                  className="card-lift flex flex-col overflow-hidden rounded-3xl bg-card shadow-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={e.image}
                      alt={`${e.title} in ${e.location}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-gradient-forest px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
                      <FiCalendar /> {e.date}
                    </span>
                    <span className="glass-dark absolute top-4 right-4 rounded-full px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                      {e.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">{e.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {e.description}
                    </p>

                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <FiMapPin /> {e.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <FiClock /> Starts {e.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <FiUser /> Hosted by {e.host}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <FiUsers /> {e.seats} of {e.totalSeats} seats left
                        </span>
                        <span>{filled}% full</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-sunset"
                          style={{ width: `${filled}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
                      <div>
                        <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                          Per person
                        </p>
                        <p className="font-display text-xl font-bold text-foreground">
                          {inr(e.price)}
                        </p>
                      </div>
                      <Button size="sm" variant="secondary" onClick={() => setActive(e)}>
                        Reserve seat
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {list.length === 0 ? (
            <p className="mt-16 text-center text-muted-foreground">
              No events in this category right now.
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container-tp">
          <SectionHeading
            eyebrow="Photography"
            title="Shoot with our resident photographers"
            subtitle="Every photography event includes a portfolio review, RAW editing session and a licensed image set from the trip."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Small cohorts",
                d: "Six to ten photographers per host so every frame gets feedback.",
              },
              {
                t: "Gear on loan",
                d: "Tripods, ND filters and long lenses available free during workshops.",
              },
              {
                t: "Edit & deliver",
                d: "Evening editing labs — you leave with a finished, print-ready set.",
              },
            ].map((f) => (
              <div key={f.t} className="rounded-3xl bg-card p-6 shadow-card">
                <h3 className="font-heading text-base font-semibold text-foreground">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {active ? <RegisterModal event={active} onClose={() => setActive(null)} /> : null}
      </AnimatePresence>
    </UserLayout>
  );
}

function RegisterModal({ event, onClose }: { event: EventItem; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", seats: "1" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    const seats = Number(form.seats);
    if (!seats || seats < 1 || seats > event.seats) next.seats = `1 to ${event.seats} seats`;
    setErrors(next);
    if (Object.keys(next).length) return;

    toast.success(`Seat reserved for ${event.title}`, {
      description: `${seats} seat(s) · ${event.date} · ${inr(event.price * seats)} payable on confirmation.`,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-card p-6 shadow-lift"
        role="dialog"
        aria-modal="true"
        aria-label={`Reserve a seat for ${event.title}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">{event.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {event.date} · {event.location}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted-foreground transition hover:bg-muted"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <TextField
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            placeholder="Ananya Menon"
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            placeholder="you@example.com"
          />
          <TextField
            label={`Seats (max ${event.seats})`}
            type="number"
            value={form.seats}
            onChange={(e) => setForm({ ...form, seats: e.target.value })}
            error={errors.seats}
          />
          <div className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-display text-lg font-bold text-foreground">
              {inr(event.price * Math.max(1, Number(form.seats) || 1))}
            </span>
          </div>
          <Button type="submit" className="w-full">
            Confirm reservation
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
