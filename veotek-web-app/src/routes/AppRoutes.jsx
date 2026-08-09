import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import About from "../pages/About";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import CaseStudy from "../pages/CaseStudy";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import Mission from "../pages/Mission";
import NotFound from "../pages/NotFound";
import Portfolio from "../pages/Portfolio";
import Privacy from "../pages/Privacy";
import ServiceDetails from "../pages/ServiceDetails";
import Services from "../pages/Services";
import Team from "../pages/Team";
import Terms from "../pages/Terms";
import Testimonials from "../pages/Testimonials";

/**
 * Scrolls every newly opened page to the top.
 */
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [location.pathname]);

  return null;
}

/**
 * Defines all public application routes.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />

      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />

        {/* Our Company */}
        <Route path="/about" element={<About />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/team" element={<Team />} />
        <Route
          path="/testimonials"
          element={<Testimonials />}
        />

        {/* Services */}
        <Route path="/services" element={<Services />} />
        <Route
          path="/services/:slug"
          element={<ServiceDetails />}
        />

        {/* Portfolio */}
        <Route path="/portfolio" element={<Portfolio />} />
        <Route
          path="/portfolio/:slug"
          element={<CaseStudy />}
        />

        {/* Blog */}
        <Route path="/blog" element={<Blog />} />
        <Route
          path="/blog/:slug"
          element={<BlogDetails />}
        />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Legal */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function AppRoutes() {
  return <AnimatedRoutes />;
}