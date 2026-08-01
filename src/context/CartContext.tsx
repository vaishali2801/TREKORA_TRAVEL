import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  image?: string;
  price: number;
  mode: "buy" | "rent";
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, mode: CartItem["mode"]) => void;
  updateQuantity: (id: string, mode: CartItem["mode"], quantity: number) => void;
  clearCart: () => void;
};

const CART_KEY = "tpms_cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.mode === item.mode);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.mode === item.mode ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback((id: string, mode: CartItem["mode"]) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.mode === mode)));
  }, []);

  const updateQuantity = useCallback((id: string, mode: CartItem["mode"], quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.id === id && i.mode === mode))
        : prev.map((i) => (i.id === id && i.mode === mode ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return { items, count, subtotal, addItem, removeItem, updateQuantity, clearCart };
  }, [items, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
