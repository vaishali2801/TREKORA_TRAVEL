import { FiShield, FiUsers, FiPackage, FiHeadphones, FiAward, FiCreditCard } from "react-icons/fi";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { fadeUp, staggerContainer } from "@/utils/motion";

const FEATURES = [
  { icon: FiShield, title: "Certified safety", text: "Licensed guides, medical kits and satellite comms on every high-altitude route." },
  { icon: FiUsers, title: "Small groups", text: "Maximum 12 travellers per departure so nobody gets lost in the crowd." },
  { icon: FiPackage, title: "Gear on rent", text: "Premium tested trekking equipment delivered to your door before departure." },
  { icon: FiHeadphones, title: "24/7 support", text: "Real humans on call before, during and after your trip — no bots." },
  { icon: FiAward, title: "Best price promise", text: "Find the same itinerary cheaper and we'll match it, no questions asked." },
  { icon: FiCreditCard, title: "Secure booking", text: "Instant confirmation, flexible rescheduling and encrypted payments." },
];

/** Value proposition grid. */
export default function WhyChooseUs() {
  return (
    <section className="bg-muted/50 py-24">
      <div className="container-tp">
        <SectionHeading
          eyebrow="Why TrekVista"
          title="Built for people who actually travel"
          subtitle="Everything you need to plan, book and gear up for the outdoors — in one place."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="card-lift rounded-3xl bg-card p-7 shadow-soft"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-ocean text-primary-foreground">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
