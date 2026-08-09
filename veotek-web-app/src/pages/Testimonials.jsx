import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";
import Container from "../components/common/Container";
import Reveal from "../components/common/Reveal";

import TestimonialCarousel from "../components/testimonials/TestimonialCarousel";
import TestimonialSubmissionForm from "../components/testimonials/TestimonialSubmissionForm";
import testimonialService from "../services/testimonialService";

const TESTIMONIAL_LOAD_ERROR =
  "We could not load the testimonials. Please try again.";

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();
  const isMountedRef = useRef(false);

  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    isMountedRef.current = true;
    let isCancelled = false;

    const initialiseTestimonials = async () => {
      try {
        const testimonialData = await testimonialService.getTestimonials();

        if (isCancelled || !isMountedRef.current) {
          return;
        }

        setTestimonials(Array.isArray(testimonialData) ? testimonialData : []);
      } catch (error) {
        if (isCancelled || !isMountedRef.current) {
          return;
        }

        console.error("Unable to load the testimonials page:", error);

        setLoadError(
          error instanceof Error ? error.message : TESTIMONIAL_LOAD_ERROR,
        );
      } finally {
        if (!isCancelled && isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    void initialiseTestimonials();

    return () => {
      isCancelled = true;
      isMountedRef.current = false;
    };
  }, []);

  const retryTestimonials = useCallback(async () => {
    if (isRetrying) {
      return;
    }

    setIsRetrying(true);
    setLoadError("");

    try {
      const testimonialData = await testimonialService.getTestimonials();

      if (!isMountedRef.current) {
        return;
      }

      setTestimonials(Array.isArray(testimonialData) ? testimonialData : []);
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }

      console.error("Unable to retry loading testimonials:", error);

      setLoadError(
        error instanceof Error ? error.message : TESTIMONIAL_LOAD_ERROR,
      );
    } finally {
      if (isMountedRef.current) {
        setIsRetrying(false);
      }
    }
  }, [isRetrying]);

  const testimonialCount = useMemo(() => testimonials.length, [testimonials]);
  return (
    <MainLayout>
      <main id="main-content">
        {/* SHARED TESTIMONIAL CAROUSEL */}
        <section
          id="client-stories"
          className="relative isolate scroll-mt-28 overflow-hidden bg-[#030311] py-20 sm:py-24 lg:py-32"
          aria-labelledby="page-testimonials-heading"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-20"
          >
            <div className="absolute left-[-14rem] top-[15%] h-[34rem] w-[34rem] rounded-full bg-indigo-500/[0.09] blur-[170px]" />

            <div className="absolute bottom-[-16rem] right-[-12rem] h-[36rem] w-[36rem] rounded-full bg-cyan-500/[0.08] blur-[180px]" />

            <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/[0.04] blur-[150px]" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-30"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
          </div>

          <Container className="relative z-10 max-w-[1300px]">
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
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cyan-300 backdrop-blur-xl sm:text-xs">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]"
                />
                What Our Clients Say
              </div>

              <h2
                id="page-testimonials-heading"
                className="text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-4xl md:text-5xl lg:text-6xl"
              >
                Trusted by Businesses That Expect More
              </h2>

              <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-slate-400 sm:text-lg">
                Real experiences from clients who trusted VeoTek Global to
                deliver dependable, scalable, and impactful software solutions.
              </p>

              {!isLoading && !loadError && (
                <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-slate-400 backdrop-blur-xl">
                  <CheckCircle2
                    size={18}
                    className="text-cyan-400"
                    aria-hidden="true"
                  />

                  <span>
                    {testimonialCount}{" "}
                    {testimonialCount === 1 ? "testimonial" : "testimonials"}
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 32,
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
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-14 sm:mt-16 lg:mt-20"
            >
              <div aria-live="polite" aria-busy={isLoading}>
                <TestimonialCarousel
                  testimonials={testimonials}
                  isLoading={isLoading}
                  isRetrying={isRetrying}
                  error={loadError}
                  onRetry={retryTestimonials}
                  cardVariant="page"
                  emptyMessage="Be the first to share your experience with VeoTek Global."
                  ariaLabel="All client testimonials"
                />
              </div>
            </motion.div>
          </Container>
        </section>

        {/* SUBMISSION FORM */}
        <section
          id="submit-testimonial"
          className="relative scroll-mt-28 overflow-x-hidden bg-[#030311] py-20 sm:py-24 lg:py-32"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,59,255,0.1),transparent_42%)]"
          />

          <div
            aria-hidden="true"
            className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/[0.08] blur-[150px]"
          />

          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-500/[0.08] blur-[150px]"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20"
          />

          <Container className="relative z-10 max-w-[1500px]">
            <div className="grid items-start gap-12 xl:grid-cols-[0.72fr_1.28fr] xl:gap-16">
              <Reveal>
                <div className="xl:sticky xl:top-32">
                  <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                      Your Story Matters
                    </span>
                  </div>

                  <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Share Your Experience With
                    <span className="gradient-text"> VeoTek Global</span>
                  </h2>

                  <p className="mt-7 text-sm leading-8 text-slate-400 sm:text-base">
                    Your feedback helps us improve and gives future clients a
                    clearer understanding of what it is like to work with our
                    software development team.
                  </p>

                  <div className="mt-10 space-y-4">
                    {[
                      {
                        icon: ShieldCheck,
                        title: "Privacy Respected",
                        text: "Your email address is never displayed publicly.",
                      },
                      {
                        icon: MessageSquareQuote,
                        title: "Authentic Experiences",
                        text: "Share honest feedback about your project and experience.",
                      },
                      {
                        icon: Sparkles,
                        title: "Simple Submission",
                        text: "Complete the form and preview your testimonial instantly.",
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <motion.div
                          key={item.title}
                          whileHover={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  x: 6,
                                }
                          }
                          transition={{
                            duration: 0.25,
                          }}
                          className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300">
                            <Icon
                              size={20}
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                          </div>

                          <div>
                            <h3 className="font-bold text-white">
                              {item.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {item.text}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>

              <div className="min-w-0">
                <TestimonialSubmissionForm />
              </div>
            </div>
          </Container>
        </section>
      </main>
    </MainLayout>
  );
}
