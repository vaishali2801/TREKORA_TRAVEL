import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FiClock, FiHeart, FiMapPin, FiStar, FiTrendingUp } from "react-icons/fi";
import type { PackageLike } from "@/data/home";
import { Button } from "@/components/common/Button";
import { useWishlist } from "@/context/WishlistContext";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Reusable tour package card used on the home page and listings. */
export default function PackageCard({ pkg }: { pkg: PackageLike }) {
  const { has, toggle } = useWishlist();
  const saved = has(pkg._id);

  const onWishlist = () => {
    const nowSaved = toggle({
      id: pkg._id,
      kind: "package",
      name: pkg.title,
      image: pkg.image,
      price: pkg.price,
      meta: pkg.destination,
    });
    toast.success(nowSaved ? "Saved to wishlist" : "Removed from wishlist");
  };

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pkg.image}
          alt={`${pkg.title} in ${pkg.destination}`}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {pkg.tag ? (
          <span className="absolute top-4 left-4 rounded-full bg-gradient-sunset px-3 py-1 text-[11px] font-semibold tracking-wider text-accent-foreground uppercase">
            {pkg.tag}
          </span>
        ) : null}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onWishlist}
            aria-label={saved ? `Remove ${pkg.title} from wishlist` : `Save ${pkg.title} to wishlist`}
            aria-pressed={saved}
            className="glass-dark rounded-full p-2 text-primary-foreground transition hover:scale-110"
          >
            <FiHeart className={saved ? "fill-current text-accent" : ""} size={14} />
          </button>
          <span className="glass-dark flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground">
            <FiStar className="text-accent" /> {pkg.rating}
          </span>
        </div>
      </div>


      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-secondary uppercase">
          <FiMapPin /> {pkg.destination}
        </p>
        <h3 className="mt-2 font-heading text-lg leading-snug font-semibold text-foreground">
          {pkg.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <FiClock /> {pkg.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <FiTrendingUp /> {pkg.difficulty}
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Starting at</p>
            <p className="font-display text-2xl font-bold text-foreground">
              {inr(pkg.price)}
              {pkg.oldPrice ? (
                <span className="ml-2 text-sm font-normal text-muted-foreground line-through">
                  {inr(pkg.oldPrice)}
                </span>
              ) : null}
            </p>
          </div>
          <Link to="/packages/$packageId" params={{ packageId: pkg._id }}>
            <Button size="sm">Details</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
