import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type WishlistItem = {
  id: string;
  kind: "package" | "gear";
  name: string;
  image?: string;
  price: number;
  meta?: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  count: number;
  has: (id: string) => boolean;
  toggle: (item: WishlistItem) => boolean;
  remove: (id: string) => void;
  clear: () => void;
};

const WISHLIST_KEY = "tpms_wishlist";
const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) setItems(JSON.parse(stored) as WishlistItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  /** Adds or removes the item. Returns true when it ends up saved. */
  const toggle = useCallback((item: WishlistItem) => {
    let saved = false;
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      saved = !exists;
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
    return !items.some((i) => i.id === item.id);
  }, [items]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({ items, count: items.length, has, toggle, remove, clear }),
    [items, has, toggle, remove, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
