# Tour Package Management System — Backend API

Production-ready REST API built with Node.js, Express, Mongoose (MongoDB), JWT auth, Cloudinary media uploads, Multer, and express-validator.

## Tech Stack

Node.js · Express.js · MongoDB (Mongoose) · JWT · bcrypt · Multer · Cloudinary · Helmet · CORS · Morgan · Cookie Parser · Express Validator

## Project Status

**Phase 1 ✅** — Project Setup
- Express server with centralized middleware (helmet, cors, morgan, cookie-parser, json parsing)
- MongoDB connection (`config/database.js`)
- MVC folder structure
- Standard API response helpers (`utils/ApiResponse.js`, `utils/ApiError.js`)
- Centralized error handling (404 / 400 / 401 / 403 / 409 / 500 + Mongoose/JWT/Multer error mapping)

**Phase 2 ✅** — Authentication Module
- `models/User.js` — bcrypt password hashing (pre-save hook), `comparePassword`, role enum (`user`/`admin`), password excluded from JSON
- JWT via httpOnly cookie + optional `Authorization: Bearer` header (`utils/generateToken.js`)
- Register / Login / Logout / Current User / Change Password / Update Profile (with Cloudinary image upload)
- Middleware: `protect` (JWT verify), `adminOnly` (role check), `validate` (express-validator result), `uploadSingleImage` (multer)
- express-validator rules in `validators/authValidation.js` (name, email, password, 10-digit phone)
- Duplicate email → 409, wrong credentials → 401, invalid payload → 400

**Phase 3 ✅** — Package Module
- `models/Package.js` — title, location, duration, price, category (5 enums), difficulty (Easy/Moderate/Hard), bestSeason, description, highlights/included/excluded arrays, images, isFeatured, rating, createdBy
- Admin CRUD with up to 6 image uploads per package (Cloudinary `tour/packages` folder); images deleted from Cloudinary on update/delete
- Public list endpoint: pagination (`page`/`limit`), search (`search` matches title/location), sorting (`sort` + `order`, whitelisted fields), filters (`category`, `difficulty`, `isFeatured`)
- `GET /packages/featured` returns featured packages sorted by rating
- Role guard: non-admin → 403, unauthenticated → 401, invalid id → 400, missing → 404

**Phase 4 ✅** — Event Module
- `models/Event.js` — title, description, eventType (`Upcoming`/`Special`), date, location, price, banner (Cloudinary), availableSeats
- Admin CRUD with single banner upload (`tour/events`); banner cleaned up from Cloudinary on update/delete
- `GET /events/upcoming` — only Upcoming events with date ≥ today, sorted by date
- `GET /events/special` — all Special events
- List endpoint: pagination (`page`/`limit`), search (title/location), filter (`eventType`)

**Phase 5 ✅** — Booking Module
- `models/Booking.js` — user, package refs, bookingDate, participants, totalPrice, paymentStatus (`Pending`/`Paid`/`Refunded`), bookingStatus (`Pending`/`Confirmed`/`Cancelled`/`Completed`)
- `services/bookingService.js` — total price calculation (`price × participants`), cancelability rules, initial status logic
- Users: book package, booking history (`/my` with pagination + status filter), cancel own booking (only Pending/Confirmed → 400 otherwise; other users → 404)
- Admin: view all bookings (pagination + status filters), update booking/payment status; Completing a booking auto-marks payment Paid

**Phase 6 ✅** — Store Module
- `models/Product.js` — name, category (Trekking Gear/Camping/Clothing/Accessories/Equipment), buyPrice, rentPrice, stock, description, image (Cloudinary)
- Admin CRUD with single image upload (`tour/products`); image cleaned up on update/delete
- Public list: pagination, search (name), filter (`category`), sort (`buyPrice`/`rentPrice`/`stock`/`name`/`createdAt` + `order`)

