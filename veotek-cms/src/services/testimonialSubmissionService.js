// ======================================================
// Supabase Import
// ======================================================

import { supabase } from "../lib/supabase";

// ======================================================
// Constants
// ======================================================

const SUBMISSIONS_TABLE = "testimonial_submissions";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const SUBMISSION_COLUMNS = `
  id,
  client_name,
  position,
  company,
  location,
  industry,
  review,
  rating,
  client_photo_url,
  client_photo_path,
  consent_to_publish,
  status,
  admin_notes,
  reviewed_by,
  reviewed_at,
  approved_testimonial_id,
  approved_testimonial:testimonials!testimonial_submissions_approved_testimonial_id_fkey (
    id,
    deleted_at,
    deleted_by,
    delete_reason
  ),
  deleted_at,
  deleted_by,
  delete_reason,
  submitted_ip_hash,
  user_agent,
  created_at,
  updated_at
`;

// ======================================================
// General Helpers
// ======================================================

function normalizeText(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || null;
}

function normalizePage(value) {
  const page = Number(value ?? 1);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

function normalizePageSize(value) {
  const pageSize = Number(value ?? DEFAULT_PAGE_SIZE);

  if (!Number.isInteger(pageSize) || pageSize < 1) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(pageSize, MAX_PAGE_SIZE);
}

function normalizeRating(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const rating = Number(value);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be a whole number between 1 and 5.");
  }

  return rating;
}

function normalizeDisplayOrder(value) {
  const displayOrder = Number(value ?? 0);

  if (!Number.isInteger(displayOrder) || displayOrder < 0) {
    throw new Error("Display order must be a non-negative whole number.");
  }

  return displayOrder;
}

function normalizeStatus(value) {
  const allowedStatuses = new Set([
    "pending",
    "approved",
    "rejected",
    "recycle_bin",
  ]);

  if (allowedStatuses.has(value)) {
    return value;
  }

  return "pending";
}

function mapSupabaseError(error, fallbackMessage) {
  const mappedError = new Error(error?.message || fallbackMessage);

  mappedError.code = error?.code;

  mappedError.details = error?.details;

  mappedError.hint = error?.hint;

  return mappedError;
}

// ======================================================
// Authentication Helper
// ======================================================

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw mapSupabaseError(error, "Unable to verify the signed-in user.");
  }

  if (!user?.id) {
    throw new Error("Authentication is required.");
  }

  return user;
}

// ======================================================
// Filter Builder
// ======================================================

function applyFilters(
  query,
  {
    search = "",
    status = "pending",
    industry = "",
    rating = null,
    hasConsent,
    hasPhoto,
  } = {},
) {
  const normalizedSearch = normalizeText(search);

  const normalizedIndustry = normalizeText(industry);

  const normalizedRating = normalizeRating(rating);

  if (normalizedSearch) {
    const safeSearch = normalizedSearch.replaceAll(",", "\\,");

    query = query.or(
      [
        `client_name.ilike.%${safeSearch}%`,
        `position.ilike.%${safeSearch}%`,
        `company.ilike.%${safeSearch}%`,
        `location.ilike.%${safeSearch}%`,
        `industry.ilike.%${safeSearch}%`,
        `review.ilike.%${safeSearch}%`,
      ].join(","),
    );
  }

  if (status) {
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === "recycle_bin") {
      query = query.eq("status", "rejected").not("deleted_at", "is", null);
    } else {
      query = query.eq("status", normalizedStatus);

      if (normalizedStatus === "approved") {
        query = query.not("approved_testimonial_id", "is", null);
      }

      if (normalizedStatus === "rejected") {
        query = query.is("deleted_at", null);
      }
    }
  }

  if (normalizedIndustry) {
    query = query.ilike("industry", normalizedIndustry);
  }

  if (normalizedRating !== null) {
    query = query.eq("rating", normalizedRating);
  }

  if (typeof hasConsent === "boolean") {
    query = query.eq("consent_to_publish", hasConsent);
  }

  if (typeof hasPhoto === "boolean") {
    query = hasPhoto
      ? query.not("client_photo_url", "is", null)
      : query.is("client_photo_url", null);
  }

  return query;
}

