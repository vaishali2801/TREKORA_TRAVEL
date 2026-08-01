import { Link } from "@tanstack/react-router";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
} from "react-icons/fi";
import { Reveal, fadeUp } from "@/utils/motion";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Packages", to: "/packages" },
  { label: "Events", to: "/events" },
] as const;

const EXPLORE_LINKS = [
  { label: "Equipment Store", to: "/store" },
  { label: "Gallery", to: "/gallery" },
  { label: "Reviews", to: "/reviews" },
  { label: "Contact", to: "/contact" },
] as const;

const SOCIALS = [
  { icon: FiInstagram, label: "Instagram" },
  { icon: FiFacebook, label: "Facebook" },
  { icon: FiTwitter, label: "Twitter" },
  { icon: FiYoutube, label: "YouTube" },
];

/** Global site footer with newsletter, quick links and contact details. */
export default function Footer() {
  return (
    <footer className="relative mt-24 bg-sidebar text-sidebar-foreground">
      <div className="container-tp grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <Reveal variants={fadeUp} className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-ocean font-display text-lg font-bold text-primary-foreground">
              T
            </span>
            <span className="font-display text-xl font-bold">TrekVista</span>
          </Link>
          <p className="text-sm leading-relaxed text-sidebar-foreground/70">
            Curated treks, camps and cultural journeys across the Himalayas and beyond. Book
            packages, rent premium gear and travel with certified guides.
          </p>
          <div className="flex gap-2 pt-1">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent transition-all duration-300 hover:-translate-y-1 hover:bg-primary"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal variants={fadeUp} delay={0.1}>
          <h4 className="font-heading text-sm tracking-[0.18em] uppercase">Quick Links</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sidebar-foreground/70 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal variants={fadeUp} delay={0.2}>
          <h4 className="font-heading text-sm tracking-[0.18em] uppercase">Explore</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {EXPLORE_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sidebar-foreground/70 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal variants={fadeUp} delay={0.3} className="space-y-5">
          <div>
            <h4 className="font-heading text-sm tracking-[0.18em] uppercase">Newsletter</h4>
            <p className="mt-4 text-sm text-sidebar-foreground/70">
              Get early access to new expeditions and seasonal offers.
            </p>
            <form
              className="mt-4 flex items-center gap-2 rounded-full bg-sidebar-accent p-1.5"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full bg-transparent px-3 text-sm outline-none placeholder:text-sidebar-foreground/50"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-sunset text-accent-foreground"
              >
                <FiSend size={15} />
              </button>
            </form>
          </div>
          <ul className="space-y-2.5 text-sm text-sidebar-foreground/70">
            <li className="flex items-center gap-2.5">
              <FiPhone size={15} className="text-secondary" /> +91 98250 12345
            </li>
            <li className="flex items-center gap-2.5">
              <FiMail size={15} className="text-secondary" /> hello@trekvista.com
            </li>
            <li className="flex items-center gap-2.5">
              <FiMapPin size={15} className="text-secondary" /> Bhavnagar, Gujarat, India
            </li>
          </ul>
        </Reveal>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="container-tp flex flex-col items-center justify-between gap-3 py-6 text-xs text-sidebar-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} TrekVista Tours & Treks. All rights reserved.</p>
          <p>Crafted for unforgettable journeys.</p>
        </div>
      </div>
    </footer>
  );
}
