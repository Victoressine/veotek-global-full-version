import { useCallback, useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import testimonialSubmissionService from "../services/testimonialSubmissionService";

// ======================================================
// Constants
// ======================================================

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "recycle_bin",
    label: "Recycle Bin",
  },
];

const INITIAL_DETAILS_STATE = {
  isOpen: false,
  submission: null,
};

const INITIAL_APPROVAL_STATE = {
  isOpen: false,
  submission: null,
  isFeatured: false,
  displayOrder: 0,
  adminNotes: "",
};

const INITIAL_REJECTION_STATE = {
  isOpen: false,
  submission: null,
  adminNotes: "",
};

const INITIAL_APPROVED_DELETE_STATE = {
  isOpen: false,
  submission: null,
  reason: "",
};

const INITIAL_APPROVED_PERMANENT_DELETE_STATE = {
  isOpen: false,
  submission: null,
};

const INITIAL_REJECTED_DELETE_STATE = {
  isOpen: false,
  submission: null,
  reason: "",
};

const INITIAL_REJECTED_PERMANENT_DELETE_STATE = {
  isOpen: false,
  submission: null,
};

// ======================================================
// General Helpers
// ======================================================

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name = "") {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function shortenText(value = "", maximum = 180) {
  const text = String(value).trim();

  if (text.length <= maximum) {
    return text;
  }

  return `${text.slice(0, maximum)}…`;
}

function getRecordKey(submission) {
  if (!submission) {
    return "";
  }

  return [
    submission.recycleBinType || "submission",
    submission.id ||
      submission.approved_testimonial_id ||
      "unknown",
  ].join(":");
}

function getStatusLabel(status) {
  if (status === "recycle_bin") {
    return "Recycle Bin";
  }

  return `${
    status.charAt(0).toUpperCase()
  }${status.slice(1)}`;
}

function matchesApprovedRecycleBinFilters(
  testimonial,
  {
    searchTerm,
    industryFilter,
    ratingFilter,
    consentFilter,
  },
) {
  const normalizedSearch = searchTerm
    .trim()
    .toLowerCase();

  const matchesSearch =
    !normalizedSearch ||
    [
      testimonial.client_name,
      testimonial.position,
      testimonial.company,
      testimonial.location,
      testimonial.industry,
      testimonial.review,
    ].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(normalizedSearch),
    );

  const matchesIndustry =
    !industryFilter ||
    String(
      testimonial.industry ?? "",
    ).toLowerCase() ===
      industryFilter.toLowerCase();

  const matchesRating =
    !ratingFilter ||
    Number(testimonial.rating) ===
      Number(ratingFilter);

  /*
   * Published testimonials came from submissions
   * that granted publication consent.
   */
  const matchesConsent =
    consentFilter === "all" ||
    consentFilter === "yes";

  return (
    matchesSearch &&
    matchesIndustry &&
    matchesRating &&
    matchesConsent
  );
}

function normalizeApprovedRecycleBinItem(
  testimonial,
) {
  return {
    ...testimonial,

    status: "approved",

    consent_to_publish: true,

    reviewed_at: null,

    admin_notes: null,

    approved_testimonial_id:
      testimonial.id,

    approved_testimonial: {
      id: testimonial.id,

      deleted_at:
        testimonial.deleted_at,

      deleted_by:
        testimonial.deleted_by,

      delete_reason:
        testimonial.delete_reason,
    },

    recycleBinType:
      "approved_testimonial",
  };
}

// ======================================================
// Status Badge
// ======================================================

