/**
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {string} name
 * @property {string} company
 * @property {string} position
 * @property {string} profileImage
 * @property {number} rating
 * @property {string} message
 * @property {string} email
 * @property {boolean} featured
 * @property {string} createdAt
 */

/**
 * @typedef {Object} TestimonialSubmission
 * @property {string} name
 * @property {string} company
 * @property {string} position
 * @property {File|null} profileImageFile
 * @property {string} profileImagePreview
 * @property {number} rating
 * @property {string} message
 * @property {string} email
 */

/**
 * @typedef {Object} TestimonialServiceResponse
 * @property {boolean} success
 * @property {string} message
 * @property {Testimonial|null} data
 */

/**
 * Ensures a testimonial object has a consistent and safe structure.
 *
 * This function acts as a lightweight runtime model while the project
 * remains JavaScript-based. It can later be replaced with a backend DTO,
 * schema validator, or TypeScript interface without changing components.
 *
 * @param {Partial<Testimonial>} testimonial
 * @returns {Testimonial}
 */
export function createTestimonialModel(testimonial = {}) {
  const rating = Number(testimonial.rating);

  return {
    id: String(testimonial.id ?? ""),
    name: String(testimonial.name ?? "").trim(),
    company: String(testimonial.company ?? "").trim(),
    position: String(testimonial.position ?? "").trim(),
    profileImage: String(testimonial.profileImage ?? "").trim(),
    rating: Number.isFinite(rating)
      ? Math.min(5, Math.max(1, Math.round(rating)))
      : 5,
    message: String(testimonial.message ?? "").trim(),
    email: String(testimonial.email ?? "").trim(),
    featured: Boolean(testimonial.featured),
    createdAt: String(
      testimonial.createdAt ?? new Date().toISOString(),
    ),
  };
}

/**
 * Creates an empty form value object.
 *
 * Returning a new object prevents accidental shared state between
 * different form instances.
 *
 * @returns {TestimonialSubmission}
 */
export function createEmptyTestimonialSubmission() {
  return {
    name: "",
    company: "",
    position: "",
    profileImageFile: null,
    profileImagePreview: "",
    rating: 0,
    message: "",
    email: "",
  };
}

/**
 * Returns initials for testimonials that do not have a profile image.
 *
 * @param {string} name
 * @returns {string}
 */
export function getTestimonialInitials(name = "") {
  const initials = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "VG";
}

/**
 * Checks whether a testimonial has a valid external or local image source.
 *
 * @param {string} image
 * @returns {boolean}
 */
export function hasTestimonialProfileImage(image = "") {
  return typeof image === "string" && image.trim().length > 0;
}