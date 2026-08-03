import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay, FiChevronDown } from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import { Button } from "@/components/common/Button";
import heroImage from "@/assets/hero-mountains.jpg";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PopularDestinations from "@/components/home/PopularDestinations";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import Testimonials from "@/components/home/Testimonials";
import GalleryPreview from "@/components/home/GalleryPreview";
import NewsletterCTA from "@/components/home/NewsletterCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrekVista — Himalayan Treks, Tours & Adventure Packages" },
      {
        name: "description",
        content:
          "Discover handpicked trekking packages, adventure events and premium gear rentals. Book your next expedition with certified guides.",
      },
      { property: "og:title", content: "TrekVista — Himalayan Treks & Adventure Packages" },
      {
        property: "og:description",
        content: "Handpicked treks, adventure events and premium gear rentals in one place.",
      },
    ],
  }),
  component: Home,
});

const STATS = [
  { value: "120+", label: "Curated Packages" },
  { value: "18K+", label: "Happy Travellers" },
  { value: "45", label: "Destinations" },
  { value: "4.9", label: "Average Rating" },
];

function Home() {
  return (
    <UserLayout>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Sunrise over Himalayan peaks with a lone trekker on a ridge"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />

        <div className="container-tp relative z-10 pt-24 pb-32 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-dark inline-block rounded-full px-5 py-2 text-xs font-semibold tracking-[0.24em] text-primary-foreground uppercase"
          >
            Adventure begins here
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-4xl font-display text-4xl leading-[1.08] font-bold text-primary-foreground sm:text-6xl lg:text-7xl"
          >
            Explore the world's most breathtaking trails
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-base text-primary-foreground/85 sm:text-lg"
          >
            Curated treks, camps and cultural journeys — with certified guides, premium gear and
            instant online booking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/packages">
              <Button size="lg">
                Explore Packages <FiArrowRight />
              </Button>
            </Link>
            <Link to="/packages">
              <Button size="lg" variant="glass">
                <FiPlay /> Book Now
              </Button>
            </Link>
          </motion.div>

          {/* Floating statistics */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="glass-dark mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 rounded-3xl px-8 py-7 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-primary-foreground">{s.value}</p>
                <p className="mt-1 text-[11px] tracking-[0.16em] text-primary-foreground/70 uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 z-10 text-primary-foreground/80"
        >
          <FiChevronDown size={30} />
        </motion.div>

        {/* Wave divider */}
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute -bottom-px left-0 z-10 h-20 w-full fill-background"
        >
          <path d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,72 L1440,120 L0,120 Z" />
        </svg>
      </section>

      <FeaturedPackages />
      <WhyChooseUs />
      <PopularDestinations />
      <UpcomingEvents />
      <Testimonials />
      <GalleryPreview />
      <NewsletterCTA />
    </UserLayout>
  );
}