**Phase 7 ✅** — Review Module
- `models/Review.js` — user + package refs, rating (1–5), comment; unique index (one review per user per package → 409 on duplicate)
- Static `calculateAverageRating()` — aggregation-based, auto-updates `Package.rating` on add/update/delete
- Users: add / update / delete own reviews (others' → 404); public list per package with pagination + reviewer info

**Phase 8 ✅** — Gallery Module
- `models/Gallery.js` — title, category (Trekking/Camping/Adventure/Destinations/Events/Other), image URL, uploadedBy ref
- Admin uploads images (Cloudinary `tour/gallery`), deletes them (Cloudinary cleanup)
- Public: paginated list with `category` filter + `search` (title), `GET /categories` returns distinct categories in use

**Phase 9 ✅** — Dashboard Module
- `GET /api/v1/dashboard/stats` (admin): total users/customers, packages, events, products, bookings + **total revenue** (sum of non-cancelled bookings) + bookings-by-status breakdown + 5 recent bookings & users
- All queries run in parallel via `Promise.all`

**Bonus ✅** — Email Notifications (Nodemailer + Gmail SMTP)
- `config/email.js` — SMTP transporter · `services/emailService.js` — non-blocking `sendEmail` (never breaks API flows)
- `utils/emailTemplates.js` — travel-themed responsive HTML templates (welcome, booking confirmed, cancelled, completed)
- Triggered on: register (welcome), booking created (confirmation), booking cancelled, booking marked Completed (payment auto-set to Paid)

**Bonus ✅** — Forgot / Reset Password
- `POST /api/v1/auth/forgot-password` — emails a one-time reset link (15 min expiry) via travel-themed template; generic response so emails aren't leaked
- `POST /api/v1/auth/reset-password` — accepts `token` + `newPassword`; token stored SHA-256-hashed (crypto), single-use, auto-cleared on reset
- Frontend: point reset link at `CLIENT_URL/reset-password?token=...`

**Bonus ✅** — Security Hardening
- **Helmet** — secure HTTP headers (CSP, HSTS, X-Frame-Options, nosniff…)
- **HPP** — blocks HTTP Parameter Pollution (`?limit=2&limit=50` → first wins)
- **Rate limiting** (`middlewares/rateLimiter.js`): global `apiLimiter` 500 req / 15 min per IP on all `/api/v1` routes; strict `authLimiter` 5 req / 15 min on register/login/change-password (brute-force protection) → 429 when exceeded
- Graceful shutdown on SIGINT/SIGTERM

## Folder Structure

```
backend/
├── config/          # database.js, cloudinary.js
├── controllers/     # auth, user, package, event, booking, product, review, gallery, dashboard
├── middlewares/     # auth, admin, error, upload, validation
├── models/          # User, Package, Booking, Event, Product, Review, Gallery, Order
├── routes/          # auth, user, package, booking, event, product, review, gallery, dashboard
├── services/        # bookingService, cloudinaryService
├── utils/           # ApiResponse, ApiError, generateToken, pagination
├── validators/      # auth, package, booking, product validations
├── app.js           # Express app configuration
└── server.js        # Server bootstrap + graceful shutdown
```

## Getting Started

```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, Cloudinary keys
npm install
npm run dev            # nodemon (development)
npm start              # production
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Server port (default 5001) |
| `NODE_ENV` | `development` / `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `JWT_COOKIE_EXPIRES_IN` | Cookie lifetime in days |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (587) |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail app password |
| `CLIENT_URL` | Allowed frontend origin (CORS) |

## API Response Standard

```json
{ "success": true, "message": "...", "data": {} }
```

Errors return `success: false` with `message` and optional `errors[]`; stack trace is only shown in development.

## Auth API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | Public | Register user |
| POST | `/api/v1/auth/login` | Public | Login (sets httpOnly cookie) |
| POST | `/api/v1/auth/logout` | Public | Clear token cookie |
| GET | `/api/v1/auth/me` | Private | Current user |
| PATCH | `/api/v1/auth/change-password` | Private | Change password |
| PATCH | `/api/v1/users/profile` | Private | Update profile (+ `profileImage` multipart) |

## Package API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/packages` | Public | List + paginate + search + sort + filter |
| GET | `/api/v1/packages/featured` | Public | Featured packages |
| GET | `/api/v1/packages/:id` | Public | Single package |
| POST | `/api/v1/packages` | Admin | Create (multipart `images[]`) |
| PUT | `/api/v1/packages/:id` | Admin | Update (images replaced on upload) |
| DELETE | `/api/v1/packages/:id` | Admin | Delete |

Query params: `page`, `limit`, `search`, `sort` (price/rating/createdAt/title/duration), `order` (asc/desc), `category`, `difficulty`, `isFeatured`

## Event API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/events` | Public | List + paginate + search + filter |
| GET | `/api/v1/events/upcoming` | Public | Upcoming events (date ≥ today) |
| GET | `/api/v1/events/special` | Public | Special events |
| GET | `/api/v1/events/:id` | Public | Single event |
| POST | `/api/v1/events` | Admin | Create (multipart `banner`) |
| PUT | `/api/v1/events/:id` | Admin | Update (banner replaced on upload) |
| DELETE | `/api/v1/events/:id` | Admin | Delete |

## Booking API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/v1/bookings` | Private | Book a package |
| GET | `/api/v1/bookings/my` | Private | Own booking history |
| PATCH | `/api/v1/bookings/:id/cancel` | Private | Cancel own booking |
| GET | `/api/v1/bookings` | Admin | All bookings (filter: `bookingStatus`, `paymentStatus`) |
| PATCH | `/api/v1/bookings/:id/status` | Admin | Update booking/payment status |

**Book package sample:**
```json
{ "package": "6a7067e53b23485799febbf8", "bookingDate": "2026-11-15", "participants": 2 }
```
`totalPrice` is auto-calculated: `package.price × participants`.

## Product API (Store)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/products` | Public | List + paginate + search + filter + sort |
| GET | `/api/v1/products/:id` | Public | Single product |
| POST | `/api/v1/products` | Admin | Create (multipart `image`) |
| PUT | `/api/v1/products/:id` | Admin | Update |
| DELETE | `/api/v1/products/:id` | Admin | Delete |

**Create product sample (JSON):**
```json
{
  "name": "Camping Tent",
  "category": "Camping",
  "buyPrice": 4999,
  "rentPrice": 499,
  "stock": 20,
  "description": "4 person tent"
}
```
Categories: `Trekking Gear`, `Camping`, `Clothing`, `Accessories`, `Equipment`

## Review API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/reviews/package/:packageId` | Public | Reviews for a package (paginated) |
| POST | `/api/v1/reviews` | Private | Add review (one per user per package) |
| PATCH | `/api/v1/reviews/:id` | Private | Update own review |
| DELETE | `/api/v1/reviews/:id` | Private | Delete own review |

**Add review sample:**
```json
{ "package": "<package_id>", "rating": 5, "comment": "Amazing trip!" }
```
`Package.rating` is recalculated automatically after every review change.

## Gallery API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/gallery` | Public | List (params: `page`, `limit`, `category`, `search`) |
| GET | `/api/v1/gallery/categories` | Public | All categories in use |
| GET | `/api/v1/gallery/:id` | Public | Single image |
| POST | `/api/v1/gallery` | Admin | Upload (multipart `image`) |
| DELETE | `/api/v1/gallery/:id` | Admin | Delete |

Categories: `Trekking`, `Camping`, `Adventure`, `Destinations`, `Events`, `Other`

## Dashboard API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/dashboard/stats` | Admin | Totals, revenue, status breakdown, recent data |

## Postman Collection

Import `postman_collection.json` (project root of this backend) — all endpoints, params, and sample bodies are preconfigured.

## Roadmap

All 9 phases complete. See "Future Improvements" ideas below.

- Phase 2 — Auth module ✅ · Phase 3 — Packages ✅ · Phase 4 — Events ✅ · Phase 5 — Bookings ✅ · Phase 6 — Store ✅ · Phase 7 — Reviews ✅ · Phase 8 — Gallery ✅ · Phase 9 — Dashboard ✅
