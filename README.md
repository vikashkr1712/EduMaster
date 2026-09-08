# EduMaster

> Full-stack learning platform built with React, Vite, Express, and MongoDB.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Configured-0055FF)
![Status](https://img.shields.io/badge/Status-Full%20Stack-success)

EduMaster is a full-stack educational platform for course discovery, enrolment, learning, quizzes, assignments, certificates, events, notifications, and administration.

## Table of Contents

- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Routes](#routes)
- [Responsive Design](#responsive-design)
- [Browser Support](#browser-support)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

## Live Demo

No deployment URL is currently configured.

## Screenshots

Pages available for screenshots (images are not embedded in this README):

- Home
- Courses
- Events
- Services
- Login
- Signup

## Features

- Responsive, client-side navigation across platform pages
- Course catalogue with search, category/level/price/rating filters, sorting, and pagination
- Events page with featured events and a “how it works” flow
- Services page with service cards, pricing, process, statistics, and an expandable FAQ
- Home-page sections for featured courses, learner testimonials, partners, articles, calls to action, and newsletter signup UI
- Dedicated testimonials, about, and contact pages
- Email/password and Google authentication with protected learner and administrator routes
- Backend APIs for courses, enrolments, learning progress, quizzes, assignments, orders, certificates, and notifications
- Local SVG illustrations and inline SVG icons
- Framer Motion and CSS animations with reduced-motion support

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 18 |
| Backend | Node.js and Express |
| Database | MongoDB with Mongoose |
| Routing | React Router DOM |
| Animation | Framer Motion (already configured) and CSS animations |
| Icons | Project-local inline SVG icons and React SVG components |
| Build tool | Vite |
| Styling | Plain CSS with shared variables and responsive stylesheets |

## Folder Structure

```text
frontend/src/
├── assets/
│   └── svg/
│       ├── about/
│       ├── auth/
│       ├── common/
│       ├── contact/
│       ├── courses/
│       ├── events/
│       ├── home/
│       ├── services/
│       └── testimonials/
├── components/
│   ├── Auth/
│   ├── Contact/
│   ├── Courses/
│   ├── Events/
│   ├── Home/
│   ├── Services/
│   ├── Testimonials/
│   └── about/
├── data/
├── pages/
│   ├── About/
│   ├── Auth/
│   ├── Contact/
│   ├── Courses/
│   │   ├── CoursesMotion.css
│   │   ├── CoursesPage.css
│   │   └── CoursesPage.jsx
│   ├── Events/
│   │   └── EventsPage.jsx
│   ├── Home/
│   │   ├── Home.jsx
│   │   └── HomeMotion.css
│   ├── Services/
│   └── Testimonials/
├── styles/
├── utils/
├── App.jsx
└── main.jsx
```

Backend controllers, routes, services, models, validation, middleware, and utilities are organized under `backend/src/`.

## Project Structure Explanation

| Folder/file | Purpose |
| --- | --- |
| `frontend/src/assets/svg/` | Page-specific React SVG illustration components. |
| `frontend/src/components/` | Reusable page sections, cards, navigation, footer, and form components. |
| `frontend/src/data/` | Local data used for courses, services, events, testimonials, contact, about, and auth content. |
| `frontend/src/pages/` | Route-level page compositions. The Events route is implemented in `frontend/src/pages/Events/`. |
| `frontend/src/styles/` | Global styles, CSS variables, and shared responsive rules. |
| `frontend/src/utils/` | Shared frontend helpers for quizzes, reports, motion, and video URLs. |
| `backend/src/` | Express API implementation, data models, validation, middleware, and services. |
| `frontend/src/App.jsx` | Browser-router and route definitions. |
| `frontend/src/main.jsx` | React application entry point and global-style imports. |

## Installation

```bash
git clone https://github.com/vikashkr1712/EduMaster.git
cd EduMaster
npm install
npm --prefix frontend install
npm --prefix backend install
```

Start the application in two terminals:

```bash
npm run dev:frontend
```

```bash
npm run dev:backend
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

Environment configuration is stored in `frontend/.env` and `backend/.env`. Review the values for the target environment before starting the application.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev:frontend` | Starts the frontend development server. |
| `npm run dev:backend` | Starts the backend development server. |
| `npm run build` | Creates an optimized production build in `frontend/dist/`. |
| `npm --prefix backend test` | Runs the backend test suite. |

## Routes

| Route | Purpose | Component |
| --- | --- | --- |
| `/` | Landing page with platform highlights and content sections. | `Home` |
| `/courses` | Searchable, filterable, sortable, and paginated course catalogue. | `CoursesPage` |
| `/events` | Events overview. | `EventsPage` |
| `/services` | Services overview with pricing and FAQ content. | `ServicesPage` |
| `/programs` | Legacy Events URL that redirects to the Events page. | `Navigate` → `/events` |
| `/testimonials` | Learner testimonials and related statistics. | `Testimonials` |
| `/about` | Platform story, mission, and statistics. | `About` |
| `/contact` | Contact details and map illustration. | `Contact` |
| `/login` | Account login UI. | `LoginPage` |
| `/signup` | Account registration UI. | `SignupPage` |

## Responsive Design

Layouts adapt for desktop, tablet, and mobile screens through CSS media queries and responsive navigation. Shared breakpoints are defined at `1200px`, `992px`, `768px`, and `560px`; page-specific styles add adjustments from `1400px` down to `360px`. Animated areas include reduced-motion styles.

## Browser Support

| Area | Support |
| --- | --- |
| Browsers | Targeted for current releases of Chrome, Edge, Firefox, and Safari; no formal test matrix is configured. |
| Responsive layouts | Media-query coverage extends down to `360px`; no formal browser or device test matrix is configured. |

## Major Components

| Component group | Description |
| --- | --- |
| `Home/Navbar` and `Home/Footer` | Shared site navigation, mobile menu, and footer. |
| `Courses/*` | Course hero, filters sidebar, grid/cards, pagination, illustrations, and request banner. |
| `Services/*` | Service presentation, pricing, process, stats, FAQ, and call-to-action sections. |
| `Events/*` | Event hero, cards, benefits, process, and stats. |
| `Auth/*` | Shared auth layout, fields, social buttons, and login/signup cards. |
| `Testimonials/*` | Testimonial hero, cards, statistics, and call to action. |
| `Contact/*` and `about/*` | Contact information/map and About-page sections. |

## SVG Assets

Illustrations are organized as React SVG components in `frontend/src/assets/svg/` by page area (`about`, `auth`, `contact`, `courses`, `events`, `home`, `services`, and `testimonials`).

## Development Workflow

Suggested contribution flow:

```text
Desktop implementation
        ↓
Tablet refinement
        ↓
Mobile refinement
        ↓
Performance review
        ↓
Production build verification
```

## Deployment

**Current status:** Not deployed.

As a Vite static frontend, EduMaster can be deployed to platforms such as [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) after a production build.

## Future Improvements

- Expand browser-level end-to-end coverage.
- Add deployment automation for the frontend and backend.
- Add more reporting and course-authoring workflows.

## Performance Notes

- Route-level lazy loading is configured in `App.jsx`.
- Course filtering and sorting are memoized, and only the current paginated course slice is rendered.
- The interface uses local SVG assets, avoiding image-network requests for its illustrations.
- Animations include reduced-motion handling through CSS and Framer Motion hooks.

## Credits

- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vite](https://vite.dev/)
- Icons and illustrations: project-local inline SVG and SVG component assets; no external attribution is specified in the repository.

## License

License not specified. Add a license file to define usage terms.
