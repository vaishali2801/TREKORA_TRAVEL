import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiCompass } from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import PackageCard from "@/components/PackageCard";
import PackageFilters, { DEFAULT_FILTERS, type Filters } from "@/components/packages/PackageFilters";
import { ALL_PACKAGES, type PackageDetail } from "@/data/packages";
import { packageService } from "@/services/api";

export const Route = createFileRoute("/packages/")({
  head: () => ({
    meta: [
      { title: "Tour Packages — Treks, Safaris & Retreats | TrekVista" },
      {
        name: "description",
        content:
          "Browse TrekVista tour packages — Himalayan treks, Ladakh overlands, Kerala backwaters and desert safaris. Filter by destination, difficulty and budget.",
      },
      { property: "og:title", content: "Tour Packages — Treks, Safaris & Retreats | TrekVista" },
      {
        property: "og:description",
        content: "Filter every TrekVista adventure by destination, difficulty, price and rating.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PackagesPage,
});

function PackagesPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const { data } = useQuery({
    queryKey: ["packages"],
    queryFn: () => packageService.list() as Promise<PackageDetail[]>,
    retry: false,
  });

  const source: PackageDetail[] = Array.isArray(data) && data.length ? data : ALL_PACKAGES;

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const list = source.filter((p) => {
      if (q && !`${p.title} ${p.destination}`.toLowerCase().includes(q)) return false;
      if (filters.destination !== "all" && p.destination !== filters.destination) return false;
      if (filters.difficulty !== "all" && p.difficulty !== filters.difficulty) return false;
      if (p.price > filters.maxPrice) return false;
      return true;
    });

    const sorted = [...list];
    if (filters.sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (filters.sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (filters.sort === "duration") sorted.sort((a, b) => (a.days ?? 0) - (b.days ?? 0));
    if (filters.sort === "popular") sorted.sort((a, b) => b.reviews - a.reviews);
    return sorted;
  }, [source, filters]);

  return (
    <UserLayout>
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.2em] text-secondary uppercase"
          >
            <FiCompass /> Explore
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 font-display text-4xl font-bold text-foreground md:text-5xl"
          >
            Find your next adventure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-muted-foreground"
          >
            Handcrafted itineraries across the Himalaya, the deserts and the backwaters — filter by
            destination, difficulty and budget to find the trip that fits you.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[280px_1fr]">
        <PackageFilters
          filters={filters}
          onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />

        <div>
          <p className="mb-6 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{results.length}</span> of{" "}
            {source.length} packages
          </p>

          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-14 text-center">
              <p className="font-heading text-lg font-semibold text-foreground">No matching trips</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening your budget or clearing the destination filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((pkg, i) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                >
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </UserLayout>
  );
}
