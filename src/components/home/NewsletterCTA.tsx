import { useState } from "react";
import { toast } from "sonner";
import { FiSend } from "react-icons/fi";
import { Reveal, fadeUp } from "@/utils/motion";
import { Button } from "@/components/common/Button";

/** Closing call-to-action with newsletter signup. */
export default function NewsletterCTA() {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're subscribed! Trail stories land every Friday.");
    setEmail("");
  };

  return (
    <section className="container-tp pb-24">
      <Reveal variants={fadeUp}>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-ocean px-6 py-16 text-center sm:px-12">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary-foreground/10" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-primary-foreground/10" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              Get trail-ready inspiration
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/85">
              Early access to new departures, gear deals and route guides — one email a week.
            </p>

            <form
              onSubmit={submit}
              className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 flex-1 rounded-full border border-primary-foreground/25 bg-primary-foreground/15 px-5 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
              />
              <Button type="submit" variant="accent" size="md">
                Subscribe <FiSend />
              </Button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
