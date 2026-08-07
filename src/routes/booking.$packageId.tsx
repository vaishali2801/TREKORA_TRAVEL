import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiCreditCard,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSmartphone,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { toast } from "sonner";
import UserLayout from "@/layouts/UserLayout";
import { Button } from "@/components/common/Button";
import { TextField } from "@/components/common/TextField";
import { ALL_PACKAGES, type PackageDetail } from "@/data/packages";
import { useAuth } from "@/context/AuthContext";
import {
  ADD_ONS,
  makeReference,
  priceBreakdown,
  saveBooking,
  type BookingTraveller,
} from "@/lib/bookings";
import { bookingService } from "@/services/api";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const Route = createFileRoute("/booking/$packageId")({
  loader: ({ params }): { pkg: PackageDetail } => {
    const pkg = ALL_PACKAGES.find((p) => p._id === params.packageId);
    if (!pkg) throw notFound();
    return { pkg };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Booking unavailable — TrekVista" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { pkg } = loaderData;
    const title = `Book ${pkg.title} — TrekVista`;
    const description = `Reserve your spot on the ${pkg.duration} ${pkg.title} in ${pkg.destination}. Pick dates, travellers and add-ons in minutes.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  notFoundComponent: BookingNotFound,
  component: BookingPage,
});

function BookingNotFound() {
  return (
    <UserLayout>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Trip not available</h1>
        <p className="mt-3 text-muted-foreground">Pick another departure to continue booking.</p>
        <Link to="/packages" className="mt-8 inline-block">
          <Button>Browse packages</Button>
        </Link>
      </div>
    </UserLayout>
  );
}

const STEPS = ["Trip details", "Travellers", "Payment", "Confirmed"] as const;

function BookingPage() {
  const { pkg } = Route.useLoaderData() as { pkg: PackageDetail };
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [travellers, setTravellers] = useState(2);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [people, setPeople] = useState<BookingTraveller[]>([{ name: "", age: "" }, { name: "", age: "" }]);
  const [contact, setContact] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    notes: "",
  });
  const [payment, setPayment] = useState<"card" | "upi" | "cash">("card");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");

  const bill = useMemo(
    () => priceBreakdown(pkg.price, travellers, addOns),
    [pkg.price, travellers, addOns],
  );

  const setCount = (n: number) => {
    const next = Math.min(12, Math.max(1, n));
    setTravellers(next);
    setPeople((prev) => {
      const copy = [...prev];
      while (copy.length < next) copy.push({ name: "", age: "" });
      return copy.slice(0, next);
    });
  };

  const toggleAddOn = (id: string) =>
    setAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!startDate) e["startDate"] = "Choose a departure date";
      else if (new Date(startDate) < new Date(new Date().toDateString()))
        e["startDate"] = "Date must be in the future";
    }
    if (step === 1) {
      people.forEach((p, i) => {
        if (!p.name.trim()) e[`name-${i}`] = "Required";
        if (!p.age.trim() || Number(p.age) < 1 || Number(p.age) > 99) e[`age-${i}`] = "Enter a valid age";
      });
      if (!contact.name.trim()) e["cname"] = "Required";
      if (!/^\S+@\S+\.\S+$/.test(contact.email)) e["cemail"] = "Enter a valid email";
      if (!/^[0-9+\-\s]{8,15}$/.test(contact.phone)) e["cphone"] = "Enter a valid phone number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirm = async () => {
    setSubmitting(true);
    const ref = makeReference();
    const booking = {
      id: `${Date.now()}`,
      reference: ref,
      packageId: pkg._id,
      packageTitle: pkg.title,
      packageImage: pkg.image,
      destination: pkg.destination,
      startDate,
      travellers,
      travellerDetails: people,
      contact,
      addOns,
      total: bill.total,
      paymentMethod: payment,
      status: "confirmed" as const,
      createdAt: new Date().toISOString(),
    };
    try {
      await bookingService.create(booking);
    } catch {
      /* API offline — booking still stored locally for the demo */
    }
    saveBooking(booking);
    setReference(ref);
    setSubmitting(false);
    setStep(3);
    toast.success(`Booking ${ref} confirmed!`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <UserLayout>
      <section className="border-b border-border bg-muted/40 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            to="/packages/$packageId"
            params={{ packageId: pkg._id }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <FiArrowLeft /> Back to trip
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
            Book {pkg.title}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FiMapPin /> {pkg.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <FiCalendar /> {pkg.duration}
            </span>
          </p>

          <ol className="mt-8 flex flex-wrap items-center gap-3">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                    i <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <FiCheck /> : i + 1}
                </span>
                <span
                  className={`text-sm font-medium ${i <= step ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 ? <span className="h-px w-6 bg-border sm:w-10" /> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1fr_340px]">
        <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          {step === 0 ? (
            <div className="space-y-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="mb-1.5 block text-sm font-medium text-foreground">
                    Departure date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none"
                  />
                  {errors["startDate"] ? (
                    <p className="mt-1.5 text-xs text-destructive">{errors["startDate"]}</p>
                  ) : null}
                </div>
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Travellers</span>
                  <div className="flex h-12 items-center justify-between rounded-2xl border border-border bg-card px-3">
                    <button
                      type="button"
                      aria-label="Remove traveller"
                      onClick={() => setCount(travellers - 1)}
                      className="h-8 w-8 rounded-full bg-muted text-foreground transition hover:bg-primary hover:text-primary-foreground"
                    >
                      −
                    </button>
                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <FiUsers /> {travellers}
                    </span>
                    <button
                      type="button"
                      aria-label="Add traveller"
                      onClick={() => setCount(travellers + 1)}
                      className="h-8 w-8 rounded-full bg-muted text-foreground transition hover:bg-primary hover:text-primary-foreground"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">Add-ons</h2>
                <p className="text-sm text-muted-foreground">Priced per traveller. Optional.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {ADD_ONS.map((a) => {
                    const active = addOns.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAddOn(a.id)}
                        aria-pressed={active}
                        className={`rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-foreground">{a.label}</span>
                          <span className="text-sm font-semibold text-primary">{inr(a.price)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{a.note}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">Traveller details</h2>
                <div className="mt-4 space-y-4">
                  {people.map((p, i) => (
                    <div key={i} className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_140px]">
                      <TextField
                        label={`Traveller ${i + 1} full name`}
                        icon={<FiUser size={16} />}
                        value={p.name}
                        error={errors[`name-${i}`]}
                        onChange={(e) =>
                          setPeople((prev) =>
                            prev.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
                          )
                        }
                        placeholder="As on ID proof"
                      />
                      <TextField
                        label="Age"
                        type="number"
                        value={p.age}
                        error={errors[`age-${i}`]}
                        onChange={(e) =>
                          setPeople((prev) =>
                            prev.map((x, j) => (j === i ? { ...x, age: e.target.value } : x)),
                          )
                        }
                        placeholder="28"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">Contact details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Contact name"
                    icon={<FiUser size={16} />}
                    value={contact.name}
                    error={errors["cname"]}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    icon={<FiMail size={16} />}
                    value={contact.email}
                    error={errors["cemail"]}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  />
                  <TextField
                    label="Phone"
                    icon={<FiPhone size={16} />}
                    value={contact.phone}
                    error={errors["cphone"]}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                  <div>
                    <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-foreground">
                      Special requests
                    </label>
                    <input
                      id="notes"
                      value={contact.notes}
                      onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                      placeholder="Dietary needs, room sharing…"
                      className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">Payment method</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { id: "card" as const, label: "Card", icon: <FiCreditCard />, note: "Visa, Mastercard, Rupay" },
                    { id: "upi" as const, label: "UPI", icon: <FiSmartphone />, note: "GPay, PhonePe, Paytm" },
                    { id: "cash" as const, label: "Pay at office", icon: <FiMapPin />, note: "Within 48 hours" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayment(m.id)}
                      aria-pressed={payment === m.id}
                      className={`rounded-2xl border p-4 text-left transition ${
                        payment === m.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        {m.icon} {m.label}
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">{m.note}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Demo checkout — no real payment is processed.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-heading text-base font-semibold text-foreground">Review</h3>
                <dl className="mt-4 space-y-2 text-sm">
                  <SummaryRow label="Trip" value={pkg.title} />
                  <SummaryRow label="Departure" value={startDate} />
                  <SummaryRow label="Travellers" value={String(travellers)} />
                  <SummaryRow label="Lead traveller" value={contact.name} />
                  <SummaryRow label="Contact" value={`${contact.email} · ${contact.phone}`} />
                  {addOns.length ? (
                    <SummaryRow
                      label="Add-ons"
                      value={ADD_ONS.filter((a) => addOns.includes(a.id)).map((a) => a.label).join(", ")}
                    />
                  ) : null}
                </dl>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-3xl text-secondary">
                <FiCheck />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-foreground">Booking confirmed</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A confirmation email is on its way to {contact.email}.
              </p>
              <p className="mt-6 inline-block rounded-full bg-muted px-5 py-2 font-mono text-sm font-semibold text-foreground">
                {reference}
              </p>
              <dl className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm">
                <SummaryRow label="Trip" value={pkg.title} />
                <SummaryRow label="Departure" value={startDate} />
                <SummaryRow label="Travellers" value={String(travellers)} />
                <SummaryRow label="Amount paid" value={inr(bill.total)} />
              </dl>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button onClick={() => navigate({ to: "/profile" })}>View my bookings</Button>
                <Button variant="outline" onClick={() => navigate({ to: "/packages" })}>
                  Explore more trips
                </Button>
              </div>
            </div>
          ) : null}

          {step < 3 ? (
            <div className="mt-10 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <FiArrowLeft /> Back
              </Button>
              {step === 2 ? (
                <Button onClick={confirm} disabled={submitting}>
                  {submitting ? "Confirming…" : `Pay ${inr(bill.total)}`}
                </Button>
              ) : (
                <Button onClick={next}>
                  Continue <FiArrowRight />
                </Button>
              )}
            </div>
          ) : null}
        </motion.div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <img src={pkg.image} alt={pkg.title} className="h-32 w-full rounded-2xl object-cover" />
          <h2 className="mt-4 font-heading text-base font-semibold text-foreground">{pkg.title}</h2>
          <p className="text-xs text-muted-foreground">{pkg.duration}</p>

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <SummaryRow label={`${inr(pkg.price)} × ${travellers}`} value={inr(bill.subtotal)} />
            {bill.addOnTotal ? <SummaryRow label="Add-ons" value={inr(bill.addOnTotal)} /> : null}
            <SummaryRow label="Taxes & fees (5%)" value={inr(bill.taxes)} />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-foreground">Total</span>
            <span className="font-display text-xl font-bold text-foreground">{inr(bill.total)}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Free cancellation up to 15 days before departure.
          </p>
        </aside>
      </section>
    </UserLayout>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
