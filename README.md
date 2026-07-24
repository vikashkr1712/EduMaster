# EduMaster

> Modern, responsive EdTech platform built with React and Vite.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Configured-0055FF)
![Status](https://img.shields.io/badge/Status-Frontend%20Complete-success)

EduMaster is an educational-platform frontend for presenting courses, events, services, learner stories, and account entry screens. Its main objective is to provide a polished, navigable learning-platform experience with local content and interactive course discovery.

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
- Login and signup form UI, including social sign-in buttons and password visibility controls
- Local SVG illustrations and inline SVG icons
- Framer Motion and CSS animations with reduced-motion support

> Authentication, newsletter submission, and social sign-in are UI-only; this project does not include a backend integration.

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 18 |
| Backend | Not included |
| Database | Not included |
| Routing | React Router DOM |
| Animation | Framer Motion (already configured) and CSS animations |
| Icons | Project-local inline SVG icons and React SVG components |
| Build tool | Vite |
| Styling | Plain CSS with shared variables and responsive stylesheets |

## Folder Structure

```text
src/
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
├── svg/
├── App.jsx
└── main.jsx
```

The project does not currently contain `hooks/` or `utils/` directories. See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for a contributor-focused architecture guide.

## Project Structure Explanation

| Folder/file | Purpose |
| --- | --- |
| `src/assets/svg/` | Page-specific React SVG illustration components. |
| `src/components/` | Reusable page sections, cards, navigation, footer, and form components. |
| `src/data/` | Local data used for courses, services, events, testimonials, contact, about, and auth content. |
| `src/pages/` | Route-level page compositions. The Events route is implemented in `src/pages/Events/`. |
| `src/styles/` | Global styles, CSS variables, and shared responsive rules. |
| `src/svg/` | Standalone SVG illustration files. |
| `src/App.jsx` | Browser-router and route definitions. |
| `src/main.jsx` | React application entry point and global-style imports. |

## Installation

```bash
git clone https://github.com/vikashkr1712/EduMaster.git
cd EduMaster
npm install
npm run dev
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

No environment variables are required or referenced by the current project.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Creates an optimized production build in `dist/`. |
| `npm run preview` | Serves the production build locally for previewing. |

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

Illustrations are organized in `src/assets/svg/` by page area (`about`, `auth`, `contact`, `courses`, `events`, `home`, `services`, and `testimonials`). Additional standalone SVG files are kept in `src/svg/`.

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

- Connect authentication, social sign-in, and newsletter forms to real services.
- Load courses, services, events, and testimonials from an API or CMS.
- Add detail pages and enrolment flows for individual courses.
- Add automated tests and deployment configuration.

## Performance Notes

- Route-level lazy loading is not currently implemented; routes are eagerly imported by `App.jsx`.
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
