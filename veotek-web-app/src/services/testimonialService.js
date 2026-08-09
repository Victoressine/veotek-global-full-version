// ======================================================
// Supabase Import
// ======================================================

import { supabase } from "../lib/supabase";

// ======================================================
// Constants
// ======================================================

const TESTIMONIALS_TABLE = "testimonials";
const DEFAULT_FEATURED_LIMIT = 6;

const TESTIMONIALS_LOAD_ERROR =
  "We could not load the testimonials. Please refresh the page and try again.";

const FEATURED_TESTIMONIALS_LOAD_ERROR =
  "We could not load the featured testimonials. Please try again.";

const SUPABASE_UNAVAILABLE_ERROR =
  "Testimonials are temporarily unavailable. Please try again later.";

const REALTIME_CONNECTION_ERROR =
  "Unable to connect to testimonial updates.";

const REALTIME_PROCESSING_ERROR =
  "Unable to process a testimonial update.";

const REALTIME_UNSUBSCRIBE_ERROR =
  "Unable to remove the testimonial Realtime subscription.";

const TESTIMONIAL_COLUMNS = `
  id,
  submission_id,
  client_name,
  position,
  company,
  location,
  industry,
  review,
  rating,
  client_photo_url,
  client_photo_path,
  is_featured,
  display_order,
  deleted_at,
  created_at,
  updated_at
`;

// ======================================================
// Supabase Availability Guard
// ======================================================

/**
 * Returns the Supabase client when properly configured.
 *
 * Prevents runtime crashes such as:
 * "Cannot read properties of null (reading 'from')"
 *
 * @returns {import("@supabase/supabase-js").SupabaseClient}
 * @throws {Error}
 */
function requireSupabase() {
  if (!supabase) {
    const error = new Error(SUPABASE_UNAVAILABLE_ERROR);

    error.name = "SupabaseUnavailableError";
    error.code = "SUPABASE_NOT_CONFIGURED";

    throw error;
  }

  return supabase;
}

// ======================================================
// Error Helpers
// ======================================================

/**
 * Converts unknown errors into a predictable service error.
 *
 * @param {unknown} error
 * @param {string} fallbackMessage
 * @returns {Error}
 */
function createServiceError(error, fallbackMessage) {
  if (error instanceof Error) {
    const serviceError = new Error(error.message || fallbackMessage);

    serviceError.name =
      error.name && error.name !== "Error"
        ? error.name
        : "TestimonialServiceError";

    if ("code" in error) {
      serviceError.code = error.code;
    }

    if ("details" in error) {
      serviceError.details = error.details;
    }

    if ("hint" in error) {
      serviceError.hint = error.hint;
    }

    serviceError.cause = error;

    return serviceError;
  }

  const serviceError = new Error(fallbackMessage);

  serviceError.name = "TestimonialServiceError";

  return serviceError;
}

// ======================================================
// General Helpers
// ======================================================

/**
 * Ensures the requested result limit is a positive integer.
 *
 * @param {unknown} value
 * @param {number} fallback
 * @returns {number}
 */
function normalizeLimit(value, fallback = DEFAULT_FEATURED_LIMIT) {
  const limit = Number(value);

  if (!Number.isInteger(limit) || limit < 1) {
    return fallback;
  }

  return limit;
}

/**
 * Normalizes ratings to a whole number between 1 and 5.
 *
 * @param {unknown} value
 * @returns {number}
 */
function normalizeRating(value) {
  const rating = Number(value);

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return 5;
  }

  return Math.round(rating);
}

/**
 * Normalizes display order values.
 *
 * @param {unknown} value
 * @returns {number}
 */
function normalizeDisplayOrder(value) {
  const displayOrder = Number(value);

  if (!Number.isFinite(displayOrder) || displayOrder < 0) {
    return 0;
  }

  return Math.floor(displayOrder);
}

/**
 * Converts a valid date into an ISO date string.
 *
 * @param {unknown} value
 * @returns {string|null}
 */
function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

// ======================================================
// Record Mapper
// ======================================================

/**
 * Converts a Supabase testimonial row into the object
 * shape expected by the public application.
 *
 * @param {Record<string, unknown>} testimonial
 * @returns {Record<string, unknown>}
 */
