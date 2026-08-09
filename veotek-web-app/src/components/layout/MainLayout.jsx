// ======================================================
// Layout Imports
// ======================================================

import ScrollToTopButton from "../common/ScrollToTopButton";
import Footer from "./Footer";
import Navbar from "./Navbar";

// ======================================================
// Main Layout
// ======================================================

export default function MainLayout({ children }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-hidden bg-[#030311] text-white">
      {/* ==================================================
          Decorative Background
      ================================================== */}

      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Base Background */}
        <div className="absolute inset-0 bg-[#030311]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

        {/* Top Glow */}
        <div
          className="
            absolute
            -left-20
            -top-20
            h-[260px]
            w-[260px]
            rounded-full
            bg-cyan-500/10
            blur-[70px]

            sm:-left-28
            sm:-top-28
            sm:h-[380px]
            sm:w-[380px]
            sm:blur-[90px]

            lg:h-[500px]
            lg:w-[500px]
            lg:blur-[120px]
          "
        />

        {/* Centre Glow */}
        <div
          className="
            absolute
            left-1/2
            top-1/3
            h-[220px]
            w-[220px]
            -translate-x-1/2
            rounded-full
            bg-blue-500/10
            blur-[70px]

            sm:h-[320px]
            sm:w-[320px]
            sm:blur-[90px]

            lg:blur-[110px]
          "
        />

        {/* Bottom Glow */}
        <div
          className="
            absolute
            -bottom-20
            -right-20
            h-[260px]
            w-[260px]
            rounded-full
            bg-purple-500/10
            blur-[70px]

            sm:-bottom-28
            sm:-right-28
            sm:h-[380px]
            sm:w-[380px]
            sm:blur-[90px]

            lg:h-[500px]
            lg:w-[500px]
            lg:blur-[120px]
          "
        />

        {/* Radial Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_40%)]" />
      </div>

      {/* ==================================================
          Navigation
      ================================================== */}

      <div className="relative z-30">
        <Navbar />
      </div>

      {/* ==================================================
          Page Content
      ================================================== */}

      <main className="relative z-10 flex-1">
        {children}
      </main>

      {/* ==================================================
          Footer
      ================================================== */}

      <div className="relative z-10">
        <Footer />
      </div>

      {/* ==================================================
          Scroll To Top
      ================================================== */}

      <ScrollToTopButton />
    </div>
  );
}