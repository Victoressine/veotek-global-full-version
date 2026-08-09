import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const SHOW_AFTER_PX = 250;
const BUTTON_SIZE = 46;
const STROKE_WIDTH = 3;
const RADIUS = 19;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let animationFrameId = null;

    const updateScrollState = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollableHeight > 0
          ? Math.min(Math.max(scrollTop / scrollableHeight, 0), 1)
          : 0;

      setIsVisible(scrollTop > SHOW_AFTER_PX);
      setScrollProgress(progress);

      animationFrameId = null;
    };

    const handleScroll = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const strokeDashOffset = CIRCUMFERENCE - scrollProgress * CIRCUMFERENCE;

  const scrollPercentage = Math.round(scrollProgress * 100);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={handleScrollToTop}
          aria-label={`Scroll to top. Page progress ${scrollPercentage}%`}
          title="Scroll to top"
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.8,
                  y: 16,
                }
          }
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={
            prefersReducedMotion
              ? {
                  opacity: 0,
                }
              : {
                  opacity: 0,
                  scale: 0.8,
                  y: 16,
                }
          }
          transition={{
            duration: prefersReducedMotion ? 0.1 : 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={
            prefersReducedMotion
              ? undefined
              : {
                  scale: 1.08,
                  y: -2,
                }
          }
          whileTap={
            prefersReducedMotion
              ? undefined
              : {
                  scale: 0.93,
                }
          }
          className="
            fixed
            bottom-44
            right-5
            z-[130]
            flex
            h-[46px]
            w-[46px]
            items-center
            justify-center
            rounded-full
            bg-[#07111f]/95
            text-white
            shadow-[0_10px_35px_rgba(34,211,238,0.25)]
            backdrop-blur-xl
            transition-shadow
            duration-300
            hover:shadow-[0_14px_45px_rgba(34,211,238,0.4)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-cyan-300
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#030311]
            sm:bottom-44
            sm:right-6
          "
          style={{
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
          }}
        >
          {/* Circular progress indicator */}
          <svg
            aria-hidden="true"
            viewBox="0 0 46 46"
            className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx="23"
              cy="23"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={STROKE_WIDTH}
            />

            {/* Progress circle */}
            <circle
              cx="23"
              cy="23"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashOffset}
              className="text-cyan-400 transition-[stroke-dashoffset] duration-100"
            />
          </svg>

          {/* Inner background */}
          <span
            aria-hidden="true"
            className="absolute inset-[5px] rounded-full bg-gradient-to-br from-cyan-500/25 to-blue-600/25"
          />

          {/* Arrow */}
          <ArrowUp
            size={17}
            strokeWidth={2.5}
            aria-hidden="true"
            className="relative z-10"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
