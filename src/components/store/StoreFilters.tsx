import { FiSearch, FiX } from "react-icons/fi";
import { GEAR_CATEGORIES, MAX_GEAR_PRICE } from "@/data/gear";

export type GearFilters = {
  q: string;
  category: string;
  maxPrice: number;
  sort: string;
  mode: "buy" | "rent";
};

export const DEFAULT_GEAR_FILTERS: GearFilters = {
  q: "",
  category: "all",
  maxPrice: MAX_GEAR_PRICE,
  sort: "popular",
  mode: "buy",
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Sidebar filters for the gear store. */
export default function StoreFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: GearFilters;
  onChange: (patch: Partial<GearFilters>) => void;
  onReset: () => void;
}) {
  const field =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

  return (
    <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-primary"
        >
          <FiX /> Reset
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="gear-q"
            className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Search
          </label>
          <div className="relative">
            <FiSearch className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="gear-q"
              value={filters.q}
              onChange={(e) => onChange({ q: e.target.value })}
              placeholder="Tent, boots, backpack…"
              className={`${field} pl-10`}
            />
          </div>
        </div>

        <div>
          <span className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Category
          </span>
          <div className="flex flex-wrap gap-2">
            {GEAR_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ category: c })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                  filters.category === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {c === "all" ? "All gear" : c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="gear-price"
            className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Max price <span className="text-primary">{inr(filters.maxPrice)}</span>
          </label>
          <input
            id="gear-price"
            type="range"
            min={500}
            max={MAX_GEAR_PRICE}
            step={500}
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label
            htmlFor="gear-sort"
            className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Sort by
          </label>
          <select
            id="gear-sort"
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value })}
            className={field}
          >
            <option value="popular">Most popular</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