// ======================================================
// Service
// ======================================================

const testimonialSubmissionService = {
  // ==================================================
  // Get Submissions
  // ==================================================

  async getSubmissions({
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    search = "",
    status = "pending",
    industry = "",
    rating = null,
    hasConsent,
    hasPhoto,
    sortBy = "created_at",
    sortDirection = "desc",
  } = {}) {
    const currentPage = normalizePage(page);

    const normalizedPageSize = normalizePageSize(pageSize);

    const from = (currentPage - 1) * normalizedPageSize;

    const to = from + normalizedPageSize - 1;

    const allowedSortFields = new Set([
      "created_at",
      "updated_at",
      "reviewed_at",
      "client_name",
      "company",
      "rating",
      "status",
    ]);

    const sortField = allowedSortFields.has(sortBy) ? sortBy : "created_at";

    let query = supabase.from(SUBMISSIONS_TABLE).select(SUBMISSION_COLUMNS, {
      count: "exact",
    });

    query = applyFilters(query, {
      search,
      status,
      industry,
      rating,
      hasConsent,
      hasPhoto,
    });

    const { data, error, count } = await query
      .order(sortField, {
        ascending: sortDirection === "asc",

        nullsFirst: false,
      })
      .range(from, to);

    if (error) {
      throw mapSupabaseError(error, "Unable to load testimonial submissions.");
    }

    return {
      data: Array.isArray(data) ? data : [],

      pagination: {
        page: currentPage,

        pageSize: normalizedPageSize,

        total: count ?? 0,

        totalPages: Math.max(1, Math.ceil((count ?? 0) / normalizedPageSize)),
      },
    };
  },

  // ==================================================
  // Get One Submission
  // ==================================================

  async getSubmissionById(submissionId) {
    if (!submissionId) {
      throw new Error("A submission ID is required.");
    }

    const { data, error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .select(SUBMISSION_COLUMNS)
      .eq("id", submissionId)
      .maybeSingle();

    if (error) {
      throw mapSupabaseError(
        error,
        "Unable to load the testimonial submission.",
      );
    }

    return data;
  },

  // ==================================================
  // Approve Submission
  // ==================================================

  async approveSubmission(
    submissionId,
    { isFeatured = false, displayOrder = 0, adminNotes = null } = {},
  ) {
    if (!submissionId) {
      throw new Error("A submission ID is required.");
    }

    await getCurrentUser();

    const { data, error } = await supabase.rpc(
      "approve_testimonial_submission",
      {
        p_submission_id: submissionId,

        p_is_featured: Boolean(isFeatured),

        p_display_order: normalizeDisplayOrder(displayOrder),

        p_admin_notes: normalizeText(adminNotes),
      },
    );

    if (error) {
      throw mapSupabaseError(
        error,
        "Unable to approve the testimonial submission.",
      );
    }

    return data;
  },

  // ==================================================
  // Reject Submission
  // ==================================================

  async rejectSubmission(submissionId, adminNotes = null) {
    if (!submissionId) {
      throw new Error("A submission ID is required.");
    }

    await getCurrentUser();

    const { data, error } = await supabase.rpc(
      "reject_testimonial_submission",
      {
        p_submission_id: submissionId,

        p_admin_notes: normalizeText(adminNotes),
      },
    );

    if (error) {
      throw mapSupabaseError(
        error,
        "Unable to reject the testimonial submission.",
      );
    }

    return data;
  },

  // ==================================================
  // Move Rejected Submission to Recycle Bin
  // ==================================================

  async softDeleteRejectedSubmission(submissionId, reason = null) {
    if (!submissionId) {
      throw new Error("A testimonial submission ID is required.");
    }

    const normalizedReason = normalizeText(reason);

    if (normalizedReason && normalizedReason.length > 500) {
      throw new Error("Delete reason cannot exceed 500 characters.");
    }

    await getCurrentUser();

    const { data, error } = await supabase.rpc(
      "soft_delete_rejected_testimonial_submission",
      {
        p_submission_id: submissionId,
        p_reason: normalizedReason,
      },
    );

    if (error) {
      throw mapSupabaseError(
        error,
        "Unable to move the rejected submission to the Recycle Bin.",
      );
    }

    const deletedSubmission =
      Array.isArray(data) && data.length > 0 ? data[0] : data;

    if (
      !deletedSubmission?.id ||
      String(deletedSubmission.id) !== String(submissionId) ||
      !deletedSubmission.deleted_at
    ) {
      throw new Error(
        "The rejected submission was not successfully moved to the Recycle Bin.",
      );
    }

    return deletedSubmission;
  },

  // ==================================================
  // Restore Rejected Submission
  // ==================================================

  async restoreDeletedSubmission(submissionId) {
    if (!submissionId) {
      throw new Error("A testimonial submission ID is required.");
    }

    await getCurrentUser();

    const { data, error } = await supabase.rpc(
      "restore_deleted_testimonial_submission",
      {
        p_submission_id: submissionId,
      },
    );

    if (error) {
      throw mapSupabaseError(
        error,
        "Unable to restore the rejected testimonial submission.",
      );
    }

    const restoredSubmission =
      Array.isArray(data) && data.length > 0 ? data[0] : data;

    if (
      !restoredSubmission?.id ||
      String(restoredSubmission.id) !== String(submissionId) ||
      restoredSubmission.deleted_at
    ) {
      throw new Error("The rejected submission was not successfully restored.");
    }

    return restoredSubmission;
  },

  // ==================================================
  // Permanently Delete Rejected Submission
  // ==================================================

  async permanentlyDeleteRejectedSubmission(submissionId) {
    if (!submissionId) {
      throw new Error("A testimonial submission ID is required.");
    }

    await getCurrentUser();

    const { data, error } = await supabase.rpc(
      "permanently_delete_testimonial_submission",
      {
        p_submission_id: submissionId,
      },
    );

    if (error) {
      throw mapSupabaseError(
        error,
        "Unable to permanently delete the rejected testimonial submission.",
      );
    }

    if (!data || String(data) !== String(submissionId)) {
      throw new Error(
        "The rejected testimonial submission was not permanently deleted.",
      );
    }

    return data;
  },

  // ==================================================
  // Update Admin Notes
  // ==================================================

  async updateAdminNotes(submissionId, adminNotes) {
    if (!submissionId) {
      throw new Error("A submission ID is required.");
    }

    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .update({
        admin_notes: normalizeText(adminNotes),

        reviewed_by: user.id,

        reviewed_at: new Date().toISOString(),
      })
      .eq("id", submissionId)
      .select(SUBMISSION_COLUMNS)
      .single();

    if (error) {
      throw mapSupabaseError(error, "Unable to update the admin notes.");
    }

    return data;
  },

  // ==================================================
  // Industry Options
  // ==================================================

  async getIndustryOptions() {
    const { data, error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .select("industry")
      .not("industry", "is", null);

    if (error) {
      throw mapSupabaseError(error, "Unable to load testimonial industries.");
    }

    const industries = (data ?? [])
      .map((record) => normalizeText(record.industry))
      .filter(Boolean);

    return [...new Set(industries)].sort((firstIndustry, secondIndustry) =>
      firstIndustry.localeCompare(secondIndustry),
    );
  },

  // ==================================================
  // Move Approved Testimonial to Recycle Bin
  // ==================================================

  async softDeleteApprovedTestimonial(testimonialId, reason = null) {
    if (!testimonialId) {
      throw new Error("An approved testimonial ID is required.");
    }

    const normalizedReason = normalizeText(reason);

    if (normalizedReason && normalizedReason.length > 500) {
      throw new Error("Delete reason cannot exceed 500 characters.");
    }

    await getCurrentUser();

    const { data, error } = await supabase.rpc("soft_delete_testimonial", {
      p_testimonial_id: testimonialId,
      p_reason: normalizedReason,
    });

    if (error) {
      throw mapSupabaseError(
        error,
        "Unable to move the testimonial to the Recycle Bin.",
      );
    }

    const deletedTestimonial =
      Array.isArray(data) && data.length > 0 ? data[0] : data;

    if (
      !deletedTestimonial?.id ||
      String(deletedTestimonial.id) !== String(testimonialId) ||
      !deletedTestimonial.deleted_at
    ) {
      throw new Error(
        "The testimonial was not successfully moved to the Recycle Bin.",
      );
    }

    return deletedTestimonial;
  },

  // ==================================================
  // Get Deleted Testimonials
  // ==================================================

  async getDeletedTestimonials() {
    await getCurrentUser();

    const { data, error } = await supabase
      .from("testimonials")
      .select(
        `
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
      deleted_by,
      delete_reason,
      created_at,
      updated_at
    `,
      )
      .not("deleted_at", "is", null)
      .order("deleted_at", {
        ascending: false,
        nullsFirst: false,
      });

    if (error) {
      throw mapSupabaseError(error, "Unable to load deleted testimonials.");
    }

    return Array.isArray(data) ? data : [];
  },

  // ==================================================
  // Restore Deleted Testimonial
  // ==================================================

  async restoreDeletedTestimonial(testimonialId) {
    if (!testimonialId) {
      throw new Error("A testimonial ID is required.");
    }

    await getCurrentUser();

    const { data, error } = await supabase.rpc("restore_deleted_testimonial", {
      p_testimonial_id: testimonialId,
    });

    if (error) {
      throw mapSupabaseError(error, "Unable to restore the testimonial.");
    }

    const restoredTestimonial =
      Array.isArray(data) && data.length > 0 ? data[0] : data;

    if (
      !restoredTestimonial?.id ||
      String(restoredTestimonial.id) !== String(testimonialId) ||
      restoredTestimonial.deleted_at
    ) {
      throw new Error("The testimonial was not successfully restored.");
    }

    return restoredTestimonial;
  },

  // ==================================================
  // Permanently Delete Testimonial
  // ==================================================

  async permanentlyDeleteTestimonial(testimonialId) {
    if (!testimonialId) {
      throw new Error("A testimonial ID is required.");
    }

    await getCurrentUser();

    const { data, error } = await supabase.rpc(
      "permanently_delete_testimonial",
      {
        p_testimonial_id: testimonialId,
      },
    );

    if (error) {
      throw mapSupabaseError(
        error,
        "Unable to permanently delete the testimonial.",
      );
    }

    if (!data || String(data) !== String(testimonialId)) {
      throw new Error("The testimonial was not permanently deleted.");
    }

    return data;
  },

  // ==================================================
  // Realtime Subscription
  // ==================================================

  subscribeToSubmissions({
    channelName = "veotek-cms-testimonial-submissions",

    onInsert,
    onUpdate,
    onDelete,
    onStatusChange,
    onError,
  } = {}) {
    return supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: SUBMISSIONS_TABLE,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            onInsert?.(payload.new);
          }

          if (payload.eventType === "UPDATE") {
            onUpdate?.(payload.new, payload.old);
          }

          if (payload.eventType === "DELETE") {
            onDelete?.(payload.old);
          }
        },
      )
      .subscribe((subscriptionStatus, subscriptionError) => {
        onStatusChange?.(subscriptionStatus);

        if (subscriptionError) {
          if (import.meta.env.DEV) {
            console.error(
              "Testimonial submissions Realtime error:",
              subscriptionError,
            );
          }

          onError?.(subscriptionError);
        }
      });
  },
  // ==================================================
  // Remove Realtime Subscription
  // ==================================================

  async unsubscribe(channel) {
    if (!channel) {
      return;
    }

    const result = await supabase.removeChannel(channel);

    if (result === "error") {
      throw new Error(
        "Unable to remove the testimonial submissions Realtime subscription.",
      );
    }
  },
};

// ======================================================
// Exports
// ======================================================

export { SUBMISSION_COLUMNS, SUBMISSIONS_TABLE };

export default testimonialSubmissionService;
