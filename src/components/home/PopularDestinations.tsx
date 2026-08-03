import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { DESTINATIONS } from "@/data/home";
import SectionHeading from "./SectionHeading";
import { fadeUp, staggerContainer } from "@/utils/motion";

/** Destination mosaic linking into the packages listing. */
export default function PopularDestinations() {
  return (
    <section className="container-tp py-24">
      <SectionHeading
        eyebrow="Destinations"
        title="Where trekkers are heading"
        subtitle="From high-altitude passes to palm-fringed backwaters — pick your landscape."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {DESTINATIONS.map((d) => (
          <motion.div key={d.name} variants={fadeUp}>
            <Link
              to="/packages"
              className="group relative block aspect-[3/4] overflow-hidden rounded-3xl shadow-card"
            >
              <img
                src={d.image}
                alt={`Travel packages in ${d.name}`}
                loading="lazy"
                width={1024}
                height={768}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-hero-overlay" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                    {d.name}
                  </h3>
                  <p className="text-xs text-primary-foreground/75">{d.trips} packages</p>
                </div>
                <span className="glass-dark flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground transition-transform duration-300 group-hover:rotate-45">
                  <FiArrowUpRight />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
