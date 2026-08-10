/**
 * Central Axios instance + API service layer.
 * Every network call in the app goes through this file (no fetch calls in components).
 * Base URL comes from VITE_API_URL, falling back to the local Express backend.
 */
import axios, { type AxiosInstance } from "axios";

const BASE_URL =
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:5001/api/v1";

export const TOKEN_KEY = "tpms_token";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

/** Attach the JWT (if present) to every outgoing request. */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Normalise errors and auto-logout on an expired/invalid token. */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem("tpms_user");
    }
    const message =
      error?.response?.data?.message ?? error?.message ?? "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);

/* ------------------------------------------------------------------ */
/* Response unwrapping — backend wraps everything in { statusCode,     */
/* success, message, data }. These helpers return `data` directly.    */
/* ------------------------------------------------------------------ */
const unwrap = async <T>(promise: Promise<{ data: { data: T } }>): Promise<T> =>
  (await promise).data.data;

const FALLBACK_IMAGE = "/hero-mountains.jpg";

const DIFFICULTY_MAP: Record<string, "Easy" | "Moderate" | "Challenging"> = {
  Easy: "Easy",
  Moderate: "Moderate",
  Hard: "Challenging",
};

export type FrontendPackage = {
  _id: string;
  title: string;
  destination: string;
  duration: string;
  days: number;
  price: number;
  oldPrice?: number | undefined;
  rating: number;
  reviews: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  image: string;
  images: string[];
  tag?: string | undefined;
  category: string;
  description: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  bestSeason: string;
  isFeatured: boolean;
  overview: string;
  gallery: string[];
  itinerary: {
    day: number;
    title: string;
    description?: string | undefined;
    detail?: string | undefined;
  }[];
  inclusions: string[];
  exclusions: string[];
  groupSize: string;
};

type BackendPackage = {
  _id: string;
  title: string;
  location: string;
  duration: number;
  price: number;
  category: string;
  difficulty: string;
  bestSeason?: string;
  description?: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  images?: string[];
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  maxGroupSize?: number;
};

/** Map a backend package document to the shape the UI components expect. */
const mapPackage = (raw: Record<string, unknown>): FrontendPackage => {
  const p = raw as unknown as BackendPackage;
  const images = Array.isArray(p.images) ? p.images : [];
  const isFeatured = Boolean(p.isFeatured);
  const description = typeof p.description === "string" ? p.description : "";
  return {
    _id: p._id,
    title: p.title,
    destination: p.location,
    duration: `${p.duration ?? 0} Days`,
    days: p.duration ?? 0,
    price: p.price ?? 0,
    oldPrice: undefined,
    rating: p.rating ?? 0,
    reviews: p.reviewCount ?? 0,
    difficulty: DIFFICULTY_MAP[p.difficulty] ?? "Moderate",
    image: images[0] ?? FALLBACK_IMAGE,
    images,
    tag: isFeatured ? "Featured" : undefined,
    category: p.category ?? "",
    description,
    highlights: p.highlights ?? [],
    included: p.included ?? [],
    excluded: p.excluded ?? [],
    bestSeason: p.bestSeason ?? "",
    isFeatured,
    overview: description,
    gallery: images,
    itinerary: [],
    inclusions: p.included ?? [],
    exclusions: p.excluded ?? [],
    groupSize: p.maxGroupSize ? `${p.maxGroupSize} travellers` : "Small groups",
  };
};

type BackendEvent = {
  _id: string;
  title: string;
  description?: string;
  eventType?: string;
  date: string;
  location: string;
  availableSeats: number;
  price: number;
  banner?: string;
};

export type FrontendEvent = {
  _id: string;
  title: string;
  description: string;
  date: string;
  dateISO: string;
  time: string;
  location: string;
  category: string;
  seats: number;
  totalSeats: number;
  price: number;
  image: string;
  host: string;
};

const formatEventDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(iso ?? "").slice(0, 10);
  }
};

const mapEvent = (raw: Record<string, unknown>): FrontendEvent => {
  const e = raw as unknown as BackendEvent;
  const totalSeats = Math.max(e.availableSeats ?? 0, 1);
  return {
    _id: e._id,
    title: e.title,
    description: e.description ?? "",
    date: formatEventDate(e.date),
    dateISO: String(e.date ?? "").slice(0, 10),
    time: "",
    location: e.location,
    category: e.eventType ?? "Upcoming",
    seats: e.availableSeats ?? 0,
    totalSeats,
    price: e.price ?? 0,
    image: e.banner ?? FALLBACK_IMAGE,
    host: "TrekVista Expeditions",
  };
};

/* Product category → fallback image (Unsplash) so cards always look good. */
const PRODUCT_IMAGES: Record<string, string> = {
  "Trekking Gear": "https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=900&q=80",
  Camping: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
  Clothing: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=900&q=80",
  Accessories: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
  Equipment: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80",
};

