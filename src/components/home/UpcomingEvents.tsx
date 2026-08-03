import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import { eventService } from "@/services/api";
import { FALLBACK_EVENTS, type EventLike } from "@/data/home";
import SectionHeading from "./SectionHeading";
import { Button } from "@/components/common/Button";
import { fadeUp, staggerContainer } from "@/utils/motion";

/** Upcoming adventure events — API driven with demo fallback. */
export default function UpcomingEvents() {
  const { data } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: () => eventService.list(),
    retry: 0,
    staleTime: 60_000,
  });

  const list: EventLike[] = Array.isArray(data) && data.length ? data.slice(0, 3) : FALLBACK_EVENTS;

  return (
    <section className="bg-muted/50 py-24">
      <div className="container-tp">
        <SectionHeading
          eyebrow="Events"
          title="Upcoming adventure events"
          subtitle="Weekend treks, photo walks and festivals you can join solo."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {list.map((e) => (
            <motion.article
              key={e._id}
              variants={fadeUp}
              className="card-lift overflow-hidden rounded-3xl bg-card shadow-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={e.image}
                  alt={e.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-gradient-forest px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
                  <FiCalendar /> {e.date}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground">{e.title}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <FiMapPin /> {e.location}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <FiUsers /> {e.seats} seats left
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <p className="font-display text-xl font-bold text-foreground">
                    ₹{e.price.toLocaleString("en-IN")}
                  </p>
                  <Link to="/events">
                    <Button size="sm" variant="secondary">
                      Join event
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
