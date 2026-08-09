// ======================================================
// React Imports
// ======================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ======================================================
// Icon Imports
// ======================================================

import {
  Activity,
  AlertCircle,
  Loader2,
  RefreshCw,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

// ======================================================
// Application Imports
// ======================================================

import serviceService from "../../services/serviceService";

// ======================================================
// Audit Action Configuration
// ======================================================

const ACTION_CONFIG = {
  soft_deleted: {
    label: "Moved to Recycle Bin",
    icon: Trash2,
    badgeClassName:
      "bg-amber-500/10 text-amber-300",
    iconClassName: "text-amber-400",
  },

  restored: {
    label: "Restored",
    icon: RotateCcw,
    badgeClassName:
      "bg-emerald-500/10 text-emerald-300",
    iconClassName: "text-emerald-400",
  },

  permanently_deleted: {
    label: "Permanently deleted",
    icon: Trash2,
    badgeClassName:
      "bg-red-500/10 text-red-300",
    iconClassName: "text-red-400",
  },
};

const DEFAULT_ACTION_CONFIG = {
  label: "Service activity",
  icon: Activity,
  badgeClassName:
    "bg-white/5 text-muted",
  iconClassName: "text-muted",
};

// ======================================================
// Date Formatting
// ======================================================

function formatDate(dateValue) {
  if (!dateValue) {
    return "Date unavailable";
  }

  const parsedDate =
    new Date(dateValue);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  ).format(parsedDate);
}

// ======================================================
// Text Formatting
// ======================================================

function formatRole(role) {
  if (
    !role ||
    typeof role !== "string"
  ) {
    return "Unknown role";
  }

  return role
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}

// ======================================================
// Audit Metadata Helpers
// ======================================================

function getAuditReason(record) {
  if (!record?.metadata) {
    return null;
  }

  return (
    record.metadata.reason ??
    record.metadata
      .previous_delete_reason ??
    record.metadata
      .original_delete_reason ??
    null
  );
}

function getSnapshotTitle(record) {
  return (
    record?.entity_snapshot
      ?.title ??
    "Untitled service"
  );
}

function getSnapshotSlug(record) {
  return (
    record?.entity_snapshot
      ?.slug ??
    null
  );
}

// ======================================================
// Loading State
// ======================================================

function LoadingState() {
  return (
    <div
      className="flex min-h-64 items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className="size-8 animate-spin text-primary"
          aria-hidden="true"
        />

        <p className="text-sm text-muted">
          Loading audit history...
        </p>
      </div>

      <span className="sr-only">
        Loading service audit history
      </span>
    </div>
  );
}

// ======================================================
// Error State
// ======================================================

function ErrorState({
  message,
  onRetry,
  isRetrying,
}) {
  return (
    <div className="flex min-h-64 items-center justify-center px-5 py-10">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertCircle
            className="text-red-400"
            size={27}
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-white">
          Unable to load audit history
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRetrying ? (
            <Loader2
              className="animate-spin"
              size={17}
              aria-hidden="true"
            />
          ) : (
            <RefreshCw
              size={17}
              aria-hidden="true"
            />
          )}

          {isRetrying
            ? "Retrying..."
            : "Try again"}
        </button>
      </div>
    </div>
  );
}

// ======================================================
// Empty State
// ======================================================

function EmptyState() {
  return (
    <div className="flex min-h-64 items-center justify-center px-5 py-10">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Activity
            className="text-primary"
            size={27}
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-white">
          No audit history yet
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted">
          Delete, restore and permanent removal activity
          for this service will appear here.
        </p>
      </div>
    </div>
  );
}

// ======================================================
// Audit Record Component
// ======================================================

