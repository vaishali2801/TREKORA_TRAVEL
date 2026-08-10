import { writeFileSync } from "fs";

const BASE = "http://localhost:5001/api/v1";
const ADMIN = "admin@tour.com";
const USER = "normal@example.com";
const PASS = "123456";

const req = (name, method, path, options = {}) => ({
  name,
  request: {
    method,
    header: [
      { key: "Content-Type", value: "application/json" },
      ...(options.auth ? [{ key: "Authorization", value: "Bearer {{token}}" }] : []),
    ],
    url: { raw: `${BASE}${path}`, host: [BASE.replace("http://", "").split("/")[0]], path: [...`${BASE}${path}`.split("/").slice(3)] },
    ...(options.body ? { body: { mode: "raw", raw: JSON.stringify(options.body) } } : {}),
  },
});

const folder = (name, items) => ({ name, item: items });

const collection = {
  info: {
    name: "Tour Package Management API",
    description: "Complete REST API collection - Import and run. Login first to set {{token}}.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    folder("Auth", [
      req("Register", "POST", "/auth/register", { body: { name: "New User", email: "new@example.com", password: "123456", phone: "9876543210" } }),
      req("Login (Admin)", "POST", "/auth/login", { body: { email: ADMIN, password: "admin123" } }),
      req("Login (User)", "POST", "/auth/login", { body: { email: USER, password: PASS } }),
      req("Logout", "POST", "/auth/logout"),
      req("Current User", "GET", "/auth/me", { auth: true }),
      req("Change Password", "PATCH", "/auth/change-password", { auth: true, body: { currentPassword: PASS, newPassword: "newpass123" } }),
      req("Update Profile", "PATCH", "/users/profile", { auth: true, body: { name: "Updated Name", phone: "9123456780" } }),
    ]),
    folder("Packages", [
      req("List Packages", "GET", "/packages?page=1&limit=10&sort=price&order=asc"),
      req("Featured Packages", "GET", "/packages/featured"),
      req("Get Package", "GET", "/packages/:packageId"),
      req("Create Package (Admin)", "POST", "/packages", { auth: true, body: { title: "Kashmir Snow Trek", location: "Srinagar", duration: 5, price: 15999, category: "Snow Trek", difficulty: "Moderate", isFeatured: true } }),
      req("Update Package (Admin)", "PUT", "/packages/:packageId", { auth: true, body: { price: 16999 } }),
      req("Delete Package (Admin)", "DELETE", "/packages/:packageId", { auth: true }),
    ]),
    folder("Events", [
      req("List Events", "GET", "/events?page=1&limit=10"),
      req("Upcoming Events", "GET", "/events/upcoming"),
      req("Special Events", "GET", "/events/special"),
      req("Get Event", "GET", "/events/:eventId"),
      req("Create Event (Admin)", "POST", "/events", { auth: true, body: { title: "New Year Celebration", eventType: "Special", date: "2026-12-31", location: "Goa", price: 2999, availableSeats: 100 } }),
      req("Update Event (Admin)", "PUT", "/events/:eventId", { auth: true, body: { price: 3499 } }),
      req("Delete Event (Admin)", "DELETE", "/events/:eventId", { auth: true }),
    ]),
    folder("Bookings", [
      req("Book Package", "POST", "/bookings", { auth: true, body: { package: "{{packageId}}", bookingDate: "2026-11-15", participants: 2 } }),
      req("My Bookings", "GET", "/bookings/my", { auth: true }),
      req("Cancel Booking", "PATCH", "/bookings/:bookingId/cancel", { auth: true }),
      req("All Bookings (Admin)", "GET", "/bookings", { auth: true }),
      req("Update Booking Status (Admin)", "PATCH", "/bookings/:bookingId/status", { auth: true, body: { bookingStatus: "Confirmed", paymentStatus: "Paid" } }),
    ]),
    folder("Store", [
      req("List Products", "GET", "/products?page=1&limit=10&category=Camping"),
      req("Get Product", "GET", "/products/:productId"),
      req("Create Product (Admin)", "POST", "/products", { auth: true, body: { name: "Camping Tent", category: "Camping", buyPrice: 4999, rentPrice: 499, stock: 20 } }),
      req("Update Product (Admin)", "PUT", "/products/:productId", { auth: true, body: { stock: 25 } }),
      req("Delete Product (Admin)", "DELETE", "/products/:productId", { auth: true }),
    ]),
    folder("Reviews", [
      req("Package Reviews", "GET", "/reviews/package/:packageId"),
      req("Add Review", "POST", "/reviews", { auth: true, body: { package: "{{packageId}}", rating: 5, comment: "Amazing trip!" } }),
      req("Update Review", "PATCH", "/reviews/:reviewId", { auth: true, body: { rating: 4 } }),
      req("Delete Review", "DELETE", "/reviews/:reviewId", { auth: true }),
    ]),
    folder("Gallery", [
      req("List Gallery", "GET", "/gallery?page=1&limit=10&category=Trekking"),
      req("Categories", "GET", "/gallery/categories"),
      req("Get Image", "GET", "/gallery/:galleryId"),
      req("Upload Image (Admin)", "POST", "/gallery", { auth: true, body: { title: "Summit View", category: "Trekking" } }),
      req("Delete Image (Admin)", "DELETE", "/gallery/:galleryId", { auth: true }),
    ]),
    folder("Dashboard", [
      req("Dashboard Stats (Admin)", "GET", "/dashboard/stats", { auth: true }),
    ]),
  ],
};

writeFileSync("postman_collection.json", JSON.stringify(collection, null, 2));
console.log("postman_collection.json written");