function StatusBadge({
  status,
  recycleBinType,
}) {
  const styles = {
    pending:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",

    approved:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",

    rejected:
      "border-red-500/20 bg-red-500/10 text-red-300",
  };

  const label = recycleBinType
    ? recycleBinType ===
      "approved_testimonial"
      ? "Approved · Recycle Bin"
      : "Rejected · Recycle Bin"
    : status;

  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1",
        "text-xs font-semibold capitalize",

        recycleBinType
          ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
          : styles[status] ??
            "border-white/10 bg-white/5 text-muted",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

// ======================================================
// Rating Display
// ======================================================

function RatingDisplay({
  rating = 0,
}) {
  const normalizedRating =
    Number(rating) || 0;

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${normalizedRating} out of 5 stars`}
    >
      {Array.from(
        {
          length: 5,
        },
        (_, index) => (
          <Star
            key={index}
            size={15}
            aria-hidden="true"
            className={
              index < normalizedRating
                ? "fill-amber-400 text-amber-400"
                : "text-white/15"
            }
          />
        ),
      )}
    </div>
  );
}

// ======================================================
// Summary Card
// ======================================================

function SummaryCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <article className="min-w-40 flex-1 rounded-xl border border-white/10 bg-surface px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-white">
            {value}
          </p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon
            size={19}
            className="text-primary"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}

// ======================================================
// Loading State
// ======================================================

function LoadingState() {
  return (
    <div
      className="flex min-h-72 items-center justify-center rounded-2xl border border-white/10 bg-surface"
      role="status"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className="size-8 animate-spin text-primary"
          aria-hidden="true"
        />

        <p className="text-sm text-muted">
          Loading testimonial
          submissions...
        </p>
      </div>
    </div>
  );
}

// ======================================================
// Error State
// ======================================================

function ErrorState({
  message,
  onRetry,
}) {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-10">
      <div className="max-w-md text-center">
        <h2 className="text-lg font-semibold text-white">
          Unable to load submissions
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-semibold text-white hover:bg-white/5"
        >
          <RefreshCw
            size={17}
            aria-hidden="true"
          />

          Try again
        </button>
      </div>
    </div>
  );
}

// ======================================================
// Empty State
// ======================================================

function EmptyState({
  hasFilters,
  statusFilter,
  onClearFilters,
}) {
  const emptyTitle =
    statusFilter === "recycle_bin"
      ? "Recycle Bin is empty"
      : "No testimonial submissions";

  const emptyDescription =
    statusFilter === "recycle_bin"
      ? "Deleted approved and rejected testimonials will appear here."
      : "New testimonials submitted from the public website will appear here.";

  return (
    <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-surface/60 px-6 py-12">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Clock3
            size={26}
            className="text-primary"
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-white">
          {hasFilters
            ? "No matching submissions"
            : emptyTitle}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          {hasFilters
            ? "Try changing your search or filters."
            : emptyDescription}
        </p>

        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-6 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ======================================================
// Submission Card
// ======================================================

function SubmissionCard({
  submission,
  pendingId,
  onView,
  onApprove,
  onReject,
  onMoveApprovedToRecycleBin,
  onRestoreApproved,
  onPermanentlyDeleteApproved,
  onMoveRejectedToRecycleBin,
  onRestoreRejected,
  onPermanentlyDeleteRejected,
}) {
  const recordKey =
    getRecordKey(submission);

  const isPending =
    pendingId === recordKey;

  const canApprove =
  ["pending", "rejected"].includes(submission.status) &&
  !submission.recycleBinType &&
  !submission.deleted_at;

const canReject =
  submission.status === "pending" &&
  !submission.recycleBinType &&
  !submission.deleted_at;

  const isApprovedRecycleBinItem =
    submission.recycleBinType ===
    "approved_testimonial";

  const isRejectedRecycleBinItem =
    submission.recycleBinType ===
    "rejected_submission";

  const isActiveApproved =
    submission.status === "approved" &&
    !submission.recycleBinType &&
    submission.approved_testimonial_id &&
    !submission.approved_testimonial
      ?.deleted_at;

  const isActiveRejected =
    submission.status === "rejected" &&
    !submission.recycleBinType &&
    !submission.deleted_at;

  return (
    <article className="rounded-2xl border border-white/10 bg-surface p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            {submission.client_photo_url ? (
              <img
                src={
                  submission.client_photo_url
                }
                alt={
                  submission.client_name ||
                  "Testimonial client"
                }
                className="size-14 shrink-0 rounded-2xl object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                {getInitials(
                  submission.client_name,
                )}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words text-lg font-semibold text-white">
                  {submission.client_name ||
                    "Unnamed client"}
                </h2>

                <StatusBadge
                  status={
                    submission.status
                  }
                  recycleBinType={
                    submission.recycleBinType
                  }
                />
              </div>

              <p className="mt-1 text-sm text-muted">
                {[
                  submission.position,

                  submission.company,

                  submission.location,
                ]
                  .filter(Boolean)
                  .join(" • ") ||
                  "Client details not provided"}
              </p>

              {submission.industry ? (
                <p className="mt-1 text-xs text-muted">
                  Industry:{" "}
                  {submission.industry}
                </p>
              ) : null}

              <div className="mt-3">
                <RatingDisplay
                  rating={
                    submission.rating
                  }
                />
              </div>
            </div>
          </div>

          <blockquote className="mt-5 text-sm leading-7 text-slate-300">
            “
            {shortenText(
              submission.review,
            )}
            ”
          </blockquote>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
            <span>
              Submitted:{" "}
              {formatDate(
                submission.created_at,
              )}
            </span>

            <span>
              Consent:{" "}
              {submission.consent_to_publish
                ? "Granted"
                : "Not granted"}
            </span>

            {submission.reviewed_at ? (
              <span>
                Reviewed:{" "}
                {formatDate(
                  submission.reviewed_at,
                )}
              </span>
            ) : null}

            {submission.deleted_at ? (
              <span>
                Deleted:{" "}
                {formatDate(
                  submission.deleted_at,
                )}
              </span>
            ) : null}
          </div>

          {submission.admin_notes ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-dark/40 px-4 py-3">
              <p className="text-xs leading-5 text-muted">
                <span className="font-semibold text-white">
                  Admin notes:
                </span>{" "}
                {
                  submission.admin_notes
                }
              </p>
            </div>
          ) : null}

          {submission.delete_reason ? (
            <div className="mt-4 rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3">
              <p className="text-xs leading-5 text-red-200/80">
                <span className="font-semibold text-red-200">
                  Delete reason:
                </span>{" "}
                {
                  submission.delete_reason
                }
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
          <button
            type="button"
            onClick={() =>
              onView(submission)
            }
            disabled={isPending}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Eye
              size={16}
              aria-hidden="true"
            />

            View
          </button>

{canApprove ? (
  <button
    type="button"
    onClick={() => onApprove(submission)}
    disabled={isPending || !submission.consent_to_publish}
    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
  >
    <CheckCircle2 size={16} aria-hidden="true" />
    Approve
  </button>
) : null}

{canReject ? (
  <button
    type="button"
    onClick={() => onReject(submission)}
    disabled={isPending}
    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
  >
    <XCircle size={16} aria-hidden="true" />
    Reject
  </button>
) : null}

          {isActiveApproved ? (
            <button
              type="button"
              onClick={() =>
                onMoveApprovedToRecycleBin(
                  submission,
                )
              }
              disabled={isPending}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2
                size={16}
                aria-hidden="true"
              />

              Move to Recycle Bin
            </button>
          ) : null}

          {isActiveRejected ? (
            <button
              type="button"
              onClick={() =>
                onMoveRejectedToRecycleBin(
                  submission,
                )
              }
              disabled={isPending}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2
                size={16}
                aria-hidden="true"
              />

              Move to Recycle Bin
            </button>
          ) : null}

          {isApprovedRecycleBinItem ? (
            <>
              <button
                type="button"
                onClick={() =>
                  onRestoreApproved(
                    submission,
                  )
                }
                disabled={isPending}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw
                  size={16}
                  aria-hidden="true"
                />

                Restore
              </button>

              <button
                type="button"
                onClick={() =>
                  onPermanentlyDeleteApproved(
                    submission,
                  )
                }
                disabled={isPending}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2
                  size={16}
                  aria-hidden="true"
                />

                Delete Permanently
              </button>
            </>
          ) : null}

          {isRejectedRecycleBinItem ? (
            <>
              <button
                type="button"
                onClick={() =>
                  onRestoreRejected(
                    submission,
                  )
                }
                disabled={isPending}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw
                  size={16}
                  aria-hidden="true"
                />

                Restore
              </button>

              <button
                type="button"
                onClick={() =>
                  onPermanentlyDeleteRejected(
                    submission,
                  )
                }
                disabled={isPending}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2
                  size={16}
                  aria-hidden="true"
                />

                Delete Permanently
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

// ======================================================
// Main Page
// ======================================================

export default function TestimonialSubmissions() {
  const [
    submissions,
    setSubmissions,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("pending");

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    industryFilter,
    setIndustryFilter,
  ] = useState("");

  const [
    ratingFilter,
    setRatingFilter,
  ] = useState("");

  const [
    consentFilter,
    setConsentFilter,
  ] = useState("all");

  const [
    industries,
    setIndustries,
  ] = useState([]);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalRecords,
    setTotalRecords,
  ] = useState(0);

  const [
    pendingId,
    setPendingId,
  ] = useState(null);

  const [
    detailsState,
    setDetailsState,
  ] = useState(
    INITIAL_DETAILS_STATE,
  );

  const [
    approvalState,
    setApprovalState,
  ] = useState(
    INITIAL_APPROVAL_STATE,
  );

  const [
    rejectionState,
    setRejectionState,
  ] = useState(
    INITIAL_REJECTION_STATE,
  );

  const [
    approvedDeleteState,
    setApprovedDeleteState,
  ] = useState(
    INITIAL_APPROVED_DELETE_STATE,
  );

  const [
    approvedPermanentDeleteState,
    setApprovedPermanentDeleteState,
  ] = useState(
    INITIAL_APPROVED_PERMANENT_DELETE_STATE,
  );

  const [
    rejectedDeleteState,
    setRejectedDeleteState,
  ] = useState(
    INITIAL_REJECTED_DELETE_STATE,
  );

  const [
    rejectedPermanentDeleteState,
    setRejectedPermanentDeleteState,
  ] = useState(
    INITIAL_REJECTED_PERMANENT_DELETE_STATE,
  );

  const [
    realtimeStatus,
    setRealtimeStatus,
  ] = useState("CONNECTING");

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    Boolean(industryFilter) ||
    Boolean(ratingFilter) ||
    consentFilter !== "all";

  const statistics = useMemo(
    () => ({
      total: totalRecords,
    }),
    [totalRecords],
  );

  // ====================================================
  // Load Submissions
  // ====================================================

  const loadSubmissions =
    useCallback(async () => {
      try {
        setLoading(true);

        setErrorMessage("");

        if (
          statusFilter ===
          "recycle_bin"
        ) {
          const [
            rejectedResponse,
            approvedDeletedTestimonials,
          ] = await Promise.all([
            testimonialSubmissionService.getSubmissions(
              {
                page: 1,

                pageSize: 100,

                status:
                  "recycle_bin",

                search:
                  searchTerm,

                industry:
                  industryFilter,

                rating:
                  ratingFilter ||
                  null,

                hasConsent:
                  consentFilter ===
                  "all"
                    ? undefined
                    : consentFilter ===
                        "yes",
              },
            ),

            testimonialSubmissionService.getDeletedTestimonials(),
          ]);

          const rejectedItems =
            rejectedResponse.data.map(
              (submission) => ({
                ...submission,

                recycleBinType:
                  "rejected_submission",
              }),
            );

          const approvedItems =
            approvedDeletedTestimonials
              .filter(
                (testimonial) =>
                  matchesApprovedRecycleBinFilters(
                    testimonial,
                    {
                      searchTerm,

                      industryFilter,

                      ratingFilter,

                      consentFilter,
                    },
                  ),
              )
              .map(
                normalizeApprovedRecycleBinItem,
              );

          const recycleBinItems = [
            ...rejectedItems,

            ...approvedItems,
          ].sort(
            (
              firstItem,
              secondItem,
            ) =>
              new Date(
                secondItem.deleted_at,
              ).getTime() -
              new Date(
                firstItem.deleted_at,
              ).getTime(),
          );

          setSubmissions(
            recycleBinItems,
          );

          setTotalPages(1);

          setTotalRecords(
            recycleBinItems.length,
          );

          return;
        }

        const response =
          await testimonialSubmissionService.getSubmissions(
            {
              page: currentPage,

              pageSize:
                PAGE_SIZE,

              status:
                statusFilter,

              search:
                searchTerm,

              industry:
                industryFilter,

              rating:
                ratingFilter ||
                null,

              hasConsent:
                consentFilter ===
                "all"
                  ? undefined
                  : consentFilter ===
                      "yes",
            },
          );

        setSubmissions(
          response.data,
        );

        setTotalPages(
          response.pagination
            .totalPages,
        );

        setTotalRecords(
          response.pagination.total,
        );
      } catch (error) {
        if (
          import.meta.env.DEV
        ) {
          console.error(
            "Unable to load testimonial submissions:",
            error,
          );
        }

        setSubmissions([]);

        setTotalPages(1);

        setTotalRecords(0);

        setErrorMessage(
          error?.message ||
            "The testimonial submissions could not be loaded.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      currentPage,

      statusFilter,

      searchTerm,

      industryFilter,

      ratingFilter,

      consentFilter,
    ]);

  // ====================================================
  // Load Industry Options
  // ====================================================

  const loadIndustries =
    useCallback(async () => {
      try {
        const options =
          await testimonialSubmissionService.getIndustryOptions();

        setIndustries(options);
      } catch (error) {
        if (
          import.meta.env.DEV
        ) {
          console.error(
            "Unable to load industries:",
            error,
          );
        }
      }
    }, []);

  // ====================================================
  // Effects
  // ====================================================

  useEffect(() => {
    document.title =
      "Testimonial Submissions | VeoTek CMS";
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  useEffect(() => {
    loadIndustries();
  }, [loadIndustries]);

  useEffect(() => {
    const channel =
      testimonialSubmissionService.subscribeToSubmissions(
        {
          onInsert:
            loadSubmissions,

          onUpdate:
            loadSubmissions,

          onDelete:
            loadSubmissions,

          onStatusChange:
            setRealtimeStatus,

          onError: (
            error,
          ) => {
            if (
              import.meta.env
                .DEV
            ) {
              console.error(
                "Testimonial submission Realtime error:",
                error,
              );
            }
          },
        },
      );

    return () => {
      testimonialSubmissionService
        .unsubscribe(channel)
        .catch((error) => {
          if (
            import.meta.env.DEV
          ) {
            console.error(
              "Unable to unsubscribe from testimonial submissions:",
              error,
            );
          }
        });
    };
  }, [loadSubmissions]);

  // ====================================================
  // Filters
  // ====================================================

  function clearFilters() {
    setSearchTerm("");

    setIndustryFilter("");

    setRatingFilter("");

    setConsentFilter("all");

    setCurrentPage(1);
  }

  function changeStatus(status) {
    setStatusFilter(status);

    setCurrentPage(1);

    setSearchTerm("");

    setIndustryFilter("");

    setRatingFilter("");

    setConsentFilter("all");
  }

  // ====================================================
  // Approve Submission
  // ====================================================

  async function approveSubmission(
    submission,
    {
      isFeatured = false,

      displayOrder = 0,

      adminNotes = "",
    } = {},
  ) {
    const recordKey =
      getRecordKey(submission);

    try {
      setPendingId(recordKey);

      const approvedTestimonial =
        await testimonialSubmissionService.approveSubmission(
          submission.id,
          {
            isFeatured,

            displayOrder,

            adminNotes,
          },
        );

      const normalizedApprovedTestimonial =
        Array.isArray(
          approvedTestimonial,
        )
          ? approvedTestimonial[0]
          : approvedTestimonial;

      if (
        !normalizedApprovedTestimonial?.id ||
        String(
          normalizedApprovedTestimonial.submission_id,
        ) !==
          String(submission.id)
      ) {
        throw new Error(
          "The submission was approved, but the published testimonial could not be verified.",
        );
      }

      toast.success(
        "Testimonial approved and published.",
      );

      setApprovalState(
        INITIAL_APPROVAL_STATE,
      );

      await Promise.all([
        loadSubmissions(),

        loadIndustries(),
      ]);
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to approve the testimonial submission.",
      );
    } finally {
      setPendingId(null);
    }
  }

  // ====================================================
  // Reject Submission
  // ====================================================

  async function rejectSubmission(
    submission,
    adminNotes = "",
  ) {
    const recordKey =
      getRecordKey(submission);

    try {
      setPendingId(recordKey);

      await testimonialSubmissionService.rejectSubmission(
        submission.id,

        adminNotes,
      );

      toast.success(
        "Testimonial submission rejected.",
      );

      setRejectionState(
        INITIAL_REJECTION_STATE,
      );

      await loadSubmissions();
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to reject the testimonial submission.",
      );
    } finally {
      setPendingId(null);
    }
  }

  // ====================================================
  // Move Approved Testimonial to Recycle Bin
  // ====================================================

  async function moveApprovedTestimonialToRecycleBin(
    submission,
    reason = "",
  ) {
    if (
      !submission
        ?.approved_testimonial_id
    ) {
      toast.error(
        "This submission is not linked to a published testimonial.",
      );

      return;
    }

    const recordKey =
      getRecordKey(submission);

    try {
      setPendingId(recordKey);

      await testimonialSubmissionService.softDeleteApprovedTestimonial(
        submission.approved_testimonial_id,

        reason,
      );

      toast.success(
        "Testimonial moved to the Recycle Bin and removed from the public website.",
      );

      setApprovedDeleteState(
        INITIAL_APPROVED_DELETE_STATE,
      );

      await loadSubmissions();
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to move the testimonial to the Recycle Bin.",
      );
    } finally {
      setPendingId(null);
    }
  }

  // ====================================================
  // Restore Approved Testimonial
  // ====================================================

  async function restoreApprovedTestimonial(
    submission,
  ) {
    const testimonialId =
      submission
        ?.approved_testimonial_id;

    if (!testimonialId) {
      toast.error(
        "A published testimonial ID is required.",
      );

      return;
    }

    const recordKey =
      getRecordKey(submission);

    try {
      setPendingId(recordKey);

      await testimonialSubmissionService.restoreDeletedTestimonial(
        testimonialId,
      );

      toast.success(
        "Approved testimonial restored.",
      );

      await loadSubmissions();
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to restore the approved testimonial.",
      );
    } finally {
      setPendingId(null);
    }
  }

  // ====================================================
  // Permanently Delete Approved Testimonial
  // ====================================================

  async function permanentlyDeleteApprovedTestimonial(
    submission,
  ) {
    const testimonialId =
      submission
        ?.approved_testimonial_id;

    if (!testimonialId) {
      toast.error(
        "A published testimonial ID is required.",
      );

      return;
    }

    if (
      !submission
        .approved_testimonial
        ?.deleted_at
    ) {
      toast.error(
        "Move the testimonial to the Recycle Bin before deleting it permanently.",
      );

      return;
    }

    const recordKey =
      getRecordKey(submission);

    try {
      setPendingId(recordKey);

      await testimonialSubmissionService.permanentlyDeleteTestimonial(
        testimonialId,
      );

      toast.success(
        "Approved testimonial permanently deleted.",
      );

      setApprovedPermanentDeleteState(
        INITIAL_APPROVED_PERMANENT_DELETE_STATE,
      );

      setSubmissions(
        (
          currentSubmissions,
        ) =>
          currentSubmissions.filter(
            (
              currentSubmission,
            ) =>
              getRecordKey(
                currentSubmission,
              ) !== recordKey,
          ),
      );

      await loadSubmissions();
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to permanently delete the approved testimonial.",
      );
    } finally {
      setPendingId(null);
    }
  }

  // ====================================================
  // Move Rejected Submission to Recycle Bin
  // ====================================================

  async function moveRejectedSubmissionToRecycleBin(
    submission,
    reason = "",
  ) {
    const recordKey =
      getRecordKey(submission);

    try {
      setPendingId(recordKey);

      await testimonialSubmissionService.softDeleteRejectedSubmission(
        submission.id,

        reason,
      );

      toast.success(
        "Rejected testimonial moved to the Recycle Bin.",
      );

      setRejectedDeleteState(
        INITIAL_REJECTED_DELETE_STATE,
      );

      await loadSubmissions();
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to move the rejected testimonial to the Recycle Bin.",
      );
    } finally {
      setPendingId(null);
    }
  }

  // ====================================================
  // Restore Rejected Submission
  // ====================================================

  async function restoreRejectedSubmission(
    submission,
  ) {
    const recordKey =
      getRecordKey(submission);

    try {
      setPendingId(recordKey);

      await testimonialSubmissionService.restoreDeletedSubmission(
        submission.id,
      );

      toast.success(
        "Rejected testimonial restored.",
      );

      await loadSubmissions();
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to restore the rejected testimonial.",
      );
    } finally {
      setPendingId(null);
    }
  }

  // ====================================================
  // Permanently Delete Rejected Submission
  // ====================================================

  async function permanentlyDeleteRejectedSubmission(
    submission,
  ) {
    const recordKey =
      getRecordKey(submission);

    try {
      setPendingId(recordKey);

      await testimonialSubmissionService.permanentlyDeleteRejectedSubmission(
        submission.id,

        submission.client_photo_path,
      );

      toast.success(
        "Rejected testimonial permanently deleted.",
      );

      setRejectedPermanentDeleteState(
        INITIAL_REJECTED_PERMANENT_DELETE_STATE,
      );

      setSubmissions(
        (
          currentSubmissions,
        ) =>
          currentSubmissions.filter(
            (
              currentSubmission,
            ) =>
              getRecordKey(
                currentSubmission,
              ) !== recordKey,
          ),
      );

      await loadSubmissions();
    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to permanently delete the rejected testimonial.",
      );
    } finally {
      setPendingId(null);
    }
  }

  // ====================================================
  // Render
  // ====================================================

  return (
    <>
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-primary">
            Customer engagement
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Testimonial Submissions
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted sm:text-base">
            Review testimonials
            submitted from the public
            website, manage published
            testimonials, and restore or
            permanently delete items
            from the Recycle Bin.
          </p>
        </div>

        <div>
          <span
            className={[
              "inline-flex rounded-full border px-3 py-1.5",

              "text-xs font-semibold",

              realtimeStatus ===
              "SUBSCRIBED"
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                : "border-amber-500/20 bg-amber-500/5 text-amber-300",
            ].join(" ")}
          >
            {realtimeStatus ===
            "SUBSCRIBED"
              ? "Realtime synchronization active"
              : "Connecting Realtime synchronization"}
          </span>
        </div>

        {!loading &&
        !errorMessage ? (
          <div className="flex flex-wrap gap-3">
            <SummaryCard
              label={`${getStatusLabel(
                statusFilter,
              )} records`}
              value={
                statistics.total
              }
              icon={Filter}
            />
          </div>
        ) : null}

        <div className="border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto">
            {STATUS_OPTIONS.map(
              (option) => (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    changeStatus(
                      option.value,
                    )
                  }
                  className={[
                    "min-h-12 border-b-2 px-3 text-sm font-semibold",

                    statusFilter ===
                    option.value
                      ? "border-primary text-primary"
                      : "border-transparent text-muted",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              ),
            )}
          </div>
        </div>

        {!loading &&
        !errorMessage ? (
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-surface p-4 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(
                  event,
                ) => {
                  setSearchTerm(
                    event.target
                      .value,
                  );

                  setCurrentPage(
                    1,
                  );
                }}
                placeholder="Search submissions..."
                className="min-h-11 w-full rounded-xl border border-white/10 bg-dark py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-primary"
              />
            </div>

            <select
              value={
                industryFilter
              }
              onChange={(
                event,
              ) => {
                setIndustryFilter(
                  event.target
                    .value,
                );

                setCurrentPage(
                  1,
                );
              }}
              className="min-h-11 rounded-xl border border-white/10 bg-dark px-4 text-sm text-white"
            >
              <option value="">
                All industries
              </option>

              {industries.map(
                (industry) => (
                  <option
                    key={industry}
                    value={
                      industry
                    }
                  >
                    {industry}
                  </option>
                ),
              )}
            </select>

            <select
              value={
                ratingFilter
              }
              onChange={(
                event,
              ) => {
                setRatingFilter(
                  event.target
                    .value,
                );

                setCurrentPage(
                  1,
                );
              }}
              className="min-h-11 rounded-xl border border-white/10 bg-dark px-4 text-sm text-white"
            >
              <option value="">
                All ratings
              </option>

              {[5, 4, 3, 2, 1].map(
                (rating) => (
                  <option
                    key={rating}
                    value={
                      rating
                    }
                  >
                    {rating} stars
                  </option>
                ),
              )}
            </select>

            <select
              value={
                consentFilter
              }
              onChange={(
                event,
              ) => {
                setConsentFilter(
                  event.target
                    .value,
                );

                setCurrentPage(
                  1,
                );
              }}
              className="min-h-11 rounded-xl border border-white/10 bg-dark px-4 text-sm text-white"
            >
              <option value="all">
                All consent
              </option>

              <option value="yes">
                Consent granted
              </option>

              <option value="no">
                Consent missing
              </option>
            </select>

            <button
              type="button"
              onClick={
                loadSubmissions
              }
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
                aria-hidden="true"
              />

              Refresh
            </button>
          </div>
        ) : null}

        {loading ? (
          <LoadingState />
        ) : null}

        {!loading &&
        errorMessage ? (
          <ErrorState
            message={
              errorMessage
            }
            onRetry={
              loadSubmissions
            }
          />
        ) : null}

        {!loading &&
        !errorMessage &&
        submissions.length ===
          0 ? (
          <EmptyState
            hasFilters={
              hasFilters
            }
            statusFilter={
              statusFilter
            }
            onClearFilters={
              clearFilters
            }
          />
        ) : null}

        {!loading &&
        !errorMessage &&
        submissions.length >
          0 ? (
          <div className="space-y-4">
            {submissions.map(
              (submission) => (
                <SubmissionCard
                  key={getRecordKey(
                    submission,
                  )}
                  submission={
                    submission
                  }
                  pendingId={
                    pendingId
                  }
                  onView={(
                    item,
                  ) =>
                    setDetailsState(
                      {
                        isOpen:
                          true,

                        submission:
                          item,
                      },
                    )
                  }
                  onApprove={(
                    item,
                  ) =>
                    setApprovalState(
                      {
                        isOpen:
                          true,

                        submission:
                          item,

                        isFeatured:
                          false,

                        displayOrder:
                          0,

                        adminNotes:
                          "",
                      },
                    )
                  }
                  onReject={(
                    item,
                  ) =>
                    setRejectionState(
                      {
                        isOpen:
                          true,

                        submission:
                          item,

                        adminNotes:
                          "",
                      },
                    )
                  }
                  onMoveApprovedToRecycleBin={(
                    item,
                  ) =>
                    setApprovedDeleteState(
                      {
                        isOpen:
                          true,

                        submission:
                          item,

                        reason:
                          "",
                      },
                    )
                  }
                  onRestoreApproved={
                    restoreApprovedTestimonial
                  }
                  onPermanentlyDeleteApproved={(
                    item,
                  ) =>
                    setApprovedPermanentDeleteState(
                      {
                        isOpen:
                          true,

                        submission:
                          item,
                      },
                    )
                  }
                  onMoveRejectedToRecycleBin={(
                    item,
                  ) =>
                    setRejectedDeleteState(
                      {
                        isOpen:
                          true,

                        submission:
                          item,

                        reason:
                          "",
                      },
                    )
                  }
                  onRestoreRejected={
                    restoreRejectedSubmission
                  }
                  onPermanentlyDeleteRejected={(
                    item,
                  ) =>
                    setRejectedPermanentDeleteState(
                      {
                        isOpen:
                          true,

                        submission:
                          item,
                      },
                    )
                  }
                />
              ),
            )}
          </div>
        ) : null}

        {!loading &&
        !errorMessage &&
        statusFilter !==
          "recycle_bin" &&
        totalPages > 1 ? (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface px-4 py-3">
            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1,
                    ),
                )
              }
              disabled={
                currentPage <= 1
              }
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-muted">
              Page {currentPage}{" "}
              of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1,
                    ),
                )
              }
              disabled={
                currentPage >=
                totalPages
              }
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </section>

      {/* Details Modal */}

      {detailsState.isOpen &&
      detailsState.submission ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-dark/85 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-details-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="testimonial-details-title"
                  className="text-xl font-semibold text-white"
                >
                  Testimonial
                  details
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Review the
                  complete
                  testimonial
                  record.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDetailsState(
                    INITIAL_DETAILS_STATE,
                  )
                }
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <p className="text-white">
                <span className="font-semibold">
                  Client:
                </span>{" "}
                {detailsState
                  .submission
                  .client_name ||
                  "Not provided"}
              </p>

              <p className="text-muted">
                <span className="font-semibold text-white">
                  Position:
                </span>{" "}
                {detailsState
                  .submission
                  .position ||
                  "Not provided"}
              </p>

              <p className="text-muted">
                <span className="font-semibold text-white">
                  Company:
                </span>{" "}
                {detailsState
                  .submission
                  .company ||
                  "Not provided"}
              </p>

              <p className="text-muted">
                <span className="font-semibold text-white">
                  Location:
                </span>{" "}
                {detailsState
                  .submission
                  .location ||
                  "Not provided"}
              </p>

              <p className="text-muted">
                <span className="font-semibold text-white">
                  Industry:
                </span>{" "}
                {detailsState
                  .submission
                  .industry ||
                  "Not provided"}
              </p>

              <RatingDisplay
                rating={
                  detailsState
                    .submission
                    .rating
                }
              />

              <blockquote className="rounded-xl border border-white/10 bg-dark/40 p-4 leading-7 text-slate-300">
                “
                {
                  detailsState
                    .submission
                    .review
                }
                ”
              </blockquote>

              {detailsState
                .submission
                .admin_notes ? (
                <p className="text-muted">
                  <span className="font-semibold text-white">
                    Admin notes:
                  </span>{" "}
                  {
                    detailsState
                      .submission
                      .admin_notes
                  }
                </p>
              ) : null}

              {detailsState
                .submission
                .delete_reason ? (
                <p className="text-red-200/80">
                  <span className="font-semibold text-red-200">
                    Delete reason:
                  </span>{" "}
                  {
                    detailsState
                      .submission
                      .delete_reason
                  }
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Approval Modal */}

      {approvalState.isOpen &&
      approvalState.submission ? (
        <div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-dark/85 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approve-testimonial-title"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-surface p-6">
            <h2
              id="approve-testimonial-title"
              className="text-xl font-semibold text-white"
            >
              Approve testimonial
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Approving this
              submission immediately
              adds it to the published
              Testimonials collection.
            </p>

            <div className="mt-6 space-y-5">
              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-dark/40 p-4">
                <input
                  type="checkbox"
                  checked={
                    approvalState
                      .isFeatured
                  }
                  onChange={(
                    event,
                  ) =>
                    setApprovalState(
                      (
                        current,
                      ) => ({
                        ...current,

                        isFeatured:
                          event
                            .target
                            .checked,
                      }),
                    )
                  }
                  disabled={
                    pendingId ===
                    getRecordKey(
                      approvalState
                        .submission,
                    )
                  }
                  className="mt-1 size-4 accent-primary"
                />

                <span>
                  <span className="block text-sm font-semibold text-white">
                    Feature this
                    testimonial
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-muted">
                    Featured
                    testimonials may
                    appear in
                    highlighted
                    website sections.
                  </span>
                </span>
              </label>

              <div>
                <label
                  htmlFor="testimonial-display-order"
                  className="text-sm font-semibold text-white"
                >
                  Display order
                </label>

                <input
                  id="testimonial-display-order"
                  type="number"
                  min="0"
                  step="1"
                  value={
                    approvalState
                      .displayOrder
                  }
                  onChange={(
                    event,
                  ) =>
                    setApprovalState(
                      (
                        current,
                      ) => ({
                        ...current,

                        displayOrder:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  disabled={
                    pendingId ===
                    getRecordKey(
                      approvalState
                        .submission,
                    )
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none focus:border-primary"
                />

                <p className="mt-1 text-xs text-muted">
                  Lower numbers
                  appear first.
                </p>
              </div>

              <div>
                <label
                  htmlFor="testimonial-approval-notes"
                  className="text-sm font-semibold text-white"
                >
                  Admin notes
                </label>

                <textarea
                  id="testimonial-approval-notes"
                  rows={4}
                  maxLength={
                    2000
                  }
                  value={
                    approvalState
                      .adminNotes
                  }
                  onChange={(
                    event,
                  ) =>
                    setApprovalState(
                      (
                        current,
                      ) => ({
                        ...current,

                        adminNotes:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  disabled={
                    pendingId ===
                    getRecordKey(
                      approvalState
                        .submission,
                    )
                  }
                  placeholder="Optional internal notes..."
                  className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-white outline-none placeholder:text-muted focus:border-primary"
                />

                <p className="mt-1 text-right text-xs text-muted">
                  {
                    approvalState
                      .adminNotes
                      .length
                  }
                  /2000
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setApprovalState(
                    INITIAL_APPROVAL_STATE,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    approvalState
                      .submission,
                  )
                }
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  approveSubmission(
                    approvalState
                      .submission,
                    {
                      isFeatured:
                        approvalState
                          .isFeatured,

                      displayOrder:
                        Number(
                          approvalState
                            .displayOrder,
                        ),

                      adminNotes:
                        approvalState
                          .adminNotes,
                    },
                  )
                }
                disabled={
                  pendingId ===
                    getRecordKey(
                      approvalState
                        .submission,
                    ) ||
                  !Number.isInteger(
                    Number(
                      approvalState
                        .displayOrder,
                    ),
                  ) ||
                  Number(
                    approvalState
                      .displayOrder,
                  ) < 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingId ===
                getRecordKey(
                  approvalState
                    .submission,
                ) ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />

                    Approving...
                  </>
                ) : (
                  "Approve"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Rejection Modal */}

      {rejectionState.isOpen &&
      rejectionState.submission ? (
        <div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-dark/85 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-testimonial-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-6">
            <h2
              id="reject-testimonial-title"
              className="text-xl font-semibold text-white"
            >
              Reject testimonial
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              The submission
              remains in the CMS as
              rejected and will not
              appear on the public
              website.
            </p>

            <div className="mt-6">
              <label
                htmlFor="testimonial-rejection-notes"
                className="text-sm font-semibold text-white"
              >
                Rejection notes
              </label>

              <textarea
                id="testimonial-rejection-notes"
                rows={4}
                maxLength={2000}
                value={
                  rejectionState
                    .adminNotes
                }
                onChange={(
                  event,
                ) =>
                  setRejectionState(
                    (
                      current,
                    ) => ({
                      ...current,

                      adminNotes:
                        event
                          .target
                          .value,
                    }),
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    rejectionState
                      .submission,
                  )
                }
                placeholder="Explain why the submission was rejected..."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-white outline-none placeholder:text-muted focus:border-primary"
              />

              <p className="mt-1 text-right text-xs text-muted">
                {
                  rejectionState
                    .adminNotes
                    .length
                }
                /2000
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setRejectionState(
                    INITIAL_REJECTION_STATE,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    rejectionState
                      .submission,
                  )
                }
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  rejectSubmission(
                    rejectionState
                      .submission,

                    rejectionState
                      .adminNotes,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    rejectionState
                      .submission,
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingId ===
                getRecordKey(
                  rejectionState
                    .submission,
                ) ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />

                    Rejecting...
                  </>
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Approved Recycle Bin Modal */}

      {approvedDeleteState.isOpen &&
      approvedDeleteState.submission ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-dark/85 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approved-delete-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-surface p-6">
            <h2
              id="approved-delete-title"
              className="text-xl font-semibold text-white"
            >
              Move approved
              testimonial to
              Recycle Bin
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              This removes the
              testimonial from the
              public website. It can
              be restored from the
              Recycle Bin.
            </p>

            <div className="mt-6">
              <label
                htmlFor="approved-delete-reason"
                className="text-sm font-semibold text-white"
              >
                Delete reason
              </label>

              <textarea
                id="approved-delete-reason"
                rows={4}
                maxLength={500}
                value={
                  approvedDeleteState
                    .reason
                }
                onChange={(
                  event,
                ) =>
                  setApprovedDeleteState(
                    (
                      current,
                    ) => ({
                      ...current,

                      reason:
                        event
                          .target
                          .value,
                    }),
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    approvedDeleteState
                      .submission,
                  )
                }
                placeholder="Optional reason for removing this approved testimonial..."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-white outline-none placeholder:text-muted focus:border-red-400"
              />

              <p className="mt-1 text-right text-xs text-muted">
                {
                  approvedDeleteState
                    .reason.length
                }
                /500
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setApprovedDeleteState(
                    INITIAL_APPROVED_DELETE_STATE,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    approvedDeleteState
                      .submission,
                  )
                }
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  moveApprovedTestimonialToRecycleBin(
                    approvedDeleteState
                      .submission,

                    approvedDeleteState
                      .reason,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    approvedDeleteState
                      .submission,
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingId ===
                getRecordKey(
                  approvedDeleteState
                    .submission,
                ) ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />

                    Moving...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={16}
                      aria-hidden="true"
                    />

                    Move to
                    Recycle Bin
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Rejected Recycle Bin Modal */}

      {rejectedDeleteState.isOpen &&
      rejectedDeleteState.submission ? (
        <div
          className="fixed inset-0 z-[92] flex items-center justify-center bg-dark/85 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rejected-delete-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-surface p-6">
            <h2
              id="rejected-delete-title"
              className="text-xl font-semibold text-white"
            >
              Move rejected
              testimonial to
              Recycle Bin
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              This removes the
              submission from the
              normal Rejected list.
              It can be restored
              later.
            </p>

            <div className="mt-6">
              <label
                htmlFor="rejected-delete-reason"
                className="text-sm font-semibold text-white"
              >
                Delete reason
              </label>

              <textarea
                id="rejected-delete-reason"
                rows={4}
                maxLength={500}
                value={
                  rejectedDeleteState
                    .reason
                }
                onChange={(
                  event,
                ) =>
                  setRejectedDeleteState(
                    (
                      current,
                    ) => ({
                      ...current,

                      reason:
                        event
                          .target
                          .value,
                    }),
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    rejectedDeleteState
                      .submission,
                  )
                }
                placeholder="Optional reason for removing this rejected submission..."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-white outline-none placeholder:text-muted focus:border-red-400"
              />

              <p className="mt-1 text-right text-xs text-muted">
                {
                  rejectedDeleteState
                    .reason.length
                }
                /500
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setRejectedDeleteState(
                    INITIAL_REJECTED_DELETE_STATE,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    rejectedDeleteState
                      .submission,
                  )
                }
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  moveRejectedSubmissionToRecycleBin(
                    rejectedDeleteState
                      .submission,

                    rejectedDeleteState
                      .reason,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    rejectedDeleteState
                      .submission,
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingId ===
                getRecordKey(
                  rejectedDeleteState
                    .submission,
                ) ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />

                    Moving...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={16}
                      aria-hidden="true"
                    />

                    Move to
                    Recycle Bin
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Approved Permanent Delete Modal */}

      {approvedPermanentDeleteState.isOpen &&
      approvedPermanentDeleteState.submission ? (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-dark/85 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approved-permanent-delete-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-surface p-6">
            <h2
              id="approved-permanent-delete-title"
              className="text-xl font-semibold text-white"
            >
              Delete approved
              testimonial
              permanently
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              This permanently
              removes the published
              testimonial from the
              database. This action
              cannot be undone.
            </p>

            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="font-semibold text-red-200">
                {
                  approvedPermanentDeleteState
                    .submission
                    .client_name
                }
              </p>

              <p className="mt-1 text-xs text-red-200/80">
                Only administrators
                can complete this
                action.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setApprovedPermanentDeleteState(
                    INITIAL_APPROVED_PERMANENT_DELETE_STATE,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    approvedPermanentDeleteState
                      .submission,
                  )
                }
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  permanentlyDeleteApprovedTestimonial(
                    approvedPermanentDeleteState
                      .submission,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    approvedPermanentDeleteState
                      .submission,
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingId ===
                getRecordKey(
                  approvedPermanentDeleteState
                    .submission,
                ) ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={16}
                      aria-hidden="true"
                    />

                    Delete
                    Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Rejected Permanent Delete Modal */}

      {rejectedPermanentDeleteState.isOpen &&
      rejectedPermanentDeleteState.submission ? (
        <div
          className="fixed inset-0 z-[98] flex items-center justify-center bg-dark/85 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rejected-permanent-delete-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-surface p-6">
            <h2
              id="rejected-permanent-delete-title"
              className="text-xl font-semibold text-white"
            >
              Delete rejected
              testimonial
              permanently
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              This permanently
              removes the rejected
              testimonial submission
              and cannot be undone.
            </p>

            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="font-semibold text-red-200">
                {
                  rejectedPermanentDeleteState
                    .submission
                    .client_name
                }
              </p>

              <p className="mt-1 text-xs text-red-200/80">
                Only administrators
                can complete this
                action.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setRejectedPermanentDeleteState(
                    INITIAL_REJECTED_PERMANENT_DELETE_STATE,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    rejectedPermanentDeleteState
                      .submission,
                  )
                }
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  permanentlyDeleteRejectedSubmission(
                    rejectedPermanentDeleteState
                      .submission,
                  )
                }
                disabled={
                  pendingId ===
                  getRecordKey(
                    rejectedPermanentDeleteState
                      .submission,
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingId ===
                getRecordKey(
                  rejectedPermanentDeleteState
                    .submission,
                ) ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={16}
                      aria-hidden="true"
                    />

                    Delete
                    Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}