import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiCamera, FiChevronLeft, FiChevronRight, FiMapPin, FiX } from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import { GALLERY, type GalleryPhoto } from "@/data/events";
import { galleryService, type FrontendGalleryPhoto } from "@/services/api";
import { fadeUp, staggerContainer } from "@/utils/motion";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Trip Photo Gallery — TrekVista Expeditions" },
      {
        name: "description",
        content:
          "Photographs from TrekVista expeditions — Himalayan summits, Ladakh monasteries, Kerala backwaters and high-altitude camps.",
      },
      { property: "og:title", content: "Trip Photo Gallery — TrekVista Expeditions" },
      {
        property: "og:description",
        content: "Moments from our expeditions, shot by our guides and resident photographers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [category, setCategory] = useState<string>("All");
  const [index, setIndex] = useState<number | null>(null);

  const { data } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => galleryService.list(),
    retry: false,
  });

  const source: FrontendGalleryPhoto[] =
    data && data.length ? data : (GALLERY as unknown as FrontendGalleryPhoto[]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(source.map((p) => p.category)))],
    [source],
  );

  const photos = useMemo(
    () => (category === "All" ? source : source.filter((p) => p.category === category)),
    [source, category],
  );

  const open = index !== null ? photos[index] : null;
  const step = (dir: number) => {
    if (index === null) return;
    setIndex((index + dir + photos.length) % photos.length);
  };

  return (
    <UserLayout>
      <section className="bg-gradient-ocean py-20 text-primary-foreground">
        <div className="container-tp text-center">
          <span className="glass-dark inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.24em] uppercase">
            Gallery
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Moments from the trail
          </h1>
          <p className="mx-auto mt-4 max-w-2xl opacity-90">
            Every frame here was shot on a TrekVista departure by our guides, hosts and travellers.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-tp">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setIndex(null);
                }}
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
            className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5"
          >
            {photos.map((p, i) => (
              <motion.button
                key={p._id + i}
                variants={fadeUp}
                type="button"
                onClick={() => setIndex(i)}
                className="card-lift group relative block w-full overflow-hidden rounded-3xl shadow-card"
                aria-label={`Open photo: ${p.caption}`}
              >
                <img
                  src={p.src}
                  alt={`${p.caption} — ${p.location}`}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"
                  }`}
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-5 text-left">
                  <span className="block font-heading text-sm font-semibold text-background">
                    {p.caption}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-xs text-background/80">
                    <FiMapPin /> {p.location}
                  </span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/85 p-4 backdrop-blur-sm"
            onClick={() => setIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.caption}
          >
            <button
              type="button"
              onClick={() => setIndex(null)}
              aria-label="Close photo"
              className="absolute top-5 right-5 rounded-full bg-background/15 p-3 text-background transition hover:bg-background/30"
            >
              <FiX />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-4 rounded-full bg-background/15 p-3 text-background transition hover:bg-background/30"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              className="absolute right-4 rounded-full bg-background/15 p-3 text-background transition hover:bg-background/30"
            >
              <FiChevronRight />
            </button>

            <motion.figure
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl overflow-hidden rounded-3xl bg-card"
            >
              <img src={open.src} alt={open.caption} className="max-h-[70vh] w-full object-cover" />
              <figcaption className="flex flex-wrap items-center justify-between gap-2 p-5">
                <div>
                  <p className="font-heading text-base font-semibold text-foreground">
                    {open.caption}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <FiMapPin /> {open.location}
                  </p>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <FiCamera /> {open.photographer}
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </UserLayout>
  );
}
