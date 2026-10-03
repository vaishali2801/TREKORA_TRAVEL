import { createFileRoute } from "@tanstack/react-router";
import { FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import { Button } from "@/components/common/Button";
import { TextField } from "@/components/common/TextField";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TrekVista Tours & Treks" },
      {
        name: "description",
        content: "Get in touch with TrekVista for package recommendations, custom trips and booking support.",
      },
      { property: "og:title", content: "Contact — TrekVista Tours & Treks" },
      {
        property: "og:description",
        content: "Reach our travel experts for personalized itineraries, bookings and support.",
      },
    ],
  }),
  component: ContactPage,
});

const CONTACT_CARDS = [
  {
    icon: FiPhone,
    title: "Call us",
    detail: "+91 98250 12345",
    note: "Mon-Sat, 9:00 AM to 7:00 PM",
  },
  {
    icon: FiMail,
    title: "Email",
    detail: "hello@trekvista.com",
    note: "We'll respond within 24 hours",
  },
  {
    icon: FiMapPin,
    title: "Visit office",
    detail: "Bhavnagar, Gujarat, India",
    note: "By appointment only",
  },
  {
    icon: FiClock,
    title: "Support hours",
    detail: "Daily 8:00 AM to 9:00 PM",
    note: "Emergency trek line available",
  },
];

function ContactPage() {
  return (
    <UserLayout>
      <section className="bg-gradient-forest py-20 text-secondary-foreground">
        <div className="container-tp text-center">
          <span className="glass-dark inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.24em] uppercase">
            Contact Us
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Let&apos;s plan your next adventure</h1>
          <p className="mx-auto mt-4 max-w-2xl opacity-90">
            Share your travel goals and dates, and our experts will suggest the best trek or tour for
            your group.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-tp grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="grid gap-4">
            {CONTACT_CARDS.map(({ icon: Icon, title, detail, note }) => (
              <article key={title} className="rounded-3xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
                    <p className="mt-1 text-sm font-medium text-foreground/90">{detail}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <article className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
            <h2 className="font-display text-2xl font-bold text-foreground">Send us a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us what kind of trip you&apos;re looking for and we&apos;ll recommend options.
            </p>

            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <TextField label="Full name" placeholder="Aarav Sharma" required />
              <TextField label="Email" type="email" placeholder="you@example.com" required />
              <TextField label="Phone" type="tel" placeholder="+91 98765 43210" />
              <TextField label="Preferred destination" placeholder="Kedarkantha / Spiti / Kashmir..." />

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
                  Your message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Share your expected travel month, group size and budget range."
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none"
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                Submit inquiry
              </Button>
            </form>
          </article>
        </div>
      </section>
    </UserLayout>
  );
}
