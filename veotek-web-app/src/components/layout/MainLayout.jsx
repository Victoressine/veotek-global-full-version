import { motion, useReducedMotion } from "framer-motion";

import ScrollToTopButton from "../common/ScrollToTopButton";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  const shouldReduceMotion = useReducedMotion();

  const pageAnimation = shouldReduceMotion
    ? {
        initial: false,
        animate: { opacity: 1 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        },
      };

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-hidden bg-[#030311] text-white">
      {/* Decorative background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
      >
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

        {/* Top glow */}
        <div className="absolute left-0 top-0 h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-[100px] sm:h-[420px] sm:w-[420px] lg:h-[500px] lg:w-[500px] lg:blur-[140px]" />

        {/* Centre glow */}
        <div className="absolute left-1/2 top-1/3 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px] sm:h-[320px] sm:w-[320px] lg:blur-[120px]" />

        {/* Bottom glow */}
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-purple-500/10 blur-[100px] sm:h-[420px] sm:w-[420px] lg:h-[500px] lg:w-[500px] lg:blur-[140px]" />

        {/* Radial overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_40%)]" />
      </div>

      {/* Site navigation */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* Page content */}
      <motion.div
        initial={pageAnimation.initial}
        animate={pageAnimation.animate}
        transition={pageAnimation.transition}
        className="relative z-10 flex-1"
      >
        {children}
      </motion.div>

      {/* Site footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Scroll-to-top control */}
      <ScrollToTopButton />
    </div>
  );
}