function mapTestimonialRecord(testimonial) {
  if (
    !testimonial ||
    typeof testimonial !== "object" ||
    Array.isArray(testimonial)
  ) {
    throw new TypeError("Invalid testimonial record.");
  }

  const clientName =
    typeof testimonial.client_name === "string"
      ? testimonial.client_name.trim()
      : "";

  const review =
    typeof testimonial.review === "string"
      ? testimonial.review.trim()
      : "";

  const photoUrl =
    typeof testimonial.client_photo_url === "string"
      ? testimonial.client_photo_url.trim()
      : "";

  const photoPath =
    typeof testimonial.client_photo_path === "string"
      ? testimonial.client_photo_path.trim()
      : "";

  return {
    id: testimonial.id ?? null,

    submissionId: testimonial.submission_id ?? null,

    name: clientName,

    clientName,

    position:
      typeof testimonial.position === "string"
        ? testimonial.position.trim()
        : "",

    company:
      typeof testimonial.company === "string"
        ? testimonial.company.trim()
        : "",

    location:
      typeof testimonial.location === "string"
        ? testimonial.location.trim()
        : "",

    industry:
      typeof testimonial.industry === "string"
        ? testimonial.industry.trim()
        : "",

    message: review,

    review,

    rating: normalizeRating(testimonial.rating),

    profileImage: photoUrl,

    clientPhotoUrl: photoUrl,

    clientPhotoPath: photoPath,

    featured: Boolean(testimonial.is_featured),

    isFeatured: Boolean(testimonial.is_featured),

    displayOrder: normalizeDisplayOrder(
      testimonial.display_order,
    ),

    createdAt: normalizeDate(testimonial.created_at),

    updatedAt: normalizeDate(testimonial.updated_at),
  };
}

// ======================================================
// Sorting
// ======================================================

/**
 * Safely returns a timestamp from a date value.
 *
 * @param {unknown} value
 * @returns {number}
 */
function getDateTimestamp(value) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;
}

/**
 * Sort testimonials by display order first,
 * then newest created date.
 *
 * @param {Array<Record<string, unknown>>} testimonials
 * @returns {Array<Record<string, unknown>>}
 */
function sortTestimonials(testimonials) {
  if (!Array.isArray(testimonials)) {
    return [];
  }

  return [...testimonials].sort(
    (firstTestimonial, secondTestimonial) => {
      const firstOrder = normalizeDisplayOrder(
        firstTestimonial?.displayOrder,
      );

      const secondOrder = normalizeDisplayOrder(
        secondTestimonial?.displayOrder,
      );

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder;
      }

      const firstCreatedAt = getDateTimestamp(
        firstTestimonial?.createdAt,
      );

      const secondCreatedAt = getDateTimestamp(
        secondTestimonial?.createdAt,
      );

      return secondCreatedAt - firstCreatedAt;
    },
  );
}

// ======================================================
// Safe Record Mapping
// ======================================================

/**
 * Safely maps database rows.
 *
 * Invalid records are skipped rather than crashing
 * the entire testimonial section.
 *
 * @param {Array<Record<string, unknown>>} records
 * @returns {Array<Record<string, unknown>>}
 */
function mapTestimonialRecords(records) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.reduce((mappedRecords, record) => {
    try {
      mappedRecords.push(mapTestimonialRecord(record));
    } catch (error) {
      console.error(
        "Unable to map testimonial record:",
        error,
      );
    }

    return mappedRecords;
  }, []);
}

// ======================================================
// Load All Approved Testimonials
// ======================================================

export async function getTestimonials() {
  try {
    const client = requireSupabase();

    const { data, error } = await client
      .from(TESTIMONIALS_TABLE)
      .select(TESTIMONIAL_COLUMNS)
      .is("deleted_at", null)
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return sortTestimonials(
      mapTestimonialRecords(data),
    );
  } catch (error) {
    console.error(
      "Failed to retrieve testimonials:",
      error,
    );

    throw createServiceError(
      error,
      TESTIMONIALS_LOAD_ERROR,
    );
  }
}

// ======================================================
// Load Featured Testimonials
// ======================================================

export async function getFeaturedTestimonials(
  limit = DEFAULT_FEATURED_LIMIT,
) {
  try {
    const client = requireSupabase();

    const safeLimit = normalizeLimit(limit);

    const { data, error } = await client
      .from(TESTIMONIALS_TABLE)
      .select(TESTIMONIAL_COLUMNS)
      .eq("is_featured", true)
      .is("deleted_at", null)
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      })
      .limit(safeLimit);

    if (error) {
      throw error;
    }

    return sortTestimonials(
      mapTestimonialRecords(data),
    ).slice(0, safeLimit);
  } catch (error) {
    console.error(
      "Failed to retrieve featured testimonials:",
      error,
    );

    throw createServiceError(
      error,
      FEATURED_TESTIMONIALS_LOAD_ERROR,
    );
  }
}

