// ======================================================
// React Imports
// ======================================================

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ======================================================
// Icon Imports
// ======================================================

import {
  AlertTriangle,
  Loader2,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

// ======================================================
// Library Imports
// ======================================================

import toast from "react-hot-toast";

// ======================================================
// Application Imports
// ======================================================

import useAuth from "../../hooks/useAuth";
import serviceService from "../../services/serviceService";

// ======================================================
// Action Configuration
// ======================================================

const ACTION_CONFIG = {
  delete: {
    title: "Move service to Recycle Bin",
    description:
      "The service will be removed from active content but can be restored later.",
    confirmLabel: "Move to Recycle Bin",
    loadingLabel: "Moving to Recycle Bin...",
    successMessage:
      "Service moved to the Recycle Bin.",
    icon: Trash2,
    iconClassName: "text-amber-400",
    iconContainerClassName:
      "bg-amber-500/10",
    buttonClassName:
      "bg-amber-400 text-slate-950 hover:bg-amber-300",
  },

  restore: {
    title: "Restore service",
    description:
      "The service will return to the active services list.",
    confirmLabel: "Restore service",
    loadingLabel: "Restoring service...",
    successMessage:
      "Service restored successfully.",
    icon: RotateCcw,
    iconClassName: "text-emerald-400",
    iconContainerClassName:
      "bg-emerald-500/10",
    buttonClassName:
      "bg-emerald-400 text-slate-950 hover:bg-emerald-300",
  },

  permanentDelete: {
    title: "Delete service permanently",
    description:
      "This action cannot be undone. The service will be removed permanently, but its audit record will remain.",
    confirmLabel: "Delete forever",
    loadingLabel:
      "Deleting permanently...",
    successMessage:
      "Service permanently deleted.",
    icon: AlertTriangle,
    iconClassName: "text-red-400",
    iconContainerClassName:
      "bg-red-500/10",
    buttonClassName:
      "bg-red-500 text-white hover:bg-red-400",
  },
};

// ======================================================
// Constants
// ======================================================

const MAX_DELETE_REASON_LENGTH = 500;

// ======================================================
// Error Mapping
// ======================================================

function getActionErrorMessage(
  error,
  action
) {
  const fallbackMessages = {
    delete:
      "Unable to move the service to the Recycle Bin.",
    restore:
      "Unable to restore the service.",
    permanentDelete:
      "Unable to permanently delete the service.",
  };

  if (!error) {
    return (
      fallbackMessages[action] ||
      "Unable to complete this action."
    );
  }

  if (error.code === "42501") {
    return "You do not have permission to perform this action.";
  }

  if (error.code === "23505") {
    return "The service cannot be restored because its slug is already in use.";
  }

  if (error.code === "P0002") {
    return "The requested service could not be found.";
  }

  if (error.code === "22001") {
    return "The deletion reason exceeds the allowed length.";
  }

  return (
    error.message ||
    fallbackMessages[action] ||
    "Unable to complete this action."
  );
}

// ======================================================
// Main Component
// ======================================================

export default function ServiceActionModal({
  isOpen,
  action,
  service,
  onClose,
  onActionCompleted,
}) {
  // ====================================================
  // Authentication and Permissions
  // ====================================================

  const {
    profile,
    isAdmin,
    isEditor,
    isActive,
  } = useAuth();

  // ====================================================
  // Refs
  // ====================================================

  const cancelButtonRef =
    useRef(null);

  const reasonInputRef =
    useRef(null);

  // ====================================================
  // Local State
  // ====================================================

  const [
    deleteReason,
    setDeleteReason,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  // ====================================================
  // Derived Values
  // ====================================================

  const config =
    ACTION_CONFIG[action];

  const ActionIcon =
    config?.icon;

  const serviceTitle =
    service?.title?.trim() ||
    "Untitled service";

  const canSoftDelete =
    isActive &&
    (isAdmin || isEditor);

  const canRestore =
    isActive &&
    (isAdmin || isEditor);

  const canPermanentlyDelete =
    isActive && isAdmin;

  const hasPermission =
    useMemo(() => {
      if (action === "delete") {
        return canSoftDelete;
      }

      if (action === "restore") {
        return canRestore;
      }

      if (
        action ===
        "permanentDelete"
      ) {
        return canPermanentlyDelete;
      }

      return false;
    }, [
      action,
      canSoftDelete,
      canRestore,
      canPermanentlyDelete,
    ]);

  const isProtectedService =
    Boolean(
      service?.is_system_service
    );

  const isAlreadyDeleted =
    Boolean(service?.deleted_at);

  const isActionBlocked =
    !hasPermission ||
    isSubmitting ||
    (
      isProtectedService &&
      (
        action === "delete" ||
        action === "permanentDelete"
      )
    );

  // ====================================================
  // Modal Lifecycle
  // ====================================================

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setDeleteReason("");
    setIsSubmitting(false);

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const focusTimer =
      window.setTimeout(() => {
        if (
          action === "delete"
        ) {
          reasonInputRef.current?.focus();
        } else {
          cancelButtonRef.current?.focus();
        }
      }, 50);

    function handleEscape(event) {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose?.();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
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
    action,
    isSubmitting,
    onClose,
  ]);

  // ====================================================
  // Early Return
  // ====================================================

  if (
    !isOpen ||
    !service ||
    !config
  ) {
    return null;
  }

  // ====================================================
  // Close Handler
  // ====================================================

  function handleClose() {
    if (!isSubmitting) {
      onClose?.();
    }
  }

  // ====================================================
  // Delete Reason Handler
  // ====================================================

  function handleDeleteReasonChange(
    event
  ) {
    const { value } =
      event.target;

    if (
      value.length <=
      MAX_DELETE_REASON_LENGTH
    ) {
      setDeleteReason(value);
    }
  }

  // ====================================================
  // Permission and State Validation
  // ====================================================

  function validateAction() {
    if (!profile) {
      throw new Error(
        "Your CMS profile could not be verified."
      );
    }

    if (!isActive) {
      throw new Error(
        "Your CMS account is inactive."
      );
    }

    if (!hasPermission) {
      if (
        action ===
        "permanentDelete"
      ) {
        throw new Error(
          "Only administrators can permanently delete services."
        );
      }

      throw new Error(
        "You do not have permission to perform this action."
      );
    }

    if (
      isProtectedService &&
      (
        action === "delete" ||
        action === "permanentDelete"
      )
    ) {
      throw new Error(
        "System services cannot be deleted."
      );
    }

    if (
      action === "delete" &&
      isAlreadyDeleted
    ) {
      throw new Error(
        "This service is already in the Recycle Bin."
      );
    }

    if (
      (
        action === "restore" ||
        action ===
          "permanentDelete"
      ) &&
      !isAlreadyDeleted
    ) {
      throw new Error(
        "This service is not in the Recycle Bin."
      );
    }

    if (
      deleteReason.trim().length >
      MAX_DELETE_REASON_LENGTH
    ) {
      throw new Error(
        `Delete reason cannot exceed ${MAX_DELETE_REASON_LENGTH} characters.`
      );
    }
  }

  // ====================================================
  // Submit Action
  // ====================================================

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      validateAction();

      setIsSubmitting(true);

      let result = null;

      if (action === "delete") {
        result =
          await serviceService.softDeleteService(
            service.id,
            deleteReason
          );
      }

      if (action === "restore") {
        result =
          await serviceService.restoreService(
            service.id
          );
      }

      if (
        action ===
        "permanentDelete"
      ) {
        result =
          await serviceService.permanentlyDeleteService(
            service.id
          );
      }

      toast.success(
        config.successMessage
      );

      onActionCompleted?.({
        action,
        service,
        result,
      });

      onClose?.();
    } catch (error) {
      console.error(
        `Unable to complete service action "${action}":`,
        error
      );

      toast.error(
        getActionErrorMessage(
          error,
          action
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ====================================================
  // Render
  // ====================================================

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-action-title"
      aria-describedby="service-action-description"
    >
      {/* ==================================================
          Backdrop
      ================================================== */}

      <button
        type="button"
        onClick={handleClose}
        disabled={isSubmitting}
        aria-label="Close confirmation dialog"
        className="absolute inset-0 cursor-default bg-dark/85 backdrop-blur-sm disabled:cursor-not-allowed"
      />

      {/* ==================================================
          Modal Container
      ================================================== */}

      <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-surface shadow-2xl sm:max-w-lg sm:rounded-2xl">
        {/* ==================================================
            Header
        ================================================== */}

        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={[
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                config.iconContainerClassName,
              ].join(" ")}
            >
              <ActionIcon
                className={
                  config.iconClassName
                }
                size={22}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2
                id="service-action-title"
                className="text-lg font-semibold text-white"
              >
                {config.title}
              </h2>

              <p
                id="service-action-description"
                className="mt-1 text-sm leading-6 text-muted"
              >
                {config.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X
              size={20}
              aria-hidden="true"
            />
          </button>
        </header>

        {/* ==================================================
            Confirmation Form
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-5 py-6 sm:px-6"
        >
          {/* ==================================================
              Selected Service
          ================================================== */}

          <div className="rounded-xl border border-white/10 bg-dark/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Selected service
            </p>

            <p className="mt-2 break-words font-semibold text-white">
              {serviceTitle}
            </p>

            <p className="mt-1 break-all text-sm text-muted">
              /{service.slug}
            </p>

            {service.short_description ? (
              <p className="mt-3 text-sm leading-6 text-muted">
                {
                  service.short_description
                }
              </p>
            ) : null}

            {isProtectedService ? (
              <p className="mt-3 text-xs font-semibold text-red-400">
                This is a protected system service.
              </p>
            ) : null}
          </div>

          {/* ==================================================
              Delete Reason
          ================================================== */}

          {action === "delete" ? (
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="service-delete-reason"
                  className="text-sm font-medium text-white"
                >
                  Reason for deletion
                </label>

                <span className="text-xs text-muted">
                  Optional
                </span>
              </div>

              <textarea
                ref={reasonInputRef}
                id="service-delete-reason"
                value={deleteReason}
                onChange={
                  handleDeleteReasonChange
                }
                disabled={isSubmitting}
                rows={4}
                maxLength={
                  MAX_DELETE_REASON_LENGTH
                }
                placeholder="Explain why this service is being moved to the Recycle Bin."
                className="w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-right text-xs text-muted">
                {deleteReason.length}/
                {
                  MAX_DELETE_REASON_LENGTH
                }
              </p>
            </div>
          ) : null}

          {/* ==================================================
              Restore Information
          ================================================== */}

          {action === "restore" ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
              <p className="text-sm font-semibold text-emerald-300">
                Restore this service?
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                The service will return to the active
                services list with its previous content
                and publishing status.
              </p>
            </div>
          ) : null}

          {/* ==================================================
              Permanent Delete Warning
          ================================================== */}

          {action ===
          "permanentDelete" ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="text-sm font-semibold text-red-400">
                This action cannot be undone.
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                The service record will be permanently
                removed. Its lifecycle snapshot will
                remain in the audit history.
              </p>
            </div>
          ) : null}

          {/* ==================================================
              Permission Warning
          ================================================== */}

          {!hasPermission ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="text-sm font-semibold text-red-400">
                Permission denied
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                Your account does not have permission
                to perform this action.
              </p>
            </div>
          ) : null}

          {/* ==================================================
              Action Buttons
          ================================================== */}

          <footer className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isActionBlocked}
              className={[
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5",
                "text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary focus-visible:ring-offset-2",
                "focus-visible:ring-offset-surface",
                "disabled:cursor-not-allowed disabled:opacity-50",
                config.buttonClassName,
              ].join(" ")}
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={18}
                    aria-hidden="true"
                  />

                  {config.loadingLabel}
                </>
              ) : (
                <>
                  <ActionIcon
                    size={18}
                    aria-hidden="true"
                  />

                  {config.confirmLabel}
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}