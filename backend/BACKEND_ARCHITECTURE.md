# Backend Architecture

Architecture reference for the EduMaster backend. This document defines the Phase 1 design and is the contract that the implementation must follow. No application code exists yet — this document is written first, by design.

- Runtime: Node.js (ES Modules only, `"type": "module"`)
- Framework: Express 4
- Database: MongoDB via Mongoose
- Auth: JWT (HTTP-only cookie) + bcrypt
- Validation: Zod
- Style: async/await everywhere, thin controllers, business logic in services

---

## 1. Folder Structure

All runtime code lives under `backend/src/`. The empty placeholder folders currently sitting at `backend/` root (`config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `services/`, `utils/`) are consolidated into `src/` during implementation.

```text
backend/
├── src/
│   ├── config/
│   │   ├── env.js                  # Loads + validates process.env via Zod, exports frozen config
│   │   ├── db.js                   # Mongoose connection, retry + graceful close
│   │   └── cors.js                 # CORS options object (origin allowlist, credentials)
│   │
│   ├── models/
│   │   ├── User.js                 # Users collection
│   │   ├── Message.js              # Messages collection (contact form)
│   │   └── NewsletterSubscriber.js # NewsletterSubscribers collection
│   │
│   ├── validations/
│   │   ├── auth.validation.js      # registerSchema, loginSchema
│   │   ├── user.validation.js      # updateProfileSchema
│   │   ├── contact.validation.js   # createMessageSchema
│   │   └── newsletter.validation.js# subscribeSchema, unsubscribeSchema
│   │
│   ├── services/
│   │   ├── auth.service.js         # register, login, issue/verify tokens
│   │   ├── user.service.js         # getProfile, updateProfile
│   │   ├── contact.service.js      # createMessage
│   │   └── newsletter.service.js   # subscribe, unsubscribe
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── contact.controller.js
│   │   └── newsletter.controller.js
│   │
│   ├── routes/
│   │   ├── index.js                # Mounts all feature routers under /api/v1
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── contact.routes.js
│   │   └── newsletter.routes.js
│   │
│   ├── middleware/
│   │   ├── authenticate.js         # Verifies JWT, attaches req.user
│   │   ├── authorize.js            # Role check factory: authorize('admin')
│   │   ├── validate.js             # Zod schema runner for body/params/query
│   │   ├── rateLimiter.js          # globalLimiter, authLimiter, formLimiter
│   │   ├── notFound.js             # 404 handler for unmatched routes
│   │   └── errorHandler.js         # Central error handler (last in chain)
│   │
│   ├── utils/
│   │   ├── ApiError.js             # Operational error class
│   │   ├── ApiResponse.js          # Success response shape helper
│   │   ├── asyncHandler.js         # Wraps async controllers, forwards errors to next()
│   │   ├── token.js                # signAccessToken, signRefreshToken, verifyToken
│   │   ├── cookie.js               # setAuthCookies, clearAuthCookies
│   │   └── logger.js               # Morgan stream + minimal app logger
│   │
│   ├── app.js                      # Express app: middleware chain + routes (no listen)
│   └── server.js                   # Entry point: connect DB, listen, handle signals
│
├── uploads/                        # Reserved for a later phase (not used in Phase 1)
├── .env                            # Local only, git-ignored
├── .env.example                    # Committed template, no real values
├── .gitignore
├── package.json
└── BACKEND_ARCHITECTURE.md
```

**Separation of concerns**

| Layer | Knows about | Must not |
| --- | --- | --- |
| `routes` | middleware + controllers | contain logic |
| `controllers` | services, `req`/`res` | query the DB, hash passwords, build business rules |
| `services` | models, other services | touch `req`/`res`/`next` or HTTP status codes directly (throws `ApiError` instead) |
| `models` | Mongoose only | contain feature logic beyond schema hooks/methods |
| `validations` | Zod only | import services or models |

---

## 2. Database Schemas

Database name: `edumaster`. Three collections in Phase 1.

### 2.1 `users`

| Field | Type | Rules |
| --- | --- | --- |
| `name` | String | required, trim, 2–60 chars |
| `email` | String | required, unique index, lowercase, trim, email format |
| `password` | String | required, min 8, `select: false`, stored as bcrypt hash |
| `role` | String | enum `['user', 'admin']`, default `'user'` |
| `isActive` | Boolean | default `true` |
| `lastLoginAt` | Date | optional |
| `createdAt` / `updatedAt` | Date | via `timestamps: true` |

- Indexes: `{ email: 1 }` unique.
- Hooks: `pre('save')` — if `password` is modified, hash with bcrypt (cost 12).
- Methods: `comparePassword(plain)` → boolean.
- Transform: `toJSON` strips `password` and `__v`.

### 2.2 `messages` (Contact)

| Field | Type | Rules |
| --- | --- | --- |
| `name` | String | required, trim, 2–60 |
| `email` | String | required, lowercase, trim, email format |
| `subject` | String | required, trim, 3–120 |
| `message` | String | required, trim, 10–2000 |
| `status` | String | enum `['new', 'read', 'archived']`, default `'new'` |
| `meta.ip` | String | optional, captured server-side |
| `meta.userAgent` | String | optional, captured server-side |
| `createdAt` / `updatedAt` | Date | timestamps |

- Indexes: `{ createdAt: -1 }`, `{ email: 1 }`.
- Client-supplied `status` and `meta` are never accepted; they are set server-side.

### 2.3 `newslettersubscribers`

| Field | Type | Rules |
| --- | --- | --- |
| `email` | String | required, unique index, lowercase, trim, email format |
| `isSubscribed` | Boolean | default `true` |
| `source` | String | default `'website'` |
| `subscribedAt` | Date | default `Date.now` |
| `unsubscribedAt` | Date | optional |
| `createdAt` / `updatedAt` | Date | timestamps |

- Indexes: `{ email: 1 }` unique.
- Re-subscribing an existing unsubscribed email flips `isSubscribed` back to `true` instead of erroring.

---

## 3. API Endpoints

Base path: `/api/v1`. All responses use the JSON envelope in §7.

### 3.1 Health

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | Public | Uptime + DB connection state |

### 3.2 Auth — `/api/v1/auth`

| Method | Path | Auth | Body | Success |
| --- | --- | --- | --- | --- |
| POST | `/register` | Public | `name, email, password, confirmPassword` | 201, user object + auth cookies set |
| POST | `/login` | Public | `email, password` | 200, user object + auth cookies set |
| POST | `/logout` | Required | — | 200, cookies cleared |
| GET | `/me` | Required | — | 200, current user |

### 3.3 User — `/api/v1/users`

| Method | Path | Auth | Body | Success |
| --- | --- | --- | --- | --- |
| GET | `/profile` | Required | — | 200, profile |
| PATCH | `/profile` | Required | `name?`, `email?` | 200, updated profile |

`PATCH /profile` never accepts `role`, `password`, or `isActive`; password change is a later phase.

### 3.4 Contact — `/api/v1/contact`

| Method | Path | Auth | Body | Success |
| --- | --- | --- | --- | --- |
| POST | `/` | Public (form limiter) | `name, email, subject, message` | 201, `{ id, createdAt }` |
| GET | `/` | Admin | query: `page, limit, status` | 200, paginated messages |

### 3.5 Newsletter — `/api/v1/newsletter`

| Method | Path | Auth | Body | Success |
| --- | --- | --- | --- | --- |
| POST | `/subscribe` | Public (form limiter) | `email` | 201, `{ email, isSubscribed }` |
| POST | `/unsubscribe` | Public (form limiter) | `email` | 200, `{ email, isSubscribed: false }` |

**Status codes used:** 200 OK, 201 Created, 400 validation/bad request, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict (duplicate email), 429 rate limited, 500 internal.

---

## 4. Authentication Flow

**Strategy:** stateless JWT delivered in HTTP-only cookies. Cookies (not `localStorage`) keep the token out of reach of client-side JavaScript; the frontend calls the API with `credentials: 'include'`.

**Tokens**

| Token | Cookie | Lifetime | Payload |
| --- | --- | --- | --- |
| Access | `accessToken` | 15m (`JWT_ACCESS_EXPIRES_IN`) | `{ sub: userId, role }` |
| Refresh | `refreshToken` | 7d (`JWT_REFRESH_EXPIRES_IN`) | `{ sub: userId, type: 'refresh' }` |

Cookie flags: `httpOnly: true`, `sameSite: 'lax'` in development / `'none'` in production cross-site, `secure: true` when `NODE_ENV === 'production'`, `path: '/'`.

Phase 1 issues both cookies and clears both on logout. The `/auth/refresh` rotation endpoint is deferred to Phase 2; until then an expired access token means the client must log in again.

**Register**

1. `validate(registerSchema)` — shape, email format, password strength, `password === confirmPassword`.
2. `authService.register()` — check email uniqueness → `409` if taken.
3. Create user; `pre('save')` hook hashes the password with bcrypt cost 12.
4. Sign access + refresh tokens, set cookies.
5. Respond `201` with the sanitized user (never the hash).

**Login**

1. `validate(loginSchema)`.
2. `authService.login()` — fetch user with `.select('+password')`.
3. If no user **or** password mismatch → identical `401 Invalid email or password` (no user enumeration).
4. If `isActive === false` → `403`.
5. Update `lastLoginAt`, sign tokens, set cookies, respond `200`.

**Authenticated request**

1. `authenticate` reads `accessToken` from `req.cookies`, falling back to `Authorization: Bearer <token>`.
2. Missing token → `401`. Invalid/expired signature → `401` with code `TOKEN_EXPIRED` or `TOKEN_INVALID`.
3. Load the user by `sub`; if missing or inactive → `401`.
4. Attach `req.user = { id, role }` and continue.

**Logout**

`authenticate` → clear both cookies with the same flags used to set them → `200`.

**Authorization**

`authorize('admin')` runs after `authenticate` and returns `403` when `req.user.role` is not in the allowed list. Used by `GET /contact`.

---

## 5. Middleware Flow

Order in `src/app.js` — order is load-bearing:

```text
1.  helmet()                      → security headers
2.  cors(corsOptions)             → origin allowlist + credentials: true
3.  express.json({ limit:'10kb' })→ body parsing, small cap to blunt payload abuse
4.  express.urlencoded({ extended: true })
5.  cookieParser()                → populates req.cookies before authenticate
6.  morgan(dev | combined)        → request logging via logger stream
7.  globalLimiter                 → 100 req / 15 min per IP, all /api routes
8.  /api/v1 routes                → per-route: specificLimiter → validate → authenticate → authorize → controller
9.  notFound                      → unmatched path → ApiError 404
10. errorHandler                  → single exit point for every error
```

**Per-route chain example**

```text
POST /api/v1/auth/login
  authLimiter          (10 req / 15 min per IP)
  validate(loginSchema)
  authController.login → authService.login → User model
  errorHandler (only on throw)
```

**Rate limiter tiers**

| Limiter | Window | Max | Applied to |
| --- | --- | --- | --- |
| `globalLimiter` | 15 min | 100 | all `/api/*` |
| `authLimiter` | 15 min | 10 | `/auth/register`, `/auth/login` |
| `formLimiter` | 60 min | 5 | `/contact`, `/newsletter/*` |

Limiters key on IP and return `429` through the standard error envelope. `app.set('trust proxy', 1)` is required behind a proxy so the client IP is correct.

---

## 6. Validation Strategy

- **Single source:** Zod. Every request body, and any route param or query used in a lookup, is parsed before reaching a controller. Mongoose validators are the second line of defence, not the first.
- **Runner:** `validate(schema, source = 'body')` middleware parses with `safeParse`, and on failure throws `ApiError(400, 'Validation failed', issues)`.
- **Strip unknown keys:** schemas use `.strict()` or `.strip()` so clients cannot inject fields such as `role` or `isActive` (mass-assignment defence). Controllers pass only the parsed value forward, never the raw `req.body`.
- **Normalization inside the schema:** `.trim()`, `.toLowerCase()` on emails — so services always receive canonical data.
- **Error shape:** issues are flattened to `[{ field: 'email', message: 'Invalid email' }]` so the frontend can bind messages to inputs.
- **Env validation:** `config/env.js` parses `process.env` with a Zod schema at boot and exits with a clear message if a required variable is missing — the process never starts half-configured.

Password rule (Phase 1): min 8 characters, at least one letter and one number.

---

## 7. Error Handling Strategy

**`ApiError`** — the only error type thrown intentionally:

```js
new ApiError(statusCode, message, details = [], code = undefined)
// isOperational = true
```

**`asyncHandler(fn)`** wraps every async controller so a rejected promise reaches `next(err)` instead of becoming an unhandled rejection.

**`errorHandler`** is the single place that writes an error response. It:

1. Normalizes known non-`ApiError` failures:
   - Mongoose `ValidationError` → 400
   - Mongoose `CastError` → 400 (`Invalid <path>`)
   - Mongo duplicate key `E11000` → 409 (`<field> already exists`)
   - `JsonWebTokenError` → 401 `TOKEN_INVALID`
   - `TokenExpiredError` → 401 `TOKEN_EXPIRED`
2. Falls back to 500 `Internal server error` for anything unrecognized.
3. Logs the full stack server-side always; includes `stack` in the response **only** when `NODE_ENV !== 'production'`.
4. Never leaks driver messages, queries, or stack traces to production clients.

**Response envelope — consistent for every endpoint**

Success:

```json
{
  "success": true,
  "message": "Login successful",
  "data": { "user": { "id": "...", "name": "...", "email": "..." } }
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email address" }]
}
```

`errors` is omitted when empty. Paginated lists carry `data: { items, page, limit, total, totalPages }`.

**Process-level safety:** `server.js` listens for `unhandledRejection` and `uncaughtException` — log, close the HTTP server and the Mongo connection, then exit non-zero. `SIGINT`/`SIGTERM` trigger the same graceful shutdown.

---

## 8. Naming Conventions

| Item | Convention | Example |
| --- | --- | --- |
| Folders | lowercase, plural | `controllers/`, `validations/` |
| Model files | PascalCase, singular | `User.js`, `NewsletterSubscriber.js` |
| Other source files | camelCase with layer suffix | `auth.service.js`, `auth.controller.js`, `auth.routes.js`, `auth.validation.js` |
| Utility classes | PascalCase | `ApiError.js`, `ApiResponse.js` |
| Variables / functions | camelCase | `subscribeEmail`, `createMessage` |
| Classes | PascalCase | `ApiError` |
| Constants / env keys | UPPER_SNAKE_CASE | `JWT_ACCESS_SECRET` |
| Mongo collections | lowercase plural (Mongoose default) | `users`, `messages`, `newslettersubscribers` |
| Routes | kebab-case, plural nouns | `/api/v1/newsletter/unsubscribe` |
| Zod schemas | camelCase + `Schema` | `registerSchema` |
| Service methods | verb-first | `register`, `getProfile`, `updateProfile` |
| Exports | named exports; default export only for a router or the Express app | `export const login = ...` |

All imports use explicit `.js` extensions (required by ES Modules in Node).

---

## 9. Environment Variables

`.env` is git-ignored. `.env.example` is committed with placeholder values only — no real secret is ever written to a tracked file, and no secret is ever hardcoded in source. `config/env.js` is the only module that reads `process.env`.

| Variable | Required | Example / Default | Purpose |
| --- | --- | --- | --- |
| `NODE_ENV` | yes | `development` | Controls cookie `secure`, morgan format, error verbosity |
| `PORT` | no | `5000` | HTTP port |
| `MONGO_URI` | yes | `mongodb://127.0.0.1:27017/edumaster` | Mongo connection string |
| `JWT_ACCESS_SECRET` | yes | *(long random string)* | Signs access tokens |
| `JWT_REFRESH_SECRET` | yes | *(long random string)* | Signs refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | no | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRES_IN` | no | `7d` | Refresh token lifetime |
| `COOKIE_DOMAIN` | no | *(unset)* | Cookie domain in production |
| `CLIENT_URL` | yes | `http://localhost:5173` | CORS allowlist (comma-separated for multiple origins) |
| `BCRYPT_SALT_ROUNDS` | no | `12` | bcrypt cost |
| `RATE_LIMIT_WINDOW_MS` | no | `900000` | Global limiter window |
| `RATE_LIMIT_MAX` | no | `100` | Global limiter max requests |

**Dependencies to install:** `express`, `mongoose`, `dotenv`, `bcryptjs`, `jsonwebtoken`, `zod`, `cookie-parser`, `cors`, `helmet`, `morgan`, `express-rate-limit`; dev: `nodemon`.

**Scripts:** `dev` → `nodemon src/server.js`, `start` → `node src/server.js`.

---

## 10. Development Phases

**Phase 1 — Foundation (this document's scope)**

1. `package.json`, dependencies, `.gitignore`, `.env.example`
2. `config/env.js`, `config/db.js`, `config/cors.js`
3. `utils/` — `ApiError`, `ApiResponse`, `asyncHandler`, `token`, `cookie`, `logger`
4. `middleware/` — `validate`, `authenticate`, `authorize`, `rateLimiter`, `notFound`, `errorHandler`
5. Models — `User`, `Message`, `NewsletterSubscriber`
6. Validations — auth, user, contact, newsletter
7. Services → controllers → routes for auth, user, contact, newsletter
8. `app.js`, `server.js`, health endpoint
9. Manual verification of every endpoint

**Phase 2 — Auth hardening**
Refresh-token rotation endpoint, forgot/reset password, email verification, change password, refresh-token revocation store.

**Phase 3 — Frontend integration**
Wire the existing Contact, Newsletter, and Auth pages to the API (frontend UI and CSS untouched), API client helper with `credentials: 'include'`, loading and error states.

**Phase 4 — Content APIs**
Move Courses, Events, Services, and Testimonials from `frontend/src/data/` into the database with public read endpoints.

**Phase 5 — Admin**
Admin dashboard endpoints: manage messages and subscribers, content CRUD, role-guarded routes.

**Phase 6 — Operations**
File uploads (the reserved `uploads/`), automated tests, request-ID tracing, deployment configuration.

---

## 11. Explicit Non-Goals for Phase 1

- No frontend changes of any kind — no UI, no CSS, no refactors.
- No refresh-token rotation, password reset, or email sending.
- No file uploads.
- No seed data or content migration.
- No automated test suite.
