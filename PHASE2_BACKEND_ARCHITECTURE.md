# Phase 2 Backend Architecture — Content Modules

Design document for the four Phase 2 content modules: **Course, Event, Service, Testimonial**.
No code in this phase — design only. Builds on the existing Phase 1 architecture
(route → validation middleware → controller → service → Mongoose model, ES Modules, async/await,
`ApiResponse` / `ApiError` / `errorHandler`).

---

## 1. Course Module

### Purpose
Manage the catalog of courses shown on the site: title, description, pricing, level, category,
instructor info, and publication state. Publicly readable; managed by admins.

### Database Schema (`Course`)
| Field | Type | Constraints |
|---|---|---|
| title | String | required, trim, 3–120 chars |
| slug | String | required, unique, lowercase, auto-generated from title |
| description | String | required, 20–5000 chars |
| shortDescription | String | optional, max 300 chars |
| category | String | required, enum or free string with index |
| level | String | enum: `beginner` \| `intermediate` \| `advanced` |
| price | Number | required, min 0 |
| discountPrice | Number | optional, min 0, must be < price (validated) |
| durationWeeks | Number | optional, min 1 |
| instructorName | String | required, 2–60 chars |
| thumbnailUrl | String | optional, valid URL |
| tags | [String] | optional, each trimmed, max 10 tags |
| isPublished | Boolean | default `false` |
| enrolledCount | Number | default 0, min 0 (future use) |
| createdBy | ObjectId → User | required, set from authenticated admin |
| timestamps | createdAt / updatedAt | automatic |

### Validation Strategy
- Request-level: Joi/Zod schema in `validations/course.validation.js`, applied via existing `validate` middleware (create = all required fields; update = partial, min 1 field).
- Model-level: Mongoose constraints as a second safety net (same pattern as `Message.js`).
- Slug generated in the service layer, never accepted from the client.

### Required Indexes
- `slug` — unique index (lookups by slug).
- `{ category: 1, isPublished: 1 }` — compound, for the main public listing query.
- `{ price: 1 }` — price-range filtering/sorting.
- Text index on `{ title, description, tags }` — search.

### CRUD Endpoints
| Method | Path | Access |
|---|---|---|
| GET | `/api/v1/courses` | Public (published only; admins see all with `?includeUnpublished=true`) |
| GET | `/api/v1/courses/:slug` | Public |
| POST | `/api/v1/courses` | Admin |
| PATCH | `/api/v1/courses/:id` | Admin |
| DELETE | `/api/v1/courses/:id` | Admin |

### Search / Filtering / Pagination / Sorting
- **Search:** `?search=` → MongoDB `$text` query against the text index; fall back to case-insensitive regex on `title` for partial-word matches if needed later.
- **Filtering:** `?category=`, `?level=`, `?minPrice=`, `?maxPrice=`, `?tag=` — built as a whitelisted filter object in the service layer (never pass raw query into Mongo).
- **Pagination:** `?page=` (default 1) and `?limit=` (default 10, max 50); response includes `total`, `page`, `pages`.
- **Sorting:** `?sort=` whitelist: `newest` (default, `-createdAt`), `price`, `-price`, `title`.

### Authorization
- Reads: public.
- Writes: `authenticate` + `authorize('admin')` (existing middleware).

### Future Scalability
- Add `Enrollment` collection later referencing `Course._id` (enrolledCount kept denormalized).
- Move search to Atlas Search when catalog grows.
- Category can be promoted to its own collection without schema break (keep as string now).

---

## 2. Event Module

### Purpose
Manage upcoming and past events (webinars, workshops, open days): schedule, venue, capacity, publication state.

### Database Schema (`Event`)
| Field | Type | Constraints |
|---|---|---|
| title | String | required, trim, 3–120 chars |
| slug | String | required, unique, lowercase, auto-generated |
| description | String | required, 20–5000 chars |
| eventType | String | enum: `webinar` \| `workshop` \| `seminar` \| `other` |
| startDate | Date | required |
| endDate | Date | optional, must be ≥ startDate |
| venue | String | required, 2–200 chars (or `Online`) |
| isOnline | Boolean | default `false` |
| capacity | Number | optional, min 1 |
| registeredCount | Number | default 0 (future registration feature) |
| bannerUrl | String | optional, valid URL |
| isPublished | Boolean | default `false` |
| createdBy | ObjectId → User | required |
| timestamps | | automatic |

