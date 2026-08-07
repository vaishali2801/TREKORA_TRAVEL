import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiMapPin,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";
import UserLayout from "@/layouts/UserLayout";
import { Button } from "@/components/common/Button";
import PackageCard from "@/components/PackageCard";
import { ALL_PACKAGES, type PackageDetail } from "@/data/packages";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const Route = createFileRoute("/packages/$packageId")({
  loader: ({ params }): { pkg: PackageDetail } => {
    const pkg = ALL_PACKAGES.find((p) => p._id === params.packageId);
    if (!pkg) throw notFound();
    return { pkg };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Package unavailable — TrekVista" }, { name: "robots", content: "noindex" }] };
    }
    const { pkg } = loaderData;
    return {
      meta: [
        { title: `${pkg.title} — ${pkg.duration} | TrekVista` },
        { name: "description", content: pkg.overview.slice(0, 155) },
        { property: "og:title", content: `${pkg.title} — TrekVista` },
        { property: "og:description", content: pkg.overview.slice(0, 155) },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: PackageNotFound,
  errorComponent: ({ error }) => (
    <UserLayout>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center" role="alert">
        <h1 className="font-display text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
      </div>
    </UserLayout>
  ),
  component: PackageDetailPage,
});

function PackageNotFound() {
  return (
    <UserLayout>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Package not found</h1>
        <p className="mt-3 text-muted-foreground">
          This trip may have been retired. Browse our current departures instead.
        </p>
        <Link to="/packages" className="mt-8 inline-block">
          <Button>Back to packages</Button>
        </Link>
      </div>
    </UserLayout>
  );
}

const TABS = ["Overview", "Itinerary", "Inclusions", "Gallery"] as const;

function PackageDetailPage() {
  const { pkg } = Route.useLoaderData() as { pkg: PackageDetail };
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  const related = ALL_PACKAGES.filter((p) => p._id !== pkg._id).slice(0, 3);

  return (
    <UserLayout>
      <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
        <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-6 pb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {pkg.tag ? (
                <span className="rounded-full bg-gradient-sunset px-3 py-1 text-[11px] font-semibold tracking-wider text-accent-foreground uppercase">
                  {pkg.tag}
                </span>
              ) : null}
              <h1 className="mt-3 font-display text-3xl font-bold text-white md:text-5xl">{pkg.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/85">
                <span className="flex items-center gap-1.5">
                  <FiMapPin /> {pkg.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock /> {pkg.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiTrendingUp /> {pkg.difficulty}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiStar className="text-accent" /> {pkg.rating} ({pkg.reviews} reviews)
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap gap-2 border-b border-border pb-3">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === t
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-8">
            {tab === "Overview" ? (
              <div>
                <p className="text-base leading-relaxed text-muted-foreground">{pkg.overview}</p>
                <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">Trip highlights</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {pkg.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4 text-sm text-foreground">
                      <FiCheck className="mt-0.5 shrink-0 text-secondary" /> {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <InfoTile icon={<FiUsers />} label="Group size" value={pkg.groupSize} />
                  <InfoTile icon={<FiCalendar />} label="Best season" value={pkg.bestSeason} />
                  <InfoTile icon={<FiTrendingUp />} label="Difficulty" value={pkg.difficulty} />
                </div>
              </div>
            ) : null}

            {tab === "Itinerary" ? (
              <ol className="relative space-y-6 border-l border-border pl-6">
                {pkg.itinerary.map((d) => (
                  <li key={d.day} className="relative">
                    <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                      {d.day}
                    </span>
                    <h3 className="font-heading text-base font-semibold text-foreground">{d.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{d.detail}</p>
                  </li>
                ))}
              </ol>
            ) : null}

            {tab === "Inclusions" ? (
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground">What's included</h3>
                  <ul className="mt-4 space-y-3">
                    {pkg.inclusions.map((i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <FiCheck className="mt-0.5 shrink-0 text-secondary" /> {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground">Not included</h3>
                  <ul className="mt-4 space-y-3">
                    {pkg.exclusions.map((i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <FiX className="mt-0.5 shrink-0 text-destructive" /> {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {tab === "Gallery" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {pkg.gallery.map((src, i) => (
                  <img
                    key={`${src}-${i}`}
                    src={src}
                    alt={`${pkg.title} photo ${i + 1}`}
                    loading="lazy"
                    className="h-56 w-full rounded-2xl object-cover shadow-card"
                  />
                ))}
              </div>
            ) : null}
          </motion.div>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Starting from</p>
          <p className="font-display text-3xl font-bold text-foreground">
            {inr(pkg.price)}
            {pkg.oldPrice ? (
              <span className="ml-2 text-base font-normal text-muted-foreground line-through">
                {inr(pkg.oldPrice)}
              </span>
            ) : null}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">per person, taxes extra</p>

          <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
            <Row label="Duration" value={pkg.duration} />
            <Row label="Group size" value={pkg.groupSize} />
            <Row label="Best season" value={pkg.bestSeason} />
          </div>

          <div className="mt-6 space-y-3">
            <Link to="/booking/$packageId" params={{ packageId: pkg._id }} className="block">
              <Button className="w-full">Book this trip</Button>
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.success(`${pkg.title} saved to your wishlist`)}
            >
              Save to wishlist
            </Button>
          </div>
        </aside>
      </section>

      <section className="border-t border-border bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-2xl font-bold text-foreground">You may also like</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PackageCard key={p._id} pkg={p} />
            ))}
          </div>
        </div>
      </section>
    </UserLayout>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="flex items-center gap-2 text-xs tracking-wide text-muted-foreground uppercase">
        {icon} {label}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
