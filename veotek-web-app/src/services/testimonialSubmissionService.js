// ======================================================
// Supabase Import
// ======================================================

import { supabase } from "../lib/supabase";

// ======================================================
// Constants
// ======================================================

const SUBMISSIONS_TABLE = "testimonial_submissions";
const PHOTO_BUCKET = "testimonial-images";

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const SUPABASE_UNAVAILABLE_ERROR =
  "Testimonial submission is temporarily unavailable. Please try again later.";

const PHOTO_UPLOAD_ERROR =
  "Unable to upload your photo. Please try again.";

const PHOTO_REMOVE_ERROR =
  "Unable to remove the uploaded photo.";

const SUBMISSION_ERROR =
  "Unable to submit your testimonial. Please try again.";

// ======================================================
// Supabase Availability Guard
// ======================================================

/**
 * Returns the configured Supabase client.
 *
 * Prevents runtime errors such as:
 * "Cannot read properties of null (reading 'storage')"
 * or
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
// General Helpers
// ======================================================

/**
 * Converts text-like values into trimmed strings.
 *
 * Empty values become null.
 *
 * @param {unknown} value
 * @returns {string|null}
 */
function normalizeText(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || null;
}

/**
 * Validates required text fields.
 *
 * @param {unknown} value
 * @param {string} fieldName
 * @returns {string}
 * @throws {Error}
 */
function requireText(value, fieldName) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalizedValue;
}

/**
 * Validates testimonial rating.
 *
 * @param {unknown} value
 * @returns {number}
 * @throws {Error}
 */
function normalizeRating(value) {
  const rating = Number(value);

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    throw new Error(
      "Rating must be a whole number between 1 and 5.",
    );
  }

  return rating;
}

// ======================================================
// Photo Validation
// ======================================================

/**
 * Validates an uploaded testimonial photo.
 *
 * @param {File|null|undefined} file
 * @returns {void}
 * @throws {Error}
 */
function validatePhoto(file) {
  if (!file) {
    return;
  }

  /*
   * Protect against environments where File
   * is not available as a global.
   */
  if (
    typeof File === "undefined" ||
    !(file instanceof File)
  ) {
    throw new Error("Select a valid client photo.");
  }

  if (file.size <= 0) {
    throw new Error(
      "The selected client photo is empty.",
    );
  }

  if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
    throw new Error(
      "Client photo must be a JPG, PNG, or WebP image.",
    );
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    throw new Error(
      "Client photo must not exceed 5 MB.",
    );
  }
}

// ======================================================
// Photo Extension
// ======================================================

/**
 * Determines the extension from the verified MIME type
 * rather than trusting the supplied filename.
 *
 * @param {File} file
 * @returns {string}
 */
function getPhotoExtension(file) {
  const extensionMap = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return extensionMap[file?.type] || "webp";
}

// ======================================================
// Unique Identifier
// ======================================================

/**
 * Creates a collision-resistant identifier.
 *
 * @returns {string}
 */
function createUniqueIdentifier() {
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return [
    Date.now(),
    Math.random().toString(36).slice(2, 12),
  ].join("-");
}

// ======================================================
// Storage Path
// ======================================================

/**
 * Generates a safe Storage object path.
 *
 * @param {File} file
 * @returns {string}
 */
function createPhotoPath(file) {
  const extension = getPhotoExtension(file);

  const uniqueIdentifier =
    createUniqueIdentifier();

  return [
    "public-submissions",
    `${Date.now()}-${uniqueIdentifier}.${extension}`,
  ].join("/");
}

// ======================================================
// Supabase Error Mapper
// ======================================================

/**
 * Converts Supabase or unknown errors into
 * predictable application errors.
 *
 * @param {unknown} error
 * @param {string} fallbackMessage
 * @returns {Error}
 */
function mapSupabaseError(
  error,
  fallbackMessage,
) {
  if (error instanceof Error) {
    const mappedError = new Error(
      error.message || fallbackMessage,
    );

    mappedError.name =
      error.name && error.name !== "Error"
        ? error.name
        : "TestimonialSubmissionError";

    if ("code" in error) {
      mappedError.code = error.code;
    }

    if ("details" in error) {
      mappedError.details = error.details;
    }

    if ("hint" in error) {
      mappedError.hint = error.hint;
    }

    mappedError.cause = error;

    return mappedError;
  }

  const mappedError = new Error(
    fallbackMessage,
  );

  mappedError.name =
    "TestimonialSubmissionError";

  mappedError.cause = error;

  return mappedError;
}

// ======================================================
// User Agent
// ======================================================

/**
 * Safely obtains the browser user agent.
 *
 * @returns {string|null}
 */
function getUserAgent() {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.userAgent !== "string"
  ) {
    return null;
  }

  return normalizeText(navigator.userAgent);
}

// ======================================================
// Submission Payload
// ======================================================

/**
 * Validates and normalizes a testimonial submission
 * before sending it to Supabase.
 *
 * @param {Record<string, unknown>} payload
 * @returns {Record<string, unknown>}
 */
