import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MessageSquareQuote,
  RefreshCw,
} from "lucide-react";

import TestimonialCard from "./TestimonialCard";

const AUTOPLAY_DELAY = 5000;
const SWIPE_THRESHOLD = 50;

function getVisibleCount() {
  if (typeof window === "undefined") {
    return 3;
  }

  if (window.innerWidth >= 1024) {
    return 3;
  }

  if (window.innerWidth >= 768) {
    return 2;
  }

  return 1;
}

function getVisibleTestimonials(testimonials, activeIndex, visibleCount) {
  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return [];
  }

  const numberOfVisibleCards = Math.min(visibleCount, testimonials.length);

  return Array.from({ length: numberOfVisibleCards }, (_, offset) => {
    const originalIndex = (activeIndex + offset) % testimonials.length;

    return {
      testimonial: testimonials[originalIndex],
      originalIndex,
    };
  });
}

function TestimonialSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[430px] animate-pulse overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-7 lg:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-4 w-4 rounded-full bg-white/10" />
          ))}
        </div>

        <div className="h-7 w-20 rounded-full bg-white/10" />
      </div>

      <div className="mt-8 h-10 w-10 rounded-xl bg-white/10" />

      <div className="mt-7 space-y-4">
        <div className="h-3 w-full rounded-full bg-white/10" />
        <div className="h-3 w-[94%] rounded-full bg-white/10" />
        <div className="h-3 w-[88%] rounded-full bg-white/10" />
        <div className="h-3 w-[96%] rounded-full bg-white/10" />
        <div className="h-3 w-[68%] rounded-full bg-white/10" />
      </div>

      <div className="my-8 h-px bg-white/10" />

      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 rounded-full bg-white/10" />

        <div className="flex-1 space-y-3">
          <div className="h-4 w-36 rounded-full bg-white/10" />
          <div className="h-3 w-28 rounded-full bg-white/10" />
          <div className="h-3 w-32 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, isRetrying, onRetry }) {
  return (
    <div
      role="alert"
      className="relative overflow-hidden rounded-[30px] border border-rose-400/20 bg-rose-400/[0.05] px-6 py-14 text-center backdrop-blur-xl sm:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-44 w-96 -translate-x-1/2 rounded-full bg-rose-400/10 blur-[110px]"
      />

      <div className="relative z-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
          <MessageSquareQuote size={30} strokeWidth={1.7} aria-hidden="true" />
        </div>

        <h3 className="mt-6 text-2xl font-bold text-white">
          Testimonials unavailable
        </h3>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          {message}
        </p>

        {typeof onRetry === "function" && (
          <button
            type="button"
            disabled={isRetrying}
            onClick={onRetry}
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-6 text-sm font-semibold text-rose-200 transition duration-300 hover:border-rose-300/40 hover:bg-rose-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030311] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              aria-hidden="true"
              className={isRetrying ? "animate-spin" : ""}
            />

            {isRetrying ? "Trying again..." : "Try again"}
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] px-6 py-14 text-center backdrop-blur-xl sm:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-44 w-96 -translate-x-1/2 rounded-full bg-cyan-400/[0.08] blur-[110px]"
      />

      <div className="relative z-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300">
          <MessageSquareQuote size={30} strokeWidth={1.7} aria-hidden="true" />
        </div>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          {message}
        </p>
      </div>
    </div>
  );
}

