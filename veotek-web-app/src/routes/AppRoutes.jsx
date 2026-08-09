// ======================================================
// React Imports
// ======================================================

import {
  lazy,
  Suspense,
  useEffect,
} from "react";

import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

// ======================================================
// Primary Route
// ======================================================

// Keep the homepage eagerly loaded because it is the
// first page most visitors open.
import Home from "../pages/Home";

// ======================================================
// Lazy-Loaded Routes
// ======================================================

// Load secondary pages only when users navigate to them.
// This reduces the initial JavaScript bundle and improves
// loading performance on mobile devices, especially Safari.

const About = lazy(
  () => import("../pages/About"),
);

const Blog = lazy(
  () => import("../pages/Blog"),
);

const BlogDetails = lazy(
  () => import("../pages/BlogDetails"),
);

const CaseStudy = lazy(
  () => import("../pages/CaseStudy"),
);

const Contact = lazy(
  () => import("../pages/Contact"),
);

const Mission = lazy(
  () => import("../pages/Mission"),
);

const NotFound = lazy(
  () => import("../pages/NotFound"),
);

const Portfolio = lazy(
  () => import("../pages/Portfolio"),
);

const Privacy = lazy(
  () => import("../pages/Privacy"),
);

const ServiceDetails = lazy(
  () => import("../pages/ServiceDetails"),
);

const Services = lazy(
  () => import("../pages/Services"),
);

const Team = lazy(
  () => import("../pages/Team"),
);

const Terms = lazy(
  () => import("../pages/Terms"),
);

const Testimonials = lazy(
  () => import("../pages/Testimonials"),
);

// ======================================================
// Scroll To Top
// ======================================================

/**
 * Scrolls every newly opened page to the top.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

// ======================================================
// Page Loading Fallback
// ======================================================

/**
 * Displayed while a lazy-loaded route is downloading.
 */
function PageLoadingFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#030311] px-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="size-9 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400"
          aria-hidden="true"
        />

        <p className="text-sm text-white/70">
          Loading...
        </p>
      </div>
    </div>
  );
}

// ======================================================
// Application Routes
// ======================================================

/**
 * Defines all public application routes.
 */
function ApplicationRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes
        location={location}
        key={location.pathname}
      >
        {/* ==================================================
            Home
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ==================================================
            Our Company
        ================================================== */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/mission"
          element={<Mission />}
        />

        <Route
          path="/team"
          element={<Team />}
        />

        <Route
          path="/testimonials"
          element={<Testimonials />}
        />

        {/* ==================================================
            Services
        ================================================== */}

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/services/:slug"
          element={<ServiceDetails />}
        />

        {/* ==================================================
            Portfolio
        ================================================== */}

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />

        <Route
          path="/portfolio/:slug"
          element={<CaseStudy />}
        />

        {/* ==================================================
            Blog
        ================================================== */}

        <Route
          path="/blog"
          element={<Blog />}
        />

        <Route
          path="/blog/:slug"
          element={<BlogDetails />}
        />

        {/* ==================================================
            Contact
        ================================================== */}

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ==================================================
            Legal
        ================================================== */}

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

        {/* ==================================================
            Fallback / 404
        ================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Suspense>
  );
}

// ======================================================
// Main Routes Component
// ======================================================

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <ApplicationRoutes />
    </>
  );
}