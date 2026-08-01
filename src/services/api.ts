/**
 * Central Axios instance + API service layer.
 * Every network call in the app goes through this file (no fetch calls in components).
 * Base URL comes from VITE_API_URL, falling back to the local Express backend.
 */
import axios, { type AxiosInstance } from "axios";

const BASE_URL =
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:5000/api";

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
/* Endpoint groups — thin wrappers used by pages/contexts (Phase 2+).  */
/* ------------------------------------------------------------------ */

export const authService = {
  login: (payload: { email: string; password: string }) =>
    api.post("/auth/login", payload).then((r) => r.data),
  register: (payload: { name: string; email: string; password: string }) =>
    api.post("/auth/register", payload).then((r) => r.data),
  profile: () => api.get("/auth/profile").then((r) => r.data),
};

export const packageService = {
  list: (params?: Record<string, unknown>) =>
    api.get("/packages", { params }).then((r) => r.data),
  featured: () => api.get("/packages/featured").then((r) => r.data),
  detail: (id: string) => api.get(`/packages/${id}`).then((r) => r.data),
};

export const eventService = {
  list: () => api.get("/events").then((r) => r.data),
  detail: (id: string) => api.get(`/events/${id}`).then((r) => r.data),
};

export const productService = {
  list: (params?: Record<string, unknown>) =>
    api.get("/products", { params }).then((r) => r.data),
  detail: (id: string) => api.get(`/products/${id}`).then((r) => r.data),
};

export const bookingService = {
  create: (payload: Record<string, unknown>) =>
    api.post("/bookings", payload).then((r) => r.data),
  mine: () => api.get("/bookings/my").then((r) => r.data),
};

export const reviewService = {
  list: () => api.get("/reviews").then((r) => r.data),
  create: (payload: Record<string, unknown>) => api.post("/reviews", payload).then((r) => r.data),
};

export const galleryService = {
  list: (category?: string) =>
    api.get("/gallery", { params: category ? { category } : undefined }).then((r) => r.data),
};

export const contactService = {
  send: (payload: { name: string; email: string; subject?: string; message: string }) =>
    api.post("/contact", payload).then((r) => r.data),
};

export default api;
