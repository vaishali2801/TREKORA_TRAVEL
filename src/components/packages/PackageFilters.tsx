import { FiSearch, FiX } from "react-icons/fi";
import { DESTINATION_OPTIONS, DIFFICULTY_OPTIONS, MAX_PRICE } from "@/data/packages";

export type Filters = {
  q: string;
  destination: string;
  difficulty: string;
  maxPrice: number;
  sort: string;
};

export const DEFAULT_FILTERS: Filters = {
  q: "",
  destination: "all",
  difficulty: "all",
  maxPrice: MAX_PRICE,
  sort: "popular",
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Sidebar filter panel for the packages listing. */
export default function PackageFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
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
          <label htmlFor="q" className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Search
          </label>
          <div className="relative">
            <FiSearch className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="q"
              value={filters.q}
              onChange={(e) => onChange({ q: e.target.value })}
              placeholder="Trek, city, keyword…"
              className={`${field} pl-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="destination" className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Destination
          </label>
          <select
            id="destination"
            value={filters.destination}
            onChange={(e) => onChange({ destination: e.target.value })}
            className={field}
          >
            <option value="all">All destinations</option>
            {DESTINATION_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {["all", ...DIFFICULTY_OPTIONS].map((level) => {
              const active = filters.difficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onChange({ difficulty: level })}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {level === "all" ? "Any" : level}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="price" className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Max price <span className="text-primary">{inr(filters.maxPrice)}</span>
          </label>
          <input
            id="price"
            type="range"
            min={10000}
            max={MAX_PRICE}
            step={1000}
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            className="w-full accent-[hsl(var(--primary))]"
          />
        </div>

        <div>
          <label htmlFor="sort" className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Sort by
          </label>
          <select id="sort" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })} className={field}>
            <option value="popular">Most popular</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
            <option value="duration">Shortest duration</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
