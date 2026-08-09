import { Star } from "lucide-react";

/**
 * Displays a testimonial star rating.
 *
 * @param {Object} props
 * @param {number} props.rating
 * @param {"sm"|"md"|"lg"} [props.size]
 * @param {boolean} [props.showValue]
 * @param {string} [props.className]
 */
export default function TestimonialRating({
  rating = 0,
  size = "md",
  showValue = false,
  className = "",
}) {
  const numericRating = Number(rating);

  const safeRating = Number.isFinite(numericRating)
    ? Math.min(5, Math.max(0, Math.round(numericRating)))
    : 0;

  const iconSizes = {
    sm: 14,
    md: 17,
    lg: 20,
  };

  const iconSize = iconSizes[size] ?? iconSizes.md;

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label={`${safeRating} out of 5 stars`}
    >
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => {
          const isFilled = index < safeRating;

          return (
            <Star
              key={index}
              size={iconSize}
              strokeWidth={1.8}
              className={
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-white/20"
              }
            />
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-semibold text-slate-300">
          {safeRating}.0
        </span>
      )}
    </div>
  );
}