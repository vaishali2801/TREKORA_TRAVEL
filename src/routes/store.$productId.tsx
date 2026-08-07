import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  FiArrowLeft,
  FiCheck,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingCart,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import GearCard from "@/components/store/GearCard";
import { GEAR_PRODUCTS, getGearById, type GearProduct } from "@/data/gear";
import { useCart } from "@/context/CartContext";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const Route = createFileRoute("/store/$productId")({
  loader: ({ params }): { product: GearProduct } => {
    const product = getGearById(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Gear unavailable — TrekVista" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — Buy or Rent | TrekVista Store` },
        { name: "description", content: product.shortDescription },
        { property: "og:title", content: `${product.name} — TrekVista Gear Store` },
        { property: "og:description", content: product.shortDescription },
        { property: "og:type", content: "product" },
        { property: "og:image", content: product.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: product.image },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: GearProduct };
  const { addItem } = useCart();
  const rentable = typeof product.rentPerDay === "number";
  const [mode, setMode] = useState<"buy" | "rent">("buy");
  const [qty, setQty] = useState(1);
  const [days, setDays] = useState(3);
  const [active, setActive] = useState(product.gallery[0] ?? product.image);

  const unit = mode === "rent" ? product.rentPerDay! * days : product.price;
  const total = unit * qty;

  const related = GEAR_PRODUCTS.filter(
    (p) => p._id !== product._id && p.category === product.category,
  )
    .concat(GEAR_PRODUCTS.filter((p) => p._id !== product._id && p.category !== product.category))
    .slice(0, 3);

  const add = () => {
    addItem(
      {
        id: mode === "rent" ? `${product._id}-${days}d` : product._id,
        name: mode === "rent" ? `${product.name} (${days}-day rental)` : product.name,
        image: product.image,
        price: unit,
        mode,
      },
      qty,
    );
    toast.success("Added to cart", { description: `${product.name} · ${inr(total)}` });
  };

  return (
    <UserLayout>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            <FiArrowLeft /> Back to store
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-3xl bg-muted shadow-card">
                <img src={active} alt={product.name} className="aspect-[4/3] w-full object-cover" />
              </div>
              {product.gallery.length > 1 ? (
                <div className="mt-4 flex gap-3">
                  {product.gallery.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setActive(g)}
                      className={`h-20 w-24 overflow-hidden rounded-2xl border-2 transition ${
                        active === g ? "border-primary" : "border-transparent opacity-70"
                      }`}
                    >
                      <img src={g} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wide text-secondary uppercase">
                {product.category} · {product.brand}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
                {product.name}
              </h1>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <FiStar className="text-accent" /> {product.rating}
                </span>
                <span>{product.reviews} reviews</span>
                <span>{product.stock} in stock</span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              <div className="mt-6 inline-flex rounded-full bg-muted p-1">
                {(["buy", "rent"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    disabled={m === "rent" && !rentable}
                    onClick={() => setMode(m)}
                    className={`rounded-full px-6 py-2 text-sm font-semibold capitalize transition disabled:opacity-40 ${
                      mode === m ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-card">
                {mode === "rent" ? (
                  <div className="mb-5">
                    <label
                      htmlFor="days"
                      className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                    >
                      Rental days <span className="text-primary">{days} days</span>
                    </label>
                    <input
                      id="days"
                      type="range"
                      min={1}
                      max={21}
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {inr(product.rentPerDay!)} per day · refundable deposit collected at pickup
                    </p>
                  </div>
                ) : null}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Quantity</span>
                  <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="rounded-full p-2 text-muted-foreground transition hover:text-primary"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-6 text-center font-semibold text-foreground">{qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="rounded-full p-2 text-muted-foreground transition hover:text-primary"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between border-t border-border pt-5">
                  <div>
                    <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                      {mode === "rent" ? `Total for ${days} days` : "Total"}
                    </p>
                    <p className="font-display text-3xl font-bold text-foreground">{inr(total)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={add}
                    className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    <FiShoppingCart /> Add to cart
                  </button>
                </div>

                <div className="mt-5 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
                  <span className="flex items-center gap-2">
                    <FiTruck className="text-secondary" /> Free delivery to trek basecamp
                  </span>
                  <span className="flex items-center gap-2">
                    <FiShield className="text-secondary" /> Damage waiver available
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-lg font-semibold text-foreground">Key features</h2>
              <ul className="mt-4 space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <FiCheck className="mt-0.5 shrink-0 text-secondary" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-lg font-semibold text-foreground">Specifications</h2>
              <dl className="mt-4 divide-y divide-border">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between py-3 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-medium text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-foreground">You may also need</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <GearCard key={p._id} product={p} mode="buy" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  );
}
