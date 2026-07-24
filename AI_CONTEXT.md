# AI_CONTEXT.md

## Project Overview

Project Name: EduMaster

EduMaster is a modern, responsive EdTech platform built with React and Vite.

The UI is already completed.

Current work focuses on improving functionality, performance, code quality and animations.

Do NOT redesign existing pages unless explicitly instructed.

---

# Tech Stack

Frontend

- React 18
- Vite
- React Router DOM
- Framer Motion
- CSS
- Local SVG Components

Backend

- Not connected

Database

- Not connected

---

# Animation

Framer Motion is already installed.

Do NOT install:

- GSAP
- AOS
- Anime.js
- ScrollReveal
- Other animation libraries

Reuse Framer Motion everywhere.

---

# Existing Pages

Home

Courses

Events

Services

Testimonials

About

Contact

Login

Signup

---

# Design Rules

Never redesign UI.

Never modify layout.

Never modify typography.

Never modify colors.

Never modify spacing.

Never modify border radius.

Never change responsiveness.

Maintain pixel-perfect implementation.

Desktop first.

Tablet second.

Mobile third.

---

# SVG Rules

SVG illustrations are already available.

Use JSX SVG components.

Never replace SVGs with PNG or JPG.

Never use background images for illustrations.

Animate existing SVG groups whenever possible.

Preserve:

- viewBox
- gradients
- masks
- clipPaths
- filters

---

# Performance Rules

Maintain Lighthouse score above 95.

Use GPU accelerated animations.

Animate only:

- opacity
- transform
- translate
- rotate
- scale

Avoid animating:

- width
- height
- top
- left
- right
- bottom
- margin
- padding

Support prefers-reduced-motion.

Use viewport={{ once: true }} for entrance animations.

Prefer reusable variants.

---

# Token Optimization Rules

Never scan the entire repository.

Never build complete project context.

Never inspect node_modules.

Never inspect dist.

Never inspect build.

Never inspect .git.

Never inspect package-lock.json.

Never inspect unrelated pages.

Read only files required for the current task.

If additional files are required,

STOP

and ask before reading them.

Reuse existing components whenever possible.

Never duplicate animation logic.

---

# Working Style

Work on ONE page at a time.

Within a page, complete related sections before moving to another page.

After completing the requested task,

STOP.

Wait for the next instruction.

Do not continue automatically.

---

# Reusable Files

Prefer creating and reusing:

src/utils/motionVariants.js

src/hooks/useCounter.js

src/hooks/useReducedMotion.js

Do not recreate animation variants on every page.

---

# Current Project Status

UI

Completed

Responsive

Completed

SVG Conversion

Completed

Animations

In Progress

Backend

Pending

API Integration

Pending

Deployment

Pending

---

# Coding Standards

Use reusable React components.

Keep code modular.

Avoid duplicate logic.

Keep files clean.

Maintain existing naming conventions.

Avoid unnecessary dependencies.

Do not introduce breaking changes.

---

# Before Starting Any Task

Read only the files required for the current task.

Do not inspect unrelated files.

Do not analyze the entire project.

Implement only the requested feature.

After finishing,

Print:

- Modified files
- Summary of changes

Then STOP.