import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import authImage from "@/assets/dest-everest.jpg";

const PERKS = [
  "Instant booking with certified expedition leaders",
  "Track bookings, orders and rentals in one place",
  "Member-only departures and gear discounts",
];

/** Split-screen shell shared by the login and register pages. */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className="grid min-h-screen lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={authImage}
          alt="Himalayan peaks at sunrise"
          className="absolute inset-0 h-full w-full object-cover"
          width={1024}
          height={1400}
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative flex h-full flex-col justify-end p-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-display text-4xl leading-tight font-bold text-primary-foreground">
              Your next altitude
              <br />
              starts with an account
            </h2>
            <ul className="mt-8 space-y-3">
              {PERKS.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 text-sm text-primary-foreground/85"
                >
                  <FiCheckCircle className="mt-0.5 shrink-0 text-secondary" /> {p}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-background px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <FiArrowLeft /> Back to home
          </Link>

          <div className="mt-8 flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-ocean font-display text-lg font-bold text-primary-foreground shadow-soft">
              T
            </span>
            <span className="font-display text-xl leading-none font-bold text-foreground">
              TrekVista
              <span className="block font-sans text-[10px] tracking-[0.28em] text-muted-foreground uppercase">
                Tours &amp; Treks
              </span>
            </span>
          </div>

          <h1 className="mt-8 font-display text-3xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
        </motion.div>
      </div>
    </section>
  );
}
