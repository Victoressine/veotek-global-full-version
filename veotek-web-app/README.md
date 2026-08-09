# VeoTek Global Website

The official public website for **VeoTek Global**, a software development company focused on building modern, scalable, secure, and user-friendly digital solutions for businesses and organizations.

This project presents VeoTek Global’s services, portfolio, company information, mission, team, blog content, and contact channels through a responsive and high-performance web experience.

---

## Overview

The VeoTek Global website is a standalone frontend application built with React, Vite, and Tailwind CSS.

It is designed to:

- Present VeoTek Global’s services and capabilities
- Showcase completed projects and case studies
- Publish company insights and blog articles
- Introduce the company’s mission, values, and team
- Help potential clients contact VeoTek Global
- Provide a responsive experience across desktop, tablet, and mobile devices

The public website is maintained separately from the VeoTek Enterprise Portal and backend services.

---

## Features

- Responsive modern user interface
- Reusable React components
- Client-side routing
- Lazy-loaded pages
- Animated page transitions and interface elements
- Services and service-detail pages
- Portfolio and case-study pages
- Blog and blog-detail pages
- Company, mission, and team pages
- Contact page
- Privacy policy and terms pages
- Custom 404 page
- Search-engine-friendly page structure
- Production-ready Vite build
- ESLint code-quality checks

---

## Technology Stack

- **React 19** — Component-based frontend development
- **Vite 8** — Development server and production build tool
- **Tailwind CSS 3** — Utility-first styling
- **React Router DOM 7** — Client-side navigation and routing
- **Framer Motion** — Animations and transitions
- **Lucide React** — Interface icons
- **React Icons** — Brand and social-media icons
- **ESLint** — Code-quality and consistency checks
- **PostCSS** — CSS processing
- **Autoprefixer** — Browser compatibility for CSS

---

## Project Structure

veotek-web-app/
├── public/
│   └── Static public assets
│
├── src/
│   ├── assets/
│   │   └── Images and media files
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── home/
│   │   ├── layout/
│   │   └── Reusable interface components
│   │
│   ├── data/
│   │   └── Static application data
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Mission.jsx
│   │   ├── Team.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetails.jsx
│   │   ├── Portfolio.jsx
│   │   ├── CaseStudy.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogDetails.jsx
│   │   ├── Contact.jsx
│   │   ├── Privacy.jsx
│   │   ├── Terms.jsx
│   │   └── NotFound.jsx
│   │
│   ├── routes/
│   │   └── Application routing
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js