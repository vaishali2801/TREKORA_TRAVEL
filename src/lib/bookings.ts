/** Local booking store — mirrors what the REST API will return (Phase 5). */
export type BookingTraveller = { name: string; age: string };

export type StoredBooking = {
  id: string;
  reference: string;
  packageId: string;
  packageTitle: string;
  packageImage?: string;
  destination: string;
  startDate: string;
  travellers: number;
  travellerDetails: BookingTraveller[];
  contact: { name: string; email: string; phone: string; notes?: string };
  addOns: string[];
  total: number;
  paymentMethod: "card" | "upi" | "cash";
  status: "confirmed";
  createdAt: string;
};

const KEY = "tpms_bookings";

export const ADD_ONS = [
  { id: "insurance", label: "Travel insurance", price: 1499, note: "Medical + evacuation cover" },
  { id: "gear", label: "Gear rental bundle", price: 2499, note: "Jacket, sleeping bag, poles" },
  { id: "photography", label: "Pro photographer", price: 3999, note: "Edited album of your trip" },
  { id: "transfer", label: "Private airport transfer", price: 999, note: "Both ways, AC vehicle" },
] as const;

export function makeReference() {
  return `TV-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function loadBookings(): StoredBooking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as StoredBooking[];
  } catch {
    return [];
  }
}

export function saveBooking(booking: StoredBooking) {
  if (typeof window === "undefined") return;
  const all = [booking, ...loadBookings()];
  localStorage.setItem(KEY, JSON.stringify(all));
}

export const GST_RATE = 0.05;

export function priceBreakdown(base: number, travellers: number, addOnIds: string[]) {
  const subtotal = base * travellers;
  const addOnTotal = ADD_ONS.filter((a) => addOnIds.includes(a.id)).reduce(
    (s, a) => s + a.price * travellers,
    0,
  );
  const taxes = Math.round((subtotal + addOnTotal) * GST_RATE);
  return { subtotal, addOnTotal, taxes, total: subtotal + addOnTotal + taxes };
}