export type FrontendProduct = {
  _id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  gallery: string[];
  price: number;
  oldPrice?: number | undefined;
  rentPerDay?: number | undefined;
  rating: number;
  reviews: number;
  stock: number;
  tag?: string | undefined;
  weight: string;
  shortDescription: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
};

type BackendProduct = {
  _id: string;
  name: string;
  category: string;
  buyPrice: number;
  rentPrice: number;
  stock: number;
  description?: string;
  image?: string;
};

const mapProduct = (raw: Record<string, unknown>): FrontendProduct => {
  const p = raw as unknown as BackendProduct;
  const description = p.description ?? "";
  return {
    _id: p._id,
    name: p.name,
    category: p.category,
    brand: "",
    image: p.image || PRODUCT_IMAGES[p.category] || FALLBACK_IMAGE,
    gallery: [],
    price: p.buyPrice ?? 0,
    oldPrice: undefined,
    rentPerDay: p.rentPrice ?? undefined,
    rating: 0,
    reviews: 0,
    stock: p.stock ?? 0,
    tag: undefined,
    weight: "",
    shortDescription: description,
    description,
    features: description ? [description] : [],
    specs: [
      { label: "Category", value: p.category },
      { label: "Stock", value: String(p.stock ?? 0) },
    ],
  };
};

export type FrontendGalleryPhoto = {
  _id: string;
  src: string;
  caption: string;
  location: string;
  category: string;
  photographer: string;
};

const GALLERY_CATEGORY_MAP: Record<string, string> = {
  Trekking: "Mountains",
  Camping: "Camps",
  Adventure: "Mountains",
  Destinations: "Mountains",
  Events: "Culture",
  Other: "Mountains",
};

type BackendGallery = {
  _id: string;
  title: string;
  category: string;
  image: string;
};

const mapGallery = (raw: Record<string, unknown>): FrontendGalleryPhoto => {
  const g = raw as unknown as BackendGallery;
  return {
    _id: g._id,
    src: g.image,
    caption: g.title,
    location: g.category,
    category: GALLERY_CATEGORY_MAP[g.category] ?? "Mountains",
    photographer: "TrekVista Expeditions",
  };
};

/* ------------------------------------------------------------------ */
/* Endpoint groups — thin wrappers used by pages/contexts.            */
/* ------------------------------------------------------------------ */

export const authService = {
  login: (payload: { email: string; password: string }) =>
    unwrap<{ user: unknown; token: string }>(api.post("/auth/login", payload)),
  register: (payload: { name: string; email: string; password: string; phone: string }) =>
    unwrap<{ user: unknown; token: string }>(api.post("/auth/register", payload)),
  profile: () => unwrap<unknown>(api.get("/auth/me")),
};

export const packageService = {
  list: async (params?: Record<string, unknown>) => {
    const { packages } = await unwrap<{ packages: Record<string, unknown>[] }>(
      api.get("/packages", { params }),
    );
    return (packages ?? []).map(mapPackage);
  },
  featured: async () => {
    const { packages } = await unwrap<{ packages: Record<string, unknown>[] }>(
      api.get("/packages/featured"),
    );
    return (packages ?? []).map(mapPackage);
  },
  detail: async (id: string) => {
    const { package: pkg } = await unwrap<{ package: Record<string, unknown> }>(
      api.get(`/packages/${id}`),
    );
    return mapPackage(pkg);
  },
};

export const eventService = {
  list: async () => {
    const { events } = await unwrap<{ events: Record<string, unknown>[] }>(api.get("/events"));
    return (events ?? []).map(mapEvent);
  },
  detail: async (id: string) => {
    const { event } = await unwrap<{ event: Record<string, unknown> }>(api.get(`/events/${id}`));
    return mapEvent(event);
  },
};

export const productService = {
  list: async (params?: Record<string, unknown>) => {
    const { products } = await unwrap<{ products: Record<string, unknown>[] }>(
      api.get("/products", { params }),
    );
    return (products ?? []).map(mapProduct);
  },
  detail: async (id: string) => {
    const { product } = await unwrap<{ product: Record<string, unknown> }>(
      api.get(`/products/${id}`),
    );
    return mapProduct(product);
  },
};

export const bookingService = {
  create: (payload: Record<string, unknown>) => unwrap(api.post("/bookings", payload)),
  mine: () => unwrap(api.get("/bookings/my")),
};

export const reviewService = {
  list: (packageId: string) => unwrap(api.get(`/reviews/package/${packageId}`)),
  create: (payload: Record<string, unknown>) => unwrap(api.post("/reviews", payload)),
};

export const galleryService = {
  list: async (category?: string) => {
    const { images } = await unwrap<{ images: Record<string, unknown>[] }>(
      api.get("/gallery", { params: category ? { category } : undefined }),
    );
    return (images ?? []).map(mapGallery);
  },
};

export const contactService = {
  send: (payload: { name: string; email: string; subject?: string; message: string }) =>
    api.post("/contact", payload).then((r) => r.data),
};

export default api;
