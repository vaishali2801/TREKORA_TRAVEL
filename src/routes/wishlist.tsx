import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import UserLayout from "@/layouts/UserLayout";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/common/Button";
import { Reveal } from "@/utils/motion";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Saved Treks & Gear | TrekVista" },
      {
        name: "description",
        content:
          "All the tour packages and trekking gear you've saved for later, ready to book or add to your cart.",
      },
      { property: "og:title", content: "Wishlist — Saved Treks & Gear | TrekVista" },
      {
        property: "og:description",
        content: "Tour packages and gear you've saved for later on TrekVista.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Page() {
  const { items, remove, clear } = useWishlist();
  const { addItem } = useCart();

  return (
    <UserLayout>
      <section className="bg-gradient-sunset py-16 text-accent-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Your wishlist</h1>
          <p className="mt-3 max-w-xl opacity-90">
            {items.length > 0
              ? `${items.length} saved ${items.length === 1 ? "item" : "items"} waiting for the right season.`
              : "Save treks and gear you love and find them here."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        {items.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center shadow-card">
            <FiHeart className="mx-auto text-4xl text-muted-foreground" />
            <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
              Nothing saved yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tap the heart on any package or product to keep it here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/packages">
                <Button>Browse packages</Button>
              </Link>
              <Link to="/store">
                <Button variant="outline">Browse gear</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Reveal key={item.id}>
                  <article className="card-lift flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-card">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <span className="glass-dark absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider text-primary-foreground uppercase">
                        {item.kind === "package" ? "Package" : "Gear"}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name} from wishlist`}
                        onClick={() => {
                          remove(item.id);
                          toast.success("Removed from wishlist");
                        }}
                        className="glass-dark absolute top-4 right-4 rounded-full p-2 text-primary-foreground transition hover:text-destructive"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-heading text-base leading-snug font-semibold text-foreground">
                        {item.name}
                      </h2>
                      {item.meta ? (
                        <p className="mt-1 text-xs tracking-wide text-secondary uppercase">
                          {item.meta}
                        </p>
                      ) : null}
                      <p className="mt-4 font-display text-xl font-bold text-foreground">
                        {inr(item.price)}
                      </p>

                      <div className="mt-auto pt-5">
                        {item.kind === "package" ? (
                          <Link to="/packages/$packageId" params={{ packageId: item.id }}>
                            <Button size="sm" className="w-full">
                              View trip
                            </Button>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              addItem({
                                id: item.id,
                                name: item.name,
                                image: item.image ?? "",
                                price: item.price,
                                mode: "buy",
                              });
                              toast.success(`${item.name} added to cart`);
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                          >
                            <FiShoppingCart /> Add to cart
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                clear();
                toast.success("Wishlist cleared");
              }}
              className="mt-8 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
            >
              Clear wishlist
            </button>
          </>
        )}
      </section>
    </UserLayout>
  );
}