### Validation Strategy
Same two-layer approach: request schema (`event.validation.js`) via `validate` middleware + Mongoose constraints. Cross-field rule (`endDate ≥ startDate`) enforced in the request schema and service layer.

### Required Indexes
- `slug` — unique.
- `{ startDate: 1, isPublished: 1 }` — upcoming-events listing (primary query).
- `{ eventType: 1 }` — type filter.
- Text index on `{ title, description }`.

### CRUD Endpoints
| Method | Path | Access |
|---|---|---|
| GET | `/api/v1/events` | Public |
| GET | `/api/v1/events/:slug` | Public |
| POST | `/api/v1/events` | Admin |
| PATCH | `/api/v1/events/:id` | Admin |
| DELETE | `/api/v1/events/:id` | Admin |

### Search / Filtering / Pagination / Sorting
- **Search:** `?search=` → text index.
- **Filtering:** `?eventType=`, `?status=upcoming|past` (computed against `startDate` vs now), `?isOnline=`, `?from=` / `?to=` date range.
- **Pagination:** same standard (`page`, `limit`, capped at 50).
- **Sorting:** default `startDate` ascending for upcoming, `-startDate` for past; whitelist `startDate`, `-startDate`, `title`.

### Authorization
Public reads; admin-only writes via `authenticate` + `authorize('admin')`.

### Future Scalability
- `EventRegistration` collection later (capacity + registeredCount already reserved).
- Recurring events can be added via an optional `recurrenceRule` field without breaking the schema.

---

## 3. Service Module

### Purpose
Manage the institution's service offerings (e.g., career counseling, tutoring, certification prep) displayed on the site.

### Database Schema (`Service`)
| Field | Type | Constraints |
|---|---|---|
| name | String | required, trim, 3–100 chars |
| slug | String | required, unique, lowercase, auto-generated |
| description | String | required, 20–3000 chars |
| iconUrl | String | optional, valid URL |
| features | [String] | optional, each 2–150 chars, max 15 items |
| displayOrder | Number | default 0 (controls homepage ordering) |
| isActive | Boolean | default `true` |
| createdBy | ObjectId → User | required |
| timestamps | | automatic |

### Validation Strategy
Request schema (`service.validation.js`) + Mongoose constraints; `displayOrder` must be an integer ≥ 0.

### Required Indexes
- `slug` — unique.
- `{ isActive: 1, displayOrder: 1 }` — compound, matches the exact public listing query.

### CRUD Endpoints
| Method | Path | Access |
|---|---|---|
| GET | `/api/v1/services` | Public (active only by default) |
| GET | `/api/v1/services/:slug` | Public |
| POST | `/api/v1/services` | Admin |
| PATCH | `/api/v1/services/:id` | Admin |
| DELETE | `/api/v1/services/:id` | Admin |

### Search / Filtering / Pagination / Sorting
- **Search:** simple case-insensitive regex on `name` (small collection; text index unnecessary).
- **Filtering:** `?isActive=` (admin only; public always sees active).
- **Pagination:** standard, but default `limit=20` since the set is small.
- **Sorting:** default `displayOrder` asc, then `name`; whitelist `name`, `createdAt`.

### Authorization
Public reads; admin writes.

### Future Scalability
- Pricing tiers or booking can be added as embedded subdocuments or a linked collection later.
- `displayOrder` supports drag-and-drop admin reordering without schema change.

---

## 4. Testimonial Module

### Purpose
Manage student/client testimonials with a moderation flow: submitted or created, then approved before appearing publicly.

### Database Schema (`Testimonial`)
| Field | Type | Constraints |
|---|---|---|
| authorName | String | required, trim, 2–60 chars |
| authorRole | String | optional, max 80 chars (e.g., "Student, Web Dev Batch 12") |
| content | String | required, 10–1000 chars |
| rating | Number | required, integer 1–5 |
| avatarUrl | String | optional, valid URL |
| courseRef | ObjectId → Course | optional (link testimonial to a course) |
| status | String | enum: `pending` \| `approved` \| `rejected`, default `pending` |
| isFeatured | Boolean | default `false` |
| createdBy | ObjectId → User | optional (null for public submissions, if enabled later) |
| timestamps | | automatic |

### Validation Strategy
Request schema (`testimonial.validation.js`) + Mongoose constraints. Status transitions only via a dedicated admin endpoint — never through general update payloads.