function normalizeSubmissionPayload(
  payload = {},
) {
  const consentToPublish = Boolean(
    payload.consent_to_publish,
  );

  if (!consentToPublish) {
    throw new Error(
      "You must agree to the publication consent before submitting your testimonial.",
    );
  }

  return {
    client_name: requireText(
      payload.client_name,
      "Full name",
    ),

    position: requireText(
      payload.position,
      "Position",
    ),

    company: requireText(
      payload.company,
      "Company",
    ),

    location: requireText(
      payload.location,
      "Location",
    ),

    industry: requireText(
      payload.industry,
      "Industry",
    ),

    review: requireText(
      payload.review,
      "Testimonial",
    ),

    rating: normalizeRating(
      payload.rating ?? 5,
    ),

    client_photo_url: normalizeText(
      payload.client_photo_url,
    ),

    client_photo_path: normalizeText(
      payload.client_photo_path,
    ),

    /*
     * Public submissions must always enter moderation.
     *
     * Never accept status from the browser.
     */
    consent_to_publish: true,

    status: "pending",

    /*
     * IP hashing should happen server-side if added later.
     * Never trust an IP value supplied by the browser.
     */
    submitted_ip_hash: null,

    user_agent: getUserAgent(),
  };
}

// ======================================================
// Upload Client Photo
// ======================================================

async function uploadClientPhoto(file) {
  validatePhoto(file);

  if (!file) {
    return {
      publicUrl: null,
      path: null,
    };
  }

  const client = requireSupabase();

  const photoPath =
    createPhotoPath(file);

  try {
    const { error: uploadError } =
      await client.storage
        .from(PHOTO_BUCKET)
        .upload(photoPath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } =
      client.storage
        .from(PHOTO_BUCKET)
        .getPublicUrl(photoPath);

    const publicUrl =
      normalizeText(
        publicUrlData?.publicUrl,
      );

    if (!publicUrl) {
      /*
       * The file uploaded successfully but a usable
       * public URL was not returned.
       *
       * Try to remove the orphaned upload.
       */
      await removeUploadedPhoto(
        photoPath,
        {
          suppressError: true,
        },
      );

      throw new Error(
        "The photo was uploaded but its public URL could not be generated.",
      );
    }

    return {
      publicUrl,
      path: photoPath,
    };
  } catch (error) {
    throw mapSupabaseError(
      error,
      PHOTO_UPLOAD_ERROR,
    );
  }
}

// ======================================================
// Remove Uploaded Photo
// ======================================================

async function removeUploadedPhoto(
  photoPath,
  { suppressError = false } = {},
) {
  const normalizedPath =
    normalizeText(photoPath);

  if (!normalizedPath) {
    return false;
  }

  try {
    const client = requireSupabase();

    const { error } =
      await client.storage
        .from(PHOTO_BUCKET)
        .remove([normalizedPath]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    if (suppressError) {
      console.warn(
        "Unable to clean up uploaded testimonial photo:",
        error,
      );

      return false;
    }

    console.error(
      "Unable to remove uploaded testimonial photo:",
      error,
    );

    throw mapSupabaseError(
      error,
      PHOTO_REMOVE_ERROR,
    );
  }
}

// ======================================================
// Submit Testimonial
// ======================================================

async function submitTestimonial({
  client_name,
  position,
  company,
  location,
  industry,
  review,
  rating = 5,
  consent_to_publish,
  photo = null,
} = {}) {
  /*
   * Validate the non-file data before uploading
   * anything to Storage.
   *
   * This avoids unnecessary/orphaned uploads when
   * basic form validation already fails.
   */
  const basePayload =
    normalizeSubmissionPayload({
      client_name,
      position,
      company,
      location,
      industry,
      review,
      rating,
      consent_to_publish,

      client_photo_url: null,
      client_photo_path: null,
    });

  /*
   * Validate the file before performing network calls.
   */
  validatePhoto(photo);

  /*
   * Verify Supabase before uploading anything.
   */
  const client = requireSupabase();

  let uploadedPhoto = {
    publicUrl: null,
    path: null,
  };

  try {
    if (photo) {
      uploadedPhoto =
        await uploadClientPhoto(photo);
    }

    const payload = {
      ...basePayload,

      client_photo_url:
        uploadedPhoto.publicUrl,

      client_photo_path:
        uploadedPhoto.path,
    };

    /*
     * SECURITY:
     *
     * Do NOT add .select() here.
     *
     * Anonymous visitors may be permitted to INSERT
     * testimonial submissions but should not be able
     * to read private/pending submissions.
     */
    const { error } =
      await client
        .from(SUBMISSIONS_TABLE)
        .insert(payload);

    if (error) {
      throw error;
    }

    return {
      success: true,
      status: "pending",

      message:
        "Your testimonial has been submitted for review.",
    };
  } catch (error) {
    /*
     * If database insertion fails after the image
     * was uploaded, attempt to clean up the orphaned
     * Storage object.
     *
     * Cleanup failure is intentionally suppressed
     * so the original submission failure remains
     * the error reported to the UI.
     */
    if (uploadedPhoto.path) {
      await removeUploadedPhoto(
        uploadedPhoto.path,
        {
          suppressError: true,
        },
      );
    }

    console.error(
      "Testimonial submission failed:",
      error,
    );

    throw mapSupabaseError(
      error,
      SUBMISSION_ERROR,
    );
  }
}

// ======================================================
// Testimonial Submission Service
// ======================================================

const testimonialSubmissionService = {
  uploadClientPhoto,
  removeUploadedPhoto,
  submitTestimonial,
};

// ======================================================
// Named Exports
// ======================================================

export {
  ALLOWED_PHOTO_TYPES,
  MAX_PHOTO_SIZE_BYTES,
  PHOTO_BUCKET,
  SUBMISSIONS_TABLE,
  uploadClientPhoto,
  removeUploadedPhoto,
  submitTestimonial,
};

// ======================================================
// Default Export
// ======================================================

export default testimonialSubmissionService;