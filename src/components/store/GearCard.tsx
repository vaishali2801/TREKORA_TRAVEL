import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import type { GearProduct } from "@/data/gear";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Product card for the gear store grid. */
export default function GearCard({ product, mode }: { product: GearProduct; mode: "buy" | "rent" }) {
  const { addItem } = useCart();
  const rentable = typeof product.rentPerDay === "number";
  const effectiveMode: "buy" | "rent" = mode === "rent" && rentable ? "rent" : "buy";
  const price = effectiveMode === "rent" ? product.rentPerDay! : product.price;

  const add = () => {
    addItem({
      id: product._id,
      name: product.name,
      image: product.image,
      price,
      mode: effectiveMode,
    });
    toast.success(`${product.name} added to cart`, {
      description: effectiveMode === "rent" ? "Rental — billed per day" : "Purchase",
    });
  };

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-card">
      <Link
        to="/store/$productId"
        params={{ productId: product._id }}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.tag ? (
          <span className="absolute top-4 left-4 rounded-full bg-gradient-sunset px-3 py-1 text-[11px] font-semibold tracking-wider text-accent-foreground uppercase">
            {product.tag}
          </span>
        ) : null}
        <span className="glass-dark absolute top-4 right-4 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground">
          <FiStar className="text-accent" /> {product.rating}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium tracking-wide text-secondary uppercase">
          {product.category} · {product.brand}
        </p>
        <h3 className="mt-2 font-heading text-base leading-snug font-semibold text-foreground">
          <Link to="/store/$productId" params={{ productId: product._id }}>
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
              {effectiveMode === "rent" ? "Rent per day" : "Buy"}
            </p>
            <p className="font-display text-xl font-bold text-foreground">
              {inr(price)}
              {effectiveMode === "buy" && product.oldPrice ? (
                <span className="ml-2 text-sm font-normal text-muted-foreground line-through">
                  {inr(product.oldPrice)}
                </span>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            onClick={add}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <FiShoppingCart /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
