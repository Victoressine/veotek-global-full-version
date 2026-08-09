import { useState } from "react";

import {
  getTestimonialInitials,
  hasTestimonialProfileImage,
} from "../../models/testimonial";

/**
 * Displays a testimonial profile image or generated initials.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} [props.profileImage]
 * @param {"sm"|"md"|"lg"|"xl"} [props.size]
 * @param {string} [props.className]
 */
export default function TestimonialAvatar({
  name,
  profileImage = "",
  size = "md",
  className = "",
}) {
  const [hasImageError, setHasImageError] = useState(false);

  const initials = getTestimonialInitials(name);

  const shouldDisplayImage =
    hasTestimonialProfileImage(profileImage) && !hasImageError;

  const sizeClasses = {
    sm: "h-10 w-10 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-14 w-14 text-sm",
    xl: "h-16 w-16 text-base",
  };

  const selectedSizeClass = sizeClasses[size] ?? sizeClasses.md;

  if (shouldDisplayImage) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border border-cyan-300/30 bg-white/5 shadow-[0_10px_35px_rgba(34,211,238,0.15)] ${selectedSizeClass} ${className}`}
      >
        <img
          src={profileImage}
          alt={`${name || "Client"} profile`}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setHasImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-400 via-sky-400 to-indigo-500 font-bold uppercase tracking-wide text-white shadow-[0_10px_35px_rgba(34,211,238,0.2)] ${selectedSizeClass} ${className}`}
      aria-label={`${name || "Client"} profile initials`}
    >
      {initials}
    </div>
  );
}