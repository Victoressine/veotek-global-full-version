import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import Container from "../common/Container";
import TestimonialCarousel from "../testimonials/TestimonialCarousel";
import testimonialService from "../../services/testimonialService";

const FEATURED_TESTIMONIAL_LIMIT = 6;

async function getHomepageTestimonials() {
  const allTestimonials = await testimonialService.getTestimonials();

  if (!Array.isArray(allTestimonials)) {
    return [];
  }

  const featuredTestimonials = allTestimonials.filter(
    (testimonial) => testimonial.featured === true,
  );

  const remainingTestimonials = allTestimonials.filter(
    (testimonial) => testimonial.featured !== true,
  );

  return [...featuredTestimonials, ...remainingTestimonials].slice(
    0,
    FEATURED_TESTIMONIAL_LIMIT,
  );
}

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();

  const [testimonials, setTestimonials] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isRetrying, setIsRetrying] = useState(false);

  const [loadError, setLoadError] = useState("");

  const loadTestimonials = useCallback(async ({ retry = false } = {}) => {
    if (retry) {
      setIsRetrying(true);
    }

    setLoadError("");

    try {
      const testimonialData = await getHomepageTestimonials();

      setTestimonials(testimonialData);
    } catch (error) {
      console.error("Unable to load homepage testimonials:", error);

      setLoadError(
        error instanceof Error
          ? error.message
          : "We could not load the client testimonials.",
      );
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const initialiseTestimonials = async () => {
      try {
        const testimonialData = await getHomepageTestimonials();

        if (!isCancelled) {
          setTestimonials(testimonialData);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Unable to initialise homepage testimonials:", error);

          setLoadError(
            error instanceof Error
              ? error.message
              : "We could not load the client testimonials.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    initialiseTestimonials();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleRetry = () => {
    loadTestimonials({
      retry: true,
    });
  };
  return (
    <section
      className="relative isolate overflow-hidden bg-[#030311] py-20 sm:py-24 lg:py-32"
      aria-labelledby="home-testimonials-heading"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <div className="absolute left-[-14rem] top-[15%] h-[34rem] w-[34rem] rounded-full bg-indigo-500/[0.09] blur-[170px]" />

        <div className="absolute bottom-[-16rem] right-[-12rem] h-[36rem] w-[36rem] rounded-full bg-cyan-500/[0.08] blur-[180px]" />

        <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/[0.04] blur-[150px]" />
      </div>

      {/* Grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
      </div>

      <Container className="relative z-10 max-w-[1300px]">
        {/* Section heading */}
        <motion.div
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 28,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-[1600px] text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cyan-300 backdrop-blur-xl sm:text-xs">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]"
            />
            Client Testimonials
          </div>

          <h2
            id="home-testimonials-heading"
            className="text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Trusted by Businesses That Expect More
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
            Discover what clients say about partnering with VeoTek to create
            secure, scalable, and impactful software solutions.
          </p>
        </motion.div>

        {/* Sliding carousel */}
        <motion.div
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 38,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.12,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.75,
            delay: prefersReducedMotion ? 0 : 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-14 sm:mt-16 lg:mt-20"
        >
          <TestimonialCarousel
            testimonials={testimonials}
            isLoading={isLoading}
            isRetrying={isRetrying}
            error={loadError}
            onRetry={handleRetry}
            cardVariant="homepage"
            emptyMessage="Client testimonials will appear here soon."
            ariaLabel="Featured client testimonials"
          />
        </motion.div>
      </Container>
    </section>
  );
}
