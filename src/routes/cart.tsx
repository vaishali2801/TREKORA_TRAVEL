import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiTruck } from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/common/Button";
import { Reveal } from "@/utils/motion";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — TrekVista Gear & Rentals" },
      {
        name: "description",
        content:
          "Review the trekking gear you're buying or renting, adjust quantities and check out with TrekVista.",
      },
      { property: "og:title", content: "Your Cart — TrekVista Gear & Rentals" },
      {
        property: "og:description",
        content: "Review your gear, adjust quantities and check out with TrekVista.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Page() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = subtotal > 0 && subtotal < 5000 ? 199 : 0;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = Math.max(0, subtotal - discount) + shipping + tax;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "TREK10") {
      setDiscount(Math.round(subtotal * 0.1));
      toast.success("Coupon applied", { description: "10% off your order" });
    } else {
      setDiscount(0);
      toast.error("Invalid coupon code");
    }
  };

  return (
    <UserLayout>
      <section className="bg-gradient-ocean py-16 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Your cart</h1>
          <p className="mt-3 max-w-xl text-primary-foreground/80">
            Gear you're buying or renting for the next expedition.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        {items.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center shadow-card">
            <FiShoppingBag className="mx-auto text-4xl text-muted-foreground" />
            <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse the gear store and add what you need for your trek.
            </p>
            <Link to="/store" className="mt-6 inline-block">
              <Button>Shop gear</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <Reveal key={`${item.id}-${item.mode}`}>
                  <article className="flex gap-4 rounded-3xl bg-card p-4 shadow-card">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-heading text-sm font-semibold text-foreground">
                            {item.name}
                          </h2>
                          <p className="mt-1 text-xs tracking-wide text-secondary uppercase">
                            {item.mode === "rent" ? "Rental · per day" : "Purchase"}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => {
                            removeItem(item.id, item.mode);
                            toast.success("Removed from cart");
                          }}
                          className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-destructive"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                        <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.id, item.mode, item.quantity - 1)}
                            className="rounded-full p-1.5 text-foreground transition hover:bg-muted"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.id, item.mode, item.quantity + 1)}
                            className="rounded-full p-1.5 text-foreground transition hover:bg-muted"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <p className="font-display text-lg font-bold text-foreground">
                          {inr(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}

              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setDiscount(0);
                  toast.success("Cart cleared");
                }}
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
              >
                Clear cart
              </button>
            </div>

            <aside className="h-fit rounded-3xl bg-card p-6 shadow-card lg:sticky lg:top-24">
              <h2 className="font-heading text-lg font-semibold text-foreground">Order summary</h2>

              <div className="mt-4 flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code (TREK10)"
                  aria-label="Coupon code"
                  className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="rounded-full bg-muted px-4 py-2.5 text-sm font-semibold text-foreground transition hover:opacity-90"
                >
                  Apply
                </button>
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium text-foreground">{inr(subtotal)}</dd>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Discount</dt>
                    <dd className="font-medium text-secondary">-{inr(discount)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <FiTruck /> Shipping
                  </dt>
                  <dd className="font-medium text-foreground">
                    {shipping === 0 ? "Free" : inr(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">GST (5%)</dt>
                  <dd className="font-medium text-foreground">{inr(tax)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <dt className="font-heading font-semibold text-foreground">Total</dt>
                  <dd className="font-display text-xl font-bold text-foreground">{inr(total)}</dd>
                </div>
              </dl>

              <Button
                className="mt-6 w-full"
                onClick={() => toast.success("Checkout started", { description: "Demo checkout — payment gateway pending." })}
              >
                Proceed to checkout
              </Button>
              <Link
                to="/store"
                className="mt-3 block text-center text-sm font-medium text-primary hover:underline"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </UserLayout>
  );
}
