# Project Structure

This document is the architecture reference for EduMaster contributors. It describes the current codebase layout and naming conventions without changing the public product terminology.

## Architecture at a Glance

```text
main.jsx
  └── App.jsx
        └── route-level pages
              └── reusable components
                    ├── local data
                    ├── styles
                    └── SVG assets
```

`src/main.jsx` mounts the React application and imports global styles. `src/App.jsx` owns the browser-router configuration. Route pages compose feature components, which consume local data modules and SVG assets.

## Source Layout

```text
src/
├── assets/svg/             # React SVG illustration components, grouped by feature
├── components/             # Reusable UI grouped by feature or page area
│   ├── Auth/
│   ├── Contact/
│   ├── Courses/
│   ├── Events/
│   ├── Home/
│   ├── Services/
│   ├── Testimonials/
│   └── about/
├── data/                   # Local content and UI data
├── pages/                  # Route-level page compositions
│   ├── About/
│   ├── Auth/
│   ├── Contact/
│   ├── Courses/
│   ├── Events/
│   ├── Home/
│   ├── Services/
│   └── Testimonials/
├── styles/                 # Global CSS, variables, and shared responsive rules
├── svg/                    # Standalone SVG files
├── App.jsx                 # Routes
└── main.jsx                # Application entry point
```

## Responsibilities

| Location | Responsibility |
| --- | --- |
| `pages/` | Assemble components into route-level screens; keep page-specific styles beside their page where applicable. |
| `components/` | Hold reusable, feature-scoped UI sections and their styles. |
| `data/` | Store the static content currently rendered by the frontend. |
| `assets/svg/` | Keep imported React SVG illustration components organized by feature. |
| `svg/` | Keep standalone SVG files. |
| `styles/` | Define shared variables, global CSS, and common responsive rules. |

## Page Conventions

- Home: `pages/Home/Home.jsx` with `HomeMotion.css`.
- Courses: `pages/Courses/CoursesPage.jsx` with `CoursesPage.css` and `CoursesMotion.css`.
- Other pages follow their feature folder when they have page-specific files, such as `pages/About/` and `pages/Auth/`.
- Route pages compose UI; reusable sections belong in the relevant `components/` feature folder.

## Events Source Locations

The public feature and route are **Events** (`/events`). Its source locations are:

- `pages/Events/EventsPage.jsx`
- `components/Events/`
- `assets/svg/events/EventsHero.jsx`
- `data/eventsData.js`

The legacy `/programs` path is retained as a compatibility redirect to `/events`.

## Styling and Motion

- Component styles are colocated with the component where practical.
- Global variables, base styles, and shared media queries are in `src/styles/`.
- Framer Motion utilities are located in `components/Home/motion.jsx` and are used alongside CSS transitions and keyframes.
- Reduced-motion handling is present in motion-related styles and components.

## Current Boundaries

- Content is local and data-driven; there is no API, backend, or database layer.
- Authentication and newsletter forms are presentational only.
- `hooks/` and `utils/` directories do not currently exist; add them only when a genuinely shared hook or utility is introduced.