export default function TestimonialCarousel({
  testimonials = [],
  isLoading = false,
  isRetrying = false,
  error = "",
  onRetry,
  cardVariant = "homepage",
  emptyMessage = "Client testimonials will appear here soon.",
  ariaLabel = "Client testimonials",
}) {
  const prefersReducedMotion = useReducedMotion();

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [direction, setDirection] = useState(1);

  const [visibleCount, setVisibleCount] = useState(getVisibleCount);

  const [isPaused, setIsPaused] = useState(false);

const safeTestimonials = useMemo(
  () => (Array.isArray(testimonials) ? testimonials : []),
  [testimonials],
);
  const testimonialCount = safeTestimonials.length;

  const actualVisibleCount = Math.min(visibleCount, testimonialCount);

  const canSlide = testimonialCount > 1;

  const safeActiveIndex =
    testimonialCount === 0 ? 0 : activeIndex % testimonialCount;

  useEffect(() => {
    let animationFrameId;

    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        setVisibleCount(getVisibleCount());
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (testimonialCount <= 1) {
      return;
    }

    setDirection(1);

    setActiveIndex((currentIndex) => (currentIndex + 1) % testimonialCount);
  }, [testimonialCount]);

  const previousSlide = useCallback(() => {
    if (testimonialCount <= 1) {
      return;
    }

    setDirection(-1);

    setActiveIndex(
      (currentIndex) =>
        (currentIndex - 1 + testimonialCount) % testimonialCount,
    );
  }, [testimonialCount]);

  const goToSlide = useCallback(
    (index) => {
      if (index < 0 || index >= testimonialCount || index === safeActiveIndex) {
        return;
      }

      setDirection(index > safeActiveIndex ? 1 : -1);

      setActiveIndex(index);
    },
    [safeActiveIndex, testimonialCount],
  );

  useEffect(() => {
    if (!canSlide || isPaused || prefersReducedMotion) {
      return undefined;
    }

    const intervalId = window.setInterval(nextSlide, AUTOPLAY_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [canSlide, isPaused, nextSlide, prefersReducedMotion]);

  const visibleTestimonials = useMemo(
    () =>
      getVisibleTestimonials(safeTestimonials, safeActiveIndex, visibleCount),
    [safeActiveIndex, safeTestimonials, visibleCount],
  );

  const handleKeyDown = (event) => {
    if (!canSlide) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextSlide();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousSlide();
    }

    if (event.key === "Home") {
      event.preventDefault();
      goToSlide(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      goToSlide(testimonialCount - 1);
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;

    touchEndX.current = null;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    const startX = touchStartX.current;
    const endX = touchEndX.current;

    touchStartX.current = null;
    touchEndX.current = null;

    if (startX === null || endX === null) {
      return;
    }

    const swipeDistance = startX - endX;

    if (Math.abs(swipeDistance) < SWIPE_THRESHOLD) {
      return;
    }

    if (swipeDistance > 0) {
      nextSlide();
    } else {
      previousSlide();
    }
  };

  const slideVariants = {
    enter: (slideDirection) => ({
      opacity: 0,
      x: slideDirection > 0 ? 90 : -90,
      scale: 0.98,
    }),

    center: {
      opacity: 1,
      x: 0,
      scale: 1,
    },

    exit: (slideDirection) => ({
      opacity: 0,
      x: slideDirection > 0 ? -90 : 90,
      scale: 0.98,
    }),
  };

  if (isLoading) {
    return (
      <>
        <p className="sr-only" role="status">
          Loading client testimonials.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from(
            {
              length: visibleCount === 1 ? 1 : visibleCount,
            },
            (_, index) => {
              const isFeatured = visibleCount === 3 && index === 1;

              return (
                <div
                  key={index}
                  className={isFeatured ? "lg:-translate-y-5" : ""}
                >
                  <TestimonialSkeleton />
                </div>
              );
            },
          )}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <ErrorState message={error} isRetrying={isRetrying} onRetry={onRetry} />
    );
  }

  if (testimonialCount === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative outline-none"
    >
      <div className="relative px-1 py-7 sm:px-2 lg:px-4 lg:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.08] blur-[100px]"
        />

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`${safeActiveIndex}-${actualVisibleCount}`}
            custom={direction}
            variants={slideVariants}
            initial={prefersReducedMotion ? false : "enter"}
            animate="center"
            exit={prefersReducedMotion ? undefined : "exit"}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleTestimonials.map(
              ({ testimonial, originalIndex }, position) => {
                const isFeatured = actualVisibleCount === 3 && position === 1;

                return (
                  <motion.div
                    key={`${testimonial.id ?? originalIndex}-${safeActiveIndex}-${position}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Testimonial ${
                      originalIndex + 1
                    } of ${testimonialCount}`}
                    initial={
                      prefersReducedMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 24,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: isFeatured ? -20 : 0,
                      scale: isFeatured ? 1.035 : 1,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.5,
                      delay: prefersReducedMotion ? 0 : position * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full"
                  >
                    <TestimonialCard
                      testimonial={testimonial}
                      variant={cardVariant}
                      featured={isFeatured}
                    />
                  </motion.div>
                );
              },
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {canSlide && (
        <div className="mt-6 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Show previous testimonials"
            className="group inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white backdrop-blur-xl transition-all duration-300 hover:-translate-x-1 hover:border-cyan-400/40 hover:bg-cyan-400/[0.1] hover:text-cyan-200 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030311]"
          >
            <ArrowLeft
              size={20}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </button>

          <div
            className="flex flex-wrap items-center justify-center gap-2"
            aria-label="Testimonial navigation"
          >
            {safeTestimonials.map((testimonial, index) => {
              const isActive = safeActiveIndex === index;

              return (
                <button
                  key={testimonial.id ?? index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030311] ${
                    isActive
                      ? "h-2.5 w-9 bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]"
                      : "h-2.5 w-2.5 bg-white/20 hover:bg-white/50"
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Show next testimonials"
            className="group inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white backdrop-blur-xl transition-all duration-300 hover:translate-x-1 hover:border-cyan-400/40 hover:bg-cyan-400/[0.1] hover:text-cyan-200 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030311]"
          >
            <ArrowRight
              size={20}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      )}

      <p className="sr-only">
        Use the previous and next buttons, swipe on touch devices, or press the
        left and right arrow keys to navigate testimonials.
      </p>
    </div>
  );
}
