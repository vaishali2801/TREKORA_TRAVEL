import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import GearCard from "@/components/store/GearCard";
import StoreFilters, {
  DEFAULT_GEAR_FILTERS,
  type GearFilters,
} from "@/components/store/StoreFilters";
import { GEAR_PRODUCTS, type GearProduct } from "@/data/gear";
import { productService } from "@/services/api";

export const Route = createFileRoute("/store/")({
  head: () => ({
    meta: [
      { title: "Gear Store — Buy or Rent Trekking Equipment | TrekVista" },
      {
        name: "description",
        content:
          "Buy or rent expedition-grade trekking gear: backpacks, tents, sleeping bags, boots and hardshells, delivered before your TrekVista departure.",
      },
      { property: "og:title", content: "Gear Store — Buy or Rent Trekking Equipment | TrekVista" },
      {
        property: "og:description",
        content: "Expedition-grade backpacks, tents, sleeping bags and boots — available to buy or rent per day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const [filters, setFilters] = useState<GearFilters>(DEFAULT_GEAR_FILTERS);

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.list() as Promise<GearProduct[]>,
    retry: false,
  });

  const products = Array.isArray(data) && data.length ? data : GEAR_PRODUCTS;

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const list = products.filter((p) => {
      const price = filters.mode === "rent" ? (p.rentPerDay ?? Infinity) : p.price;
      if (filters.mode === "rent" && typeof p.rentPerDay !== "number") return false;
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (price > filters.maxPrice) return false;
      if (q && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });

    const priceOf = (p: GearProduct) => (filters.mode === "rent" ? (p.rentPerDay ?? 0) : p.price);
    return [...list].sort((a, b) => {
      if (filters.sort === "price-asc") return priceOf(a) - priceOf(b);
      if (filters.sort === "price-desc") return priceOf(b) - priceOf(a);
      if (filters.sort === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });
  }, [products, filters]);

  return (
    <UserLayout>
      <section className="bg-gradient-hero px-4 py-16 text-primary-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">Gear store</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Buy it. Or rent it for the trip.
          </h1>
          <p className="mt-4 max-w-2xl text-sm opacity-90 sm:text-base">
            Field-tested equipment from our expedition lockers. Rentals are sanitised, inspected and
            delivered to your hotel the evening before departure.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[280px_1fr]">
          <StoreFilters
            filters={filters}
            onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
            onReset={() => setFilters(DEFAULT_GEAR_FILTERS)}
          />

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{results.length}</span> items
                available to {filters.mode === "rent" ? "rent" : "buy"}
              </p>
              <div className="inline-flex rounded-full bg-muted p-1">
                {(["buy", "rent"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, mode: m }))}
                    className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                      filters.mode === m
                        ? "bg-card text-foreground shadow-card"
                        : "text-muted-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {results.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border py-20 text-center">
                <FiPackage className="mx-auto text-3xl text-muted-foreground" />
                <p className="mt-4 font-heading text-lg font-semibold text-foreground">
                  No gear matches those filters
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try widening the price range or switching category.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p, i) => (
                  <motion.div
                    key={`${p._id}-${filters.mode}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
                  >
                    <GearCard product={p} mode={filters.mode} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </UserLayout>
  );
}