function AuditRecord({ record }) {
  const config =
    ACTION_CONFIG[
      record?.action
    ] ??
    DEFAULT_ACTION_CONFIG;

  const ActionIcon =
    config.icon;

  const reason =
    getAuditReason(record);

  const snapshotTitle =
    getSnapshotTitle(record);

  const snapshotSlug =
    getSnapshotSlug(record);

  return (
    <article className="rounded-2xl border border-white/10 bg-dark/40 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
          <ActionIcon
            className={
              config.iconClassName
            }
            size={19}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span
                className={[
                  "inline-flex rounded-full px-2.5 py-1",
                  "text-xs font-semibold",
                  config.badgeClassName,
                ].join(" ")}
              >
                {config.label}
              </span>

              <p className="mt-3 break-words text-sm text-white">
                Service:{" "}
                <span className="font-semibold">
                  {snapshotTitle}
                </span>
              </p>

              {snapshotSlug ? (
                <p className="mt-1 break-all text-xs text-muted">
                  /{snapshotSlug}
                </p>
              ) : null}

              <p className="mt-2 text-sm text-muted">
                Performed by{" "}
                <span className="font-semibold text-white">
                  {formatRole(
                    record?.actor_role
                  )}
                </span>
              </p>
            </div>

            <time
              dateTime={
                record?.created_at ??
                undefined
              }
              className="shrink-0 text-xs text-muted"
            >
              {formatDate(
                record?.created_at
              )}
            </time>
          </div>

          {reason ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-surface px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Reason
              </p>

              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-white">
                {reason}
              </p>
            </div>
          ) : null}

          <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
            <div>
              <dt className="text-muted">
                Action ID
              </dt>

              <dd className="mt-1 break-all text-white">
                {record?.id ||
                  "Unavailable"}
              </dd>
            </div>

            <div>
              <dt className="text-muted">
                Actor ID
              </dt>

              <dd className="mt-1 break-all text-white">
                {record?.actor_id ||
                  "Unavailable"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}

// ======================================================
// Main Component
// ======================================================

export default function ServiceAuditModal({
  isOpen,
  service,
  onClose,
}) {
  // ====================================================
  // Refs
  // ====================================================

  const closeButtonRef =
    useRef(null);

  const requestIdRef =
    useRef(0);

  // ====================================================
  // State
  // ====================================================

  const [
    auditRecords,
    setAuditRecords,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  // ====================================================
  // Stable Derived Values
  // ====================================================

  const serviceId =
    service?.id ?? null;

  const serviceTitle =
    useMemo(() => {
      return (
        service?.title?.trim() ||
        "Untitled service"
      );
    }, [service?.title]);

  // ====================================================
  // Load Audit History
  // ====================================================

  const loadAuditHistory =
    useCallback(async () => {
      const currentRequestId =
        requestIdRef.current + 1;

      requestIdRef.current =
        currentRequestId;

      if (!serviceId) {
        setAuditRecords([]);
        setLoading(false);
        setErrorMessage(
          "A valid service was not selected."
        );
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        const records =
          await serviceService
            .getServiceAuditHistory(
              serviceId
            );

        if (
          requestIdRef.current !==
          currentRequestId
        ) {
          return;
        }

        setAuditRecords(
          Array.isArray(records)
            ? records
            : []
        );
      } catch (error) {
        if (
          requestIdRef.current !==
          currentRequestId
        ) {
          return;
        }

        console.error(
          "Unable to load service audit history:",
          error
        );

        setAuditRecords([]);

        setErrorMessage(
          error?.message ||
            "The service audit history could not be loaded."
        );
      } finally {
        if (
          requestIdRef.current ===
          currentRequestId
        ) {
          setLoading(false);
        }
      }
    }, [serviceId]);

  // ====================================================
  // Modal Lifecycle
  // ====================================================

  useEffect(() => {
    if (
      !isOpen ||
      !serviceId
    ) {
      return undefined;
    }

    setAuditRecords([]);
    setErrorMessage("");

    loadAuditHistory();

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const focusTimer =
      window.setTimeout(() => {
        closeButtonRef.current
          ?.focus();
      }, 50);

    function handleEscape(event) {
      if (
        event.key === "Escape"
      ) {
        onClose?.();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      requestIdRef.current += 1;

      window.clearTimeout(
        focusTimer
      );

      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    isOpen,
    serviceId,
    loadAuditHistory,
    onClose,
  ]);

  // ====================================================
  // Close Handler
  // ====================================================

  function handleClose() {
    if (!loading) {
      onClose?.();
    }
  }

  // ====================================================
  // Early Return
  // ====================================================

  if (
    !isOpen ||
    !service ||
    !serviceId
  ) {
    return null;
  }

  // ====================================================
  // Render
  // ====================================================

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-audit-title"
      aria-describedby="service-audit-description"
    >
      {/* ==================================================
          Backdrop
      ================================================== */}

      <button
        type="button"
        onClick={handleClose}
        disabled={loading}
        aria-label="Close audit history"
        className="absolute inset-0 cursor-default bg-dark/85 backdrop-blur-sm disabled:cursor-not-allowed"
      />

      {/* ==================================================
          Modal Container
      ================================================== */}

      <section className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-surface shadow-2xl sm:max-w-3xl sm:rounded-2xl">
        {/* ==================================================
            Header
        ================================================== */}

        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Activity
                className="text-primary"
                size={22}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2
                id="service-audit-title"
                className="text-lg font-semibold text-white"
              >
                Service audit history
              </h2>

              <p
                id="service-audit-description"
                className="mt-1 break-words text-sm leading-6 text-muted"
              >
                Lifecycle activity for{" "}
                <span className="font-semibold text-white">
                  {serviceTitle}
                </span>
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close audit history"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X
              size={20}
              aria-hidden="true"
            />
          </button>
        </header>

        {/* ==================================================
            Content
        ================================================== */}

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          {loading ? (
            <LoadingState />
          ) : null}

          {!loading &&
          errorMessage ? (
            <ErrorState
              message={errorMessage}
              onRetry={
                loadAuditHistory
              }
              isRetrying={loading}
            />
          ) : null}

          {!loading &&
          !errorMessage &&
          auditRecords.length ===
            0 ? (
            <EmptyState />
          ) : null}

          {!loading &&
          !errorMessage &&
          auditRecords.length > 0 ? (
            <div className="space-y-4">
              {auditRecords.map(
                (record) => (
                  <AuditRecord
                    key={record.id}
                    record={record}
                  />
                )
              )}
            </div>
          ) : null}
        </div>

        {/* ==================================================
            Footer
        ================================================== */}

        <footer className="flex shrink-0 justify-end border-t border-white/10 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}