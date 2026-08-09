import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FiCalendar,
  FiCompass,
  FiCreditCard,
  FiLogOut,
  FiMapPin,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import { Button } from "@/components/common/Button";
import { TextField } from "@/components/common/TextField";
import { useAuth } from "@/context/AuthContext";
import { loadBookings, type StoredBooking } from "@/lib/bookings";
import { fadeUp, staggerContainer } from "@/utils/motion";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Dashboard — TrekVista Bookings & Account" },
      {
        name: "description",
        content:
          "Track your TrekVista trip bookings, upcoming departures, spend summary and account details in one dashboard.",
      },
      { property: "og:title", content: "My Dashboard — TrekVista Bookings & Account" },
      {
        property: "og:description",
        content: "Your TrekVista bookings, upcoming departures and account settings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const TABS = ["Overview", "Bookings", "Settings"] as const;
type Tab = (typeof TABS)[number];

function DashboardPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Overview");
  const [bookings, setBookings] = useState<StoredBooking[]>([]);

  useEffect(() => {
    setBookings(loadBookings());
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/login" });
  }, [loading, isAuthenticated, navigate]);

  const stats = useMemo(() => {
    const spend = bookings.reduce((s, b) => s + b.total, 0);
    const travellers = bookings.reduce((s, b) => s + b.travellers, 0);
    const upcoming = bookings.filter((b) => new Date(b.startDate) >= new Date()).length;
    return { trips: bookings.length, spend, travellers, upcoming };
  }, [bookings]);

  if (loading || !isAuthenticated) {
    return (
      <UserLayout>
        <div className="container-tp py-32 text-center text-muted-foreground">
          Loading your dashboard…
        </div>
      </UserLayout>
    );
  }

  const initials = (user?.name ?? "Traveller")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <UserLayout>
      <section className="bg-gradient-ocean py-16 text-primary-foreground">
        <div className="container-tp flex flex-wrap items-center gap-6">
          <div className="glass-dark flex h-20 w-20 items-center justify-center rounded-3xl font-display text-2xl font-bold">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase opacity-80">
              My dashboard
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
              {user?.name ?? "Traveller"}
            </h1>
            <p className="mt-1 text-sm opacity-90">{user?.email}</p>
          </div>
          <Button
            variant="glass"
            onClick={() => {
              logout();
              toast.success("Signed out");
              navigate({ to: "/" });
            }}
          >
            <FiLogOut /> Sign out
          </Button>
        </div>
      </section>

      <section className="py-14">
        <div className="container-tp">
          <div className="flex flex-wrap gap-3">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  tab === t
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Overview" ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[
                { icon: FiCompass, label: "Trips booked", value: String(stats.trips) },
                { icon: FiCalendar, label: "Upcoming departures", value: String(stats.upcoming) },
                { icon: FiUsers, label: "Travellers", value: String(stats.travellers) },
                { icon: FiCreditCard, label: "Total spend", value: inr(stats.spend) },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className="rounded-3xl bg-card p-6 shadow-card"
                >
                  <s.icon className="text-2xl text-secondary" />
                  <p className="mt-4 font-display text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : null}

          {tab === "Bookings" ? (
            <div className="mt-10 space-y-5">
              {bookings.length === 0 ? (
                <EmptyState />
              ) : (
                bookings.map((b) => (
                  <article
                    key={b.id}
                    className="flex flex-wrap items-center gap-5 rounded-3xl bg-card p-5 shadow-card"
                  >
                    {b.packageImage ? (
                      <img
                        src={b.packageImage}
                        alt={b.packageTitle}
                        loading="lazy"
                        className="h-24 w-32 rounded-2xl object-cover"
                      />
                    ) : null}
                    <div className="min-w-[200px] flex-1">
                      <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-secondary uppercase">
                        <FiMapPin /> {b.destination}
                      </p>
                      <h2 className="mt-1 font-heading text-lg font-semibold text-foreground">
                        {b.packageTitle}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(b.startDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        · {b.travellers} traveller{b.travellers > 1 ? "s" : ""} · Ref {b.reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary capitalize">
                        {b.status}
                      </span>
                      <p className="mt-2 font-display text-xl font-bold text-foreground">
                        {inr(b.total)}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
          ) : null}

          {tab === "Settings" ? <SettingsForm name={user?.name} email={user?.email} /> : null}
        </div>
      </section>
    </UserLayout>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl bg-card p-12 text-center shadow-card">
      <FiCompass className="mx-auto text-4xl text-muted-foreground" />
      <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">No bookings yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick a trip and your itinerary will show up right here.
      </p>
      <Link to="/packages" className="mt-6 inline-block">
        <Button>Browse packages</Button>
      </Link>
    </div>
  );
}

function SettingsForm({ name, email }: { name?: string | undefined; email?: string | undefined }) {
  const [form, setForm] = useState({ name: name ?? "", email: email ?? "", phone: "", city: "" });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Profile details saved");
      }}
      className="mt-10 max-w-2xl space-y-5 rounded-3xl bg-card p-8 shadow-card"
    >
      <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
        <FiSettings /> Account details
      </h2>
      <TextField
        label="Full name"
        icon={<FiUser />}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <TextField
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <TextField
          label="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
