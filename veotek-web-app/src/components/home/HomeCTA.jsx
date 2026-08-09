import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Container from "../common/Container";

const revealTransition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1],
};

export default function HomeCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden pb-24 pt-10 sm:pb-28 lg:pb-32"
      aria-labelledby="homepage-cta-heading"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.08] blur-[180px]" />

        <div className="absolute -bottom-44 -left-32 h-[30rem] w-[30rem] rounded-full bg-blue-500/[0.08] blur-[160px]" />

        <div className="absolute -right-40 top-0 h-[32rem] w-[32rem] rounded-full bg-indigo-500/[0.06] blur-[170px]" />
      </div>

      <Container className="relative z-10 max-w-[1400px]">
        <motion.div
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 40,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={revealTransition}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#07111f]/80 px-6 py-14 text-center shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:rounded-[40px] sm:px-10 sm:py-16 lg:px-20 lg:py-24"
        >
          {/* Animated central glow */}
          <motion.div
            aria-hidden="true"
            animate={
              prefersReducedMotion
                ? {
                    scale: 1,
                    opacity: 0.3,
                  }
                : {
                    scale: [1, 1.08, 1],
                    opacity: [0.25, 0.45, 0.25],
                  }
            }
            transition={
              prefersReducedMotion
                ? {
                    duration: 0,
                  }
                : {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[170px]"
          />

          {/* Grid texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-80"
          />

          {/* Side glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[110px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[110px]"
          />

          {/* Top highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
          />

          {/* Bottom highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
          />

          <div className="relative z-10 mx-auto max-w-[1300px]">
            <p className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400 sm:text-xs">
              Build With VeoTek Global
            </p>

            <h2
              id="homepage-cta-heading"
              className="mx-auto mt-8 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Let&apos;s Build Your Next
              <span className="gradient-text"> Digital Solution</span>
            </h2>

            <p className="mx-auto mt-8 max-w-5xl text-base leading-8 text-muted sm:text-lg">
              Whether you are launching a new product, modernizing legacy
              software, or scaling enterprise operations, our team is ready to
              help you build secure, scalable, and high-performing software that
              supports measurable business growth.
            </p>

            {/* CTA actions */}
            <div className="mt-12 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <Link
                to="/contact"
                className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 text-sm font-semibold text-white shadow-[0_12px_45px_rgba(34,211,238,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(34,211,238,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f] sm:min-w-[220px] sm:w-auto"
              >
                Start Your Project
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/services"
                className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-8 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f] sm:min-w-[220px] sm:w-auto"
              >
                Explore Services
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
