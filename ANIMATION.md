# ANIMATION_GUIDE.md

# EduMaster Animation Guide

## Objective

The purpose of animations is to enhance the user experience without distracting the user.

Animations should feel modern, smooth and premium, similar to:

- Apple
- Stripe
- Linear
- Framer
- Notion
- Vercel

Avoid flashy or excessive movement.

---

# General Rules

Never redesign the UI.

Never modify:

- Layout
- Spacing
- Typography
- Colors
- Border Radius
- Responsive Behaviour

Only improve motion.

---

# Animation Library

Use Framer Motion.

Reuse existing motion utilities.

Do NOT install:

- GSAP
- Anime.js
- AOS
- ScrollReveal
- Other animation libraries

---

# Performance Rules

Maintain 60 FPS.

Use GPU accelerated properties only.

Animate:

- opacity
- transform
- translate
- scale
- rotate

Avoid animating:

- width
- height
- top
- left
- right
- bottom
- margin
- padding

Support:

prefers-reduced-motion

Use:

viewport={{ once: true }}

Use LazyMotion when appropriate.

Reuse MotionConfig.

Avoid unnecessary re-renders.

---

# Timing

Page entrance

0.5–0.8s

Section entrance

0.4–0.6s

Hover

0.2–0.3s

Button press

0.1–0.15s

Loop animations

4–8 seconds

Never use extremely fast or abrupt animations.

---

# Easing

Prefer

easeOut

easeInOut

spring

Use gentle spring values.

Avoid bouncy animations unless specifically requested.

---

# Stagger

Container

0.05–0.08s

Cards

0.08–0.12s

Icons

0.03–0.05s

---

# Page Load

Every page should:

Navbar

↓

Hero

↓

Content Sections

↓

Footer

Animate sequentially.

Do not animate the entire page simultaneously.

---

# Navbar

Animate

- Fade Down
- Slight Blur → Clear
- Stagger Navigation Items
- Underline Slide
- Button Hover
- Mobile Drawer Slide

---

# Hero Section

Animate

Heading

Fade Up

Subtitle

Fade Up

Buttons

Scale

Hover Lift

Arrow Slide

Statistics

Count Up

Stagger

Hero SVG

Micro Animations

---

# SVG Animation Rules

Never replace SVG.

Never resize SVG.

Never stretch SVG.

Animate only SVG groups.

Preferred micro animations:

Girl/Boy

- breathing

Eyes

- blink

Hair

- slight sway

Laptop

- screen glow

Books

- floating

Plant

- leaf sway

Graduation Cap

- floating

Charts

- grow

Line Graph

- draw path

Certificate

- shine

Chat Bubble

- floating

Dots

- random floating

Background Shapes

- slow floating

Everything should move slowly and naturally.

---

# Cards

Entrance

Fade Up

TranslateY

Stagger

Hover

Lift

Soft Shadow

Image Zoom (if applicable)

Button Arrow Slide

---

# Buttons

Hover

- lift
- shadow
- arrow translate

Press

- slight scale

Focus

- visible accessibility state

---

# Forms

Inputs

Focus Glow

Error Shake

Success Pulse

Password Visibility

Smooth Toggle

Checkbox

Smooth Check

---

# Counters

Animate from

0

to target value.

Run once.

---

# Testimonials

Cards

Fade

Stagger

Hover Lift

Quote Icon

Slight Rotation

Stars

Subtle Shimmer

Carousel

Smooth Transition

Pause on Hover

---

# Company Logos

Continuous Marquee

Pause on Hover

Fade Edges

---

# Timeline

Connector Line

Draw Animation

Steps

Fade

Stagger

Icons

Scale

---

# FAQ

Accordion

Smooth Expand

Chevron Rotate

Content Fade

---

# Pricing Cards

Hover Lift

Glow

Popular Badge Pulse

CTA Button Hover

---

# Footer

Fade Up

Stagger Columns

Social Icons

Scale

Rotate Slightly

Newsletter

Input Focus

Button Hover

---

# Responsive Rules

Desktop

Full animation

Tablet

Slightly reduced movement

Mobile

Minimal movement

Avoid excessive floating.

Keep performance smooth.

---

# Accessibility

Respect

prefers-reduced-motion

If enabled

Disable loop animations.

Keep essential transitions only.

---

# Code Reuse

Reuse

motionVariants.js

Reuse

useCounter.js

Reuse

useReducedMotion.js

Never duplicate variants.

---

# Quality Checklist

Before finishing any page verify:

✓ No layout shift

✓ No CLS

✓ Responsive unchanged

✓ SVG not distorted

✓ 60 FPS

✓ No console errors

✓ No duplicate variants

✓ Reusable code

✓ Premium feel

✓ Performance maintained

---

# Workflow

For every task:

1. Read only required files.

2. Implement requested animations.

3. Reuse existing variants.

4. Verify responsiveness.

5. Print modified files.

6. STOP.

Never continue automatically.