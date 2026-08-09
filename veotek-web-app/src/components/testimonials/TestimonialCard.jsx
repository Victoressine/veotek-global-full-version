import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  Building2,
  CalendarDays,
  MapPin,
  Quote,
} from "lucide-react";

import TestimonialAvatar from "./TestimonialAvatar";
import TestimonialRating from "./TestimonialRating";

/**
 * Formats a testimonial date using the user's local timezone.
 *
 * @param {string} dateValue
 * @returns {string}
 */
function formatTestimonialDate(dateValue) {
  if (!dateValue) {
    return "Date unavailable";
  }

  const parsedDate = new Date(dateValue);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "long",
      timeStyle: "short",
    },
  ).format(parsedDate);
}

/**
 * Reusable testimonial card.
 *
 * @param {Object} props
 * @param {Object} props.testimonial
 * @param {"homepage"|"page"} [props.variant]
 * @param {boolean} [props.featured]
 * @param {string} [props.className]
 */
export default function TestimonialCard({
  testimonial,
  variant = "page",
  featured = false,
  className = "",
}) {
  const prefersReducedMotion =
    useReducedMotion();

  if (!testimonial) {
    return null;
  }

  const {
    name = "VeoTek Client",
    company = "",
    position = "",
    location = "",
    profileImage = "",
    rating = 0,
    message = "",
    createdAt = "",
  } = testimonial;

  const isHomepageVariant =
    variant === "homepage";

  const shouldShowDate =
    variant === "page";

  const cardMinimumHeight =
    isHomepageVariant
      ? "min-h-[410px]"
      : "min-h-[430px]";

  return (
    <motion.article
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: 24,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.55,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -8,

              transition: {
                duration: 0.25,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              },
            }
      }
      className={`group relative flex h-full ${cardMinimumHeight} flex-col overflow-hidden rounded-[1.875rem] border backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-500 ${
        featured
          ? "border-cyan-400/40 bg-white/[0.07] shadow-[0_35px_120px_rgba(34,211,238,0.16)]"
          : "border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.18)] hover:border-cyan-400/30 hover:bg-white/[0.06] hover:shadow-[0_30px_90px_rgba(34,211,238,0.1)]"
      } ${className}`}
    >
      {/* Background glow */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 opacity-0 blur-[120px] transition-opacity duration-500 group-hover:opacity-100"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-28 h-52 w-52 rounded-full bg-indigo-500/[0.08] opacity-0 blur-[120px] transition-opacity duration-500 group-hover:opacity-100"
      />

      {featured ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-2/3 -translate-x-1/2 rounded-full bg-cyan-400/[0.08] blur-[80px]"
        />
      ) : null}

      {/* Top accent */}

      <div
        aria-hidden="true"
        className={`absolute left-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 transition-all duration-700 ${
          featured
            ? "w-full"
            : "w-0 group-hover:w-full"
        }`}
      />

      {/* Card content */}

      <div className="relative flex flex-1 flex-col p-6 sm:p-7 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <TestimonialRating
            rating={rating}
            size="md"
          />

          {featured ? (
            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/[0.08] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-cyan-300">
              Featured
            </span>
          ) : null}
        </div>

        <div className="mt-7">
          <Quote
            size={34}
            strokeWidth={1.5}
            aria-hidden="true"
            className="text-cyan-400/80 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
          />
        </div>

        <blockquote className="mt-6 flex-1">
          <p className="text-[15px] leading-8 text-slate-300 sm:text-base">
            “{message}”
          </p>
        </blockquote>

        <div
          aria-hidden="true"
          className="my-7 h-px w-full bg-white/10 sm:my-8"
        />

        {/* Client details */}

        <footer>
          <div className="flex items-center gap-4">
            <TestimonialAvatar
              name={name}
              profileImage={
                profileImage
              }
              size={
                isHomepageVariant
                  ? "lg"
                  : "xl"
              }
            />

            <div className="min-w-0 flex-1">
              <cite className="block truncate text-base font-bold not-italic text-white sm:text-lg">
                {name}
              </cite>

              {position ? (
                <p className="mt-1 truncate text-sm text-slate-400">
                  {position}
                </p>
              ) : null}

              {company ? (
                <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm font-medium text-cyan-300">
                  <Building2
                    size={14}
                    strokeWidth={1.8}
                    className="shrink-0"
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {company}
                  </span>
                </div>
              ) : null}

              {location ? (
                <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm text-slate-400">
                  <MapPin
                    size={14}
                    strokeWidth={1.8}
                    className="shrink-0 text-cyan-400/80"
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {location}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {shouldShowDate ? (
            <div className="mt-6 flex items-center gap-2 border-t border-white/[0.08] pt-5 text-xs leading-5 text-slate-500 sm:text-sm">
              <CalendarDays
                size={15}
                strokeWidth={1.8}
                className="shrink-0 text-cyan-400/70"
                aria-hidden="true"
              />

              <time
                dateTime={
                  createdAt || undefined
                }
              >
                {formatTestimonialDate(
                  createdAt,
                )}
              </time>
            </div>
          ) : null}
        </footer>
      </div>
    </motion.article>
  );
}