// ======================================================
// Safely Map Realtime Records
// ======================================================

function mapRealtimeRecord(record) {
  if (
    !record ||
    typeof record !== "object" ||
    Array.isArray(record)
  ) {
    return null;
  }

  try {
    return mapTestimonialRecord(record);
  } catch (error) {
    console.error(
      "Unable to map testimonial Realtime record:",
      error,
    );

    return null;
  }
}

// ======================================================
// Realtime Subscription
// ======================================================

export function subscribeToTestimonials({
  channelName = "veotek-public-testimonials",

  onInsert,
  onUpdate,
  onDelete,
  onStatusChange,
  onError,
} = {}) {
  let client;

  try {
    client = requireSupabase();
  } catch (error) {
    const serviceError = createServiceError(
      error,
      REALTIME_CONNECTION_ERROR,
    );

    console.error(
      "Unable to start testimonial Realtime subscription:",
      serviceError,
    );

    onError?.(serviceError);

    return null;
  }

  const normalizedChannelName =
    typeof channelName === "string" &&
    channelName.trim()
      ? channelName.trim()
      : "veotek-public-testimonials";

  try {
    const channel = client
      .channel(normalizedChannelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TESTIMONIALS_TABLE,
        },
        (payload) => {
          try {
            if (!payload || typeof payload !== "object") {
              return;
            }

            if (payload.eventType === "INSERT") {
              const insertedRecord =
                mapRealtimeRecord(payload.new);

              if (insertedRecord) {
                onInsert?.(insertedRecord);
              }

              return;
            }

            if (payload.eventType === "UPDATE") {
              const updatedRecord =
                mapRealtimeRecord(payload.new);

              const previousRecord =
                mapRealtimeRecord(payload.old);

              if (updatedRecord) {
                onUpdate?.(
                  updatedRecord,
                  previousRecord,
                );
              }

              return;
            }

            if (payload.eventType === "DELETE") {
              const deletedRecord =
                mapRealtimeRecord(payload.old);

              if (deletedRecord) {
                onDelete?.(deletedRecord);
              }
            }
          } catch (error) {
            console.error(
              "Unable to process testimonial Realtime event:",
              error,
            );

            onError?.(
              createServiceError(
                error,
                REALTIME_PROCESSING_ERROR,
              ),
            );
          }
        },
      )
      .subscribe(
        (
          subscriptionStatus,
          subscriptionError,
        ) => {
          try {
            onStatusChange?.(subscriptionStatus);

            if (subscriptionError) {
              console.error(
                "Public testimonials Realtime error:",
                subscriptionError,
              );

              onError?.(
                createServiceError(
                  subscriptionError,
                  REALTIME_CONNECTION_ERROR,
                ),
              );
            }
          } catch (callbackError) {
            console.error(
              "Unable to process testimonial subscription status:",
              callbackError,
            );
          }
        },
      );

    return channel;
  } catch (error) {
    const serviceError = createServiceError(
      error,
      REALTIME_CONNECTION_ERROR,
    );

    console.error(
      "Unable to create testimonial Realtime subscription:",
      serviceError,
    );

    onError?.(serviceError);

    return null;
  }
}

// ======================================================
// Remove Realtime Subscription
// ======================================================

export async function unsubscribeFromTestimonials(
  channel,
) {
  if (!channel) {
    return false;
  }

  try {
    const client = requireSupabase();

    const result = await client.removeChannel(channel);

    if (result === "error") {
      throw new Error(
        "Supabase could not remove the testimonial Realtime subscription.",
      );
    }

    return true;
  } catch (error) {
    console.error(
      "Unable to remove testimonial Realtime subscription:",
      error,
    );

    throw createServiceError(
      error,
      REALTIME_UNSUBSCRIBE_ERROR,
    );
  }
}

// ======================================================
// Default Export
// ======================================================

const testimonialService = {
  getTestimonials,
  getFeaturedTestimonials,
  subscribeToTestimonials,
  unsubscribeFromTestimonials,
};

export default testimonialService;