### Required Indexes
- `{ status: 1, isFeatured: -1, createdAt: -1 }` — compound, matches the public listing (approved, featured first, newest).
- `{ courseRef: 1 }` — per-course testimonials.

### CRUD Endpoints
| Method | Path | Access |
|---|---|---|
| GET | `/api/v1/testimonials` | Public (approved only; admin sees all with `?status=`) |
| GET | `/api/v1/testimonials/:id` | Admin |
| POST | `/api/v1/testimonials` | Admin (public submission can be enabled later with `formLimiter`) |
| PATCH | `/api/v1/testimonials/:id` | Admin |
| PATCH | `/api/v1/testimonials/:id/status` | Admin (approve/reject) |
| DELETE | `/api/v1/testimonials/:id` | Admin |

### Search / Filtering / Pagination / Sorting
- **Search:** regex on `authorName` (admin use); not needed publicly.
- **Filtering:** `?rating=`, `?courseRef=`, `?isFeatured=`; `?status=` admin-only.
- **Pagination:** standard (`page`, `limit` default 10, max 50).
- **Sorting:** default `-isFeatured, -createdAt`; whitelist `rating`, `-rating`, `-createdAt`.

### Authorization
- Public reads return **approved only** — enforced in the service layer regardless of query params.
- All writes admin-only. Status changes isolated to the dedicated endpoint.

### Future Scalability
- Public submission flow reuses the existing `formLimiter` + moderation queue (`status: pending`).
- Aggregated average rating per course can be computed via an aggregation pipeline (courseRef index already supports it).

---

## Cross-Cutting Design

### Folder Structure (Phase 2 additions)
```
backend/src/
├── models/
│   ├── Course.js
│   ├── Event.js
│   ├── Service.js
│   └── Testimonial.js
├── validations/
│   ├── course.validation.js
│   ├── event.validation.js
│   ├── service.validation.js
│   └── testimonial.validation.js
├── services/
│   ├── course.service.js
│   ├── event.service.js
│   ├── service.service.js
│   └── testimonial.service.js
├── controllers/
│   ├── course.controller.js
│   ├── event.controller.js
│   ├── service.controller.js
│   └── testimonial.controller.js
├── routes/
│   ├── course.routes.js
│   ├── event.routes.js
│   ├── service.routes.js
│   ├── testimonial.routes.js
│   └── index.js            # register the four new routers
└── utils/
    ├── slugify.js          # shared slug generator
    └── queryFeatures.js    # shared pagination/filter/sort builder
```
No changes to auth, contact, newsletter, or any Phase 1 files other than adding router mounts in `routes/index.js`.

### API Naming Conventions
- Plural, kebab-free resource names: `/courses`, `/events`, `/services`, `/testimonials`, mounted under the existing API router (matching `/auth`, `/users`, `/contact`).
- Public single-item reads use `:slug` where the resource is content-facing (Course, Event, Service); admin mutations use `:id`.
- Query params are camelCase (`minPrice`, `eventType`), consistent everywhere.
- Sub-actions as suffixed paths (`/testimonials/:id/status`), not verbs in the resource name.

### Error Handling Approach
- Controllers stay thin; services throw `ApiError(statusCode, message)` (existing util).
- Central `errorHandler` middleware already formats errors — no per-module error formatting.
- 404 for missing/unpublished resources (do not leak existence of unpublished items to the public).
- 409 for duplicate slug conflicts; 400 for validation failures (handled by `validate` middleware).
- Async errors flow through the existing `asyncHandler` wrapper.

### Response Format
Existing `ApiResponse` shape everywhere:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Courses fetched successfully",
  "data": {
    "courses": [],
    "pagination": { "total": 42, "page": 1, "pages": 5, "limit": 10 }
  }
}
```
List endpoints always include the `pagination` object; single-item endpoints return the resource keyed by its name (`{ "course": {...} }`).

### Development Order
1. **Shared utilities** — `slugify.js`, `queryFeatures.js` (pagination/filter/sort builder).
2. **Service module** — smallest schema, no search complexity; proves the full vertical slice.
3. **Testimonial module** — adds the status/moderation pattern.
4. **Course module** — adds text search, price filtering, richest schema.
5. **Event module** — adds date-range/upcoming-past logic.
6. **Route registration** — mount all four in `routes/index.js`; smoke-test via `/health` + manual requests.

Each module is built and verified as a complete vertical (model → validation → service → controller → route) before starting the next.
