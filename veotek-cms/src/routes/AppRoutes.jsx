// ======================================================
// React Router Imports
// ======================================================

import { Navigate, Outlet, Route, Routes } from "react-router-dom";

// ======================================================
// Layout Imports
// ======================================================

import DashboardLayout from "../layouts/DashboardLayout";

// ======================================================
// Page Imports
// ======================================================

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Services from "../pages/Services";
import TestimonialSubmissions from "../pages/TestimonialSubmissions";

// ======================================================
// Route Protection Imports
// ======================================================

import ProtectedRoute from "./ProtectedRoute";

// ======================================================
// Reusable Placeholder Page
// ======================================================

function PlaceholderPage({ title, description }) {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>

      <p className="max-w-2xl text-sm leading-6 text-muted sm:text-base">
        {description}
      </p>
    </section>
  );
}

// ======================================================
// Protected Dashboard Layout
// ======================================================

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// ======================================================
// Application Routes
// ======================================================

export default function AppRoutes() {
  return (
    <Routes>
      {/* ==================================================
          Public Routes
      ================================================== */}

      <Route path="/login" element={<Login />} />

      {/* ==================================================
          Protected CMS Routes
      ================================================== */}

      <Route element={<ProtectedLayout />}>
        {/* Default Protected Route */}

        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}

        <Route path="/dashboard" element={<Dashboard />} />

        {/* Services */}

        <Route path="/services" element={<Services />} />

        <Route
          path="/testimonial-submissions"
          element={<TestimonialSubmissions />}
        />
        {/* Portfolio Management */}

        <Route
          path="/portfolio"
          element={
            <PlaceholderPage
              title="Portfolio"
              description="Manage projects and case studies."
            />
          }
        />

        {/* Blog Management */}

        <Route
          path="/blog"
          element={
            <PlaceholderPage
              title="Blog"
              description="Create, edit and publish articles."
            />
          }
        />

        {/* Team Management */}

        <Route
          path="/team"
          element={
            <PlaceholderPage
              title="Team"
              description="Manage team member profiles."
            />
          }
        />

        {/* Contact Messages */}

        <Route
          path="/messages"
          element={
            <PlaceholderPage
              title="Messages"
              description="Review contact form submissions from the public website."
            />
          }
        />

        {/* CMS Settings */}

        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="Settings"
              description="Manage company details, website settings and CMS preferences."
            />
          }
        />
      </Route>

      {/* ==================================================
          Fallback Route
      ================================================== */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
