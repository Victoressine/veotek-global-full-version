// ======================================================
// React Imports
// ======================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

// ======================================================
// Icon Imports
// ======================================================

import {
  AlertCircle,
  Archive,
  CheckCircle2,
  FileText,
  History,
  Layers3,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";

// ======================================================
// Component Imports
// ======================================================

import CreateServiceModal from "../components/services/CreateServiceModal";
import ServiceActionModal from "../components/services/ServiceActionModal";
import ServiceAuditModal from "../components/services/ServiceAuditModal";

// ======================================================
// Application Imports
// ======================================================

import useAuth from "../hooks/useAuth";
import serviceService from "../services/serviceService";

// ======================================================
// Constants
// ======================================================

const TAB_OPTIONS = {
  ACTIVE: "active",
  TRASH: "trash",
};

const STATUS_FILTERS = {
  ALL: "all",
  PUBLISHED: "published",
  DRAFT: "draft",
};

const FEATURED_FILTERS = {
  ALL: "all",
  FEATURED: "featured",
  STANDARD: "standard",
};

const INITIAL_ACTION_STATE = {
  isOpen: false,
  action: null,
  service: null,
};

const INITIAL_AUDIT_STATE = {
  isOpen: false,
  service: null,
};

// ======================================================
// Date Formatting
// ======================================================

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

// ======================================================
// Status Badge
// ======================================================

function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toLowerCase() ||
    STATUS_FILTERS.DRAFT;

  const isPublished =
    normalizedStatus ===
    STATUS_FILTERS.PUBLISHED;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-xs font-semibold capitalize",
        isPublished
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-amber-500/10 text-amber-400",
      ].join(" ")}
    >
      {normalizedStatus}
    </span>
  );
}

// ======================================================
// Service Type Badge
// ======================================================

function ServiceTypeBadge({
  isSystemService,
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-xs font-semibold",
        isSystemService
          ? "bg-purple-500/10 text-purple-300"
          : "bg-white/5 text-muted",
      ].join(" ")}
    >
      {isSystemService
        ? "System service"
        : "Custom service"}
    </span>
  );
}

// ======================================================
// Featured Badge
// ======================================================

function FeaturedBadge({ isFeatured }) {
  if (!isFeatured) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
      <Sparkles
        size={13}
        aria-hidden="true"
      />

      Featured
    </span>
  );
}

// ======================================================
// Statistic Card
// ======================================================

function StatisticCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <article className="min-w-36 flex-1 rounded-xl border border-white/10 bg-surface px-4 py-4 sm:flex-none sm:min-w-40">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-white">
            {value}
          </p>
        </div>

        {Icon ? (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon
              className="text-primary"
              size={19}
              aria-hidden="true"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

// ======================================================
// Loading State
// ======================================================

function LoadingState({ isTrashView }) {
  return (
    <div
      className="flex min-h-72 items-center justify-center rounded-2xl border border-white/10 bg-surface"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className="size-8 animate-spin text-primary"
          aria-hidden="true"
        />

        <p className="text-sm text-muted">
          {isTrashView
            ? "Loading deleted services..."
            : "Loading active services..."}
        </p>
      </div>

      <span className="sr-only">
        Loading services
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
    <div className="flex min-h-72 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-10">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertCircle
            className="text-red-400"
            size={27}
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-white">
          Unable to load services
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRetrying ? (
            <Loader2
              size={17}
              className="animate-spin"
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

function EmptyState({
  isTrashView,
  hasFilters,
  canManageServices,
  onCreateService,
  onClearFilters,
}) {
  if (hasFilters) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-surface/60 px-5 py-12">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Search
              className="text-primary"
              size={26}
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No matching services
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            Try changing your search term or selected filters.
          </p>

          <button
            type="button"
            onClick={onClearFilters}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  if (isTrashView) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-surface/60 px-5 py-12">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Archive
              className="text-emerald-400"
              size={27}
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            Recycle Bin is empty
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            Deleted services will remain here until restored
            or permanently removed by an administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-surface/60 px-5 py-12">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Layers3
            className="text-primary"
            size={27}
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-white">
          No active services yet
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Add your first service to begin managing the
          VeoTek Global service catalogue.
        </p>

        {canManageServices ? (
          <button
            type="button"
            onClick={onCreateService}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus
              size={18}
              aria-hidden="true"
            />

            Create first service
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ======================================================
// Service Detail Chips
// ======================================================

function ServiceDetailChips({
  features,
  technologies,
}) {
  const featureCount =
    Array.isArray(features)
      ? features.length
      : 0;

  const technologyCount =
    Array.isArray(technologies)
      ? technologies.length
      : 0;

  if (
    featureCount === 0 &&
    technologyCount === 0
  ) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs">
      {featureCount > 0 ? (
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-muted">
          {featureCount}{" "}
          {featureCount === 1
            ? "feature"
            : "features"}
        </span>
      ) : null}

      {technologyCount > 0 ? (
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-muted">
          {technologyCount}{" "}
          {technologyCount === 1
            ? "technology"
            : "technologies"}
        </span>
      ) : null}
    </div>
  );
}

// ======================================================
// Desktop Services Table
// ======================================================

function ServicesTable({
  services,
  isTrashView,
  isAdmin,
  canManageServices,
  onDelete,
  onRestore,
  onPermanentDelete,
  onViewAudit,
}) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-surface md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.02]">
            <tr>
              <th
                scope="col"
                className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Service
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Display
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted"
              >
                {isTrashView
                  ? "Deleted"
                  : "Last updated"}
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {services.map((service) => (
              <tr
                key={service.id}
                className="transition-colors hover:bg-white/[0.025]"
              >
                <td className="px-5 py-4">
                  <div className="min-w-60">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">
                        {service.title}
                      </p>

                      <FeaturedBadge
                        isFeatured={
                          service.is_featured
                        }
                      />
                    </div>

                    <p className="mt-1 text-xs text-muted">
                      /{service.slug}
                    </p>

                    {service.short_description ? (
                      <p className="mt-2 max-w-md text-sm leading-5 text-muted">
                        {service.short_description}
                      </p>
                    ) : null}

                    <ServiceDetailChips
                      features={service.features}
                      technologies={
                        service.technologies
                      }
                    />

                    {isTrashView &&
                    service.delete_reason ? (
                      <p className="mt-3 max-w-md text-xs leading-5 text-amber-300">
                        Reason:{" "}
                        {service.delete_reason}
                      </p>
                    ) : null}
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <StatusBadge
                    status={service.status}
                  />
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-2">
                    <ServiceTypeBadge
                      isSystemService={
                        service.is_system_service
                      }
                    />

                    <p className="text-xs text-muted">
                      Order:{" "}
                      {service.display_order}
                    </p>
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
                  {formatDate(
                    isTrashView
                      ? service.deleted_at
                      : service.updated_at
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() =>
                          onViewAudit(service)
                        }
                        title="View service audit history"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-muted transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <History
                          size={16}
                          aria-hidden="true"
                        />

                        Audit
                      </button>
                    ) : null}

                    {!isTrashView ? (
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(service)
                        }
                        disabled={
                          !canManageServices ||
                          service.is_system_service
                        }
                        title={
                          service.is_system_service
                            ? "System services cannot be deleted"
                            : "Move service to Recycle Bin"
                        }
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2
                          size={16}
                          aria-hidden="true"
                        />

                        Trash
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            onRestore(service)
                          }
                          disabled={
                            !canManageServices
                          }
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
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
                            onPermanentDelete(service)
                          }
                          disabled={
                            !isAdmin ||
                            service.is_system_service
                          }
                          title={
                            !isAdmin
                              ? "Only administrators can permanently delete services"
                              : "Delete service permanently"
                          }
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2
                            size={16}
                            aria-hidden="true"
                          />

                          Delete forever
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ======================================================
// Mobile Service Cards
// ======================================================

function MobileServiceCards({
  services,
  isTrashView,
  isAdmin,
  canManageServices,
  onDelete,
  onRestore,
  onPermanentDelete,
  onViewAudit,
}) {
  return (
    <div className="space-y-4 md:hidden">
      {services.map((service) => (
        <article
          key={service.id}
          className="rounded-2xl border border-white/10 bg-surface p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words font-semibold text-white">
                  {service.title}
                </h2>

                <FeaturedBadge
                  isFeatured={
                    service.is_featured
                  }
                />
              </div>

              <p className="mt-1 break-all text-xs text-muted">
                /{service.slug}
              </p>
            </div>

            <StatusBadge
              status={service.status}
            />
          </div>

          {service.short_description ? (
            <p className="mt-4 text-sm leading-6 text-muted">
              {service.short_description}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ServiceTypeBadge
              isSystemService={
                service.is_system_service
              }
            />

            <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted">
              Order {service.display_order}
            </span>
          </div>

          <ServiceDetailChips
            features={service.features}
            technologies={
              service.technologies
            }
          />

          <p className="mt-4 text-xs text-muted">
            {isTrashView
              ? `Deleted ${formatDate(
                  service.deleted_at
                )}`
              : `Updated ${formatDate(
                  service.updated_at
                )}`}
          </p>

          {isTrashView &&
          service.delete_reason ? (
            <div className="mt-4 rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-3">
              <p className="text-xs leading-5 text-amber-200">
                <span className="font-semibold">
                  Delete reason:
                </span>{" "}
                {service.delete_reason}
              </p>
            </div>
          ) : null}

          <div className="mt-5 space-y-2">
            {isAdmin ? (
              <button
                type="button"
                onClick={() =>
                  onViewAudit(service)
                }
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <History
                  size={17}
                  aria-hidden="true"
                />

                View audit history
              </button>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              {!isTrashView ? (
                <button
                  type="button"
                  onClick={() =>
                    onDelete(service)
                  }
                  disabled={
                    !canManageServices ||
                    service.is_system_service
                  }
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/20 px-4 py-2.5 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2
                    size={17}
                    aria-hidden="true"
                  />

                  Move to Trash
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      onRestore(service)
                    }
                    disabled={
                      !canManageServices
                    }
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RotateCcw
                      size={17}
                      aria-hidden="true"
                    />

                    Restore
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onPermanentDelete(
                        service
                      )
                    }
                    disabled={
                      !isAdmin ||
                      service.is_system_service
                    }
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2
                      size={17}
                      aria-hidden="true"
                    />

                    Delete forever
                  </button>
                </>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// ======================================================
// Main Services Component
// ======================================================

export default function Services() {
  // ====================================================
  // Authentication and Permissions
  // ====================================================

  const {
    isAdmin,
    isEditor,
    isActive,
  } = useAuth();

  const canManageServices =
    isActive &&
    (isAdmin || isEditor);

  // ====================================================
  // Service Data State
  // ====================================================

  const [
    activeServices,
    setActiveServices,
  ] = useState([]);

  const [
    deletedServices,
    setDeletedServices,
  ] = useState([]);

  // ====================================================
  // Interface State
  // ====================================================

  const [activeTab, setActiveTab] =
    useState(TAB_OPTIONS.ACTIVE);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState(STATUS_FILTERS.ALL);

  const [
    featuredFilter,
    setFeaturedFilter,
  ] = useState(FEATURED_FILTERS.ALL);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    isCreateModalOpen,
    setIsCreateModalOpen,
  ] = useState(false);

  const [
    actionState,
    setActionState,
  ] = useState(
    INITIAL_ACTION_STATE
  );

  const [
    auditState,
    setAuditState,
  ] = useState(
    INITIAL_AUDIT_STATE
  );

  // ====================================================
  // Derived State
  // ====================================================

  const isTrashView =
    activeTab === TAB_OPTIONS.TRASH;

  const serviceStatistics =
    useMemo(() => {
      return {
        active:
          activeServices.length,

        published:
          activeServices.filter(
            (service) =>
              service.status ===
              STATUS_FILTERS.PUBLISHED
          ).length,

        drafts:
          activeServices.filter(
            (service) =>
              service.status ===
              STATUS_FILTERS.DRAFT
          ).length,

        featured:
          activeServices.filter(
            (service) =>
              service.is_featured
          ).length,

        deleted:
          deletedServices.length,
      };
    }, [
      activeServices,
      deletedServices,
    ]);

  const currentServices =
    useMemo(() => {
      return isTrashView
        ? deletedServices
        : activeServices;
    }, [
      activeServices,
      deletedServices,
      isTrashView,
    ]);

  const filteredServices =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      return currentServices.filter(
        (service) => {
          const searchableText = [
            service.title,
            service.slug,
            service.short_description,
            service.description,
            service.icon_name,
            service.delete_reason,
            ...(Array.isArray(
              service.features
            )
              ? service.features
              : []),
            ...(Array.isArray(
              service.technologies
            )
              ? service.technologies
              : []),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            searchableText.includes(
              normalizedSearch
            );

          const matchesStatus =
            statusFilter ===
              STATUS_FILTERS.ALL ||
            service.status ===
              statusFilter;

          const matchesFeatured =
            featuredFilter ===
              FEATURED_FILTERS.ALL ||
            (
              featuredFilter ===
                FEATURED_FILTERS.FEATURED &&
              service.is_featured
            ) ||
            (
              featuredFilter ===
                FEATURED_FILTERS.STANDARD &&
              !service.is_featured
            );

          return (
            matchesSearch &&
            matchesStatus &&
            matchesFeatured
          );
        }
      );
    }, [
      currentServices,
      searchTerm,
      statusFilter,
      featuredFilter,
    ]);

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    statusFilter !==
      STATUS_FILTERS.ALL ||
    featuredFilter !==
      FEATURED_FILTERS.ALL;

  // ====================================================
  // Load Services
  // ====================================================

  const loadServices =
    useCallback(async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const [
          activeServiceRecords,
          deletedServiceRecords,
        ] = await Promise.all([
          serviceService.getActiveServices(),
          serviceService.getDeletedServices(),
        ]);

        setActiveServices(
          Array.isArray(
            activeServiceRecords
          )
            ? activeServiceRecords
            : []
        );

        setDeletedServices(
          Array.isArray(
            deletedServiceRecords
          )
            ? deletedServiceRecords
            : []
        );
      } catch (error) {
        console.error(
          "Unable to load services:",
          error
        );

        setErrorMessage(
          error?.message ||
            "The services could not be retrieved."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // ====================================================
  // Initial Load
  // ====================================================

  useEffect(() => {
    document.title =
      "Services | VeoTek CMS";

    loadServices();
  }, [loadServices]);

  // ====================================================
  // Tab and Filter Management
  // ====================================================

  function handleTabChange(tab) {
    if (
      !Object.values(
        TAB_OPTIONS
      ).includes(tab)
    ) {
      return;
    }

    setActiveTab(tab);
    setSearchTerm("");
    setStatusFilter(
      STATUS_FILTERS.ALL
    );
    setFeaturedFilter(
      FEATURED_FILTERS.ALL
    );
  }

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter(
      STATUS_FILTERS.ALL
    );
    setFeaturedFilter(
      FEATURED_FILTERS.ALL
    );
  }

  // ====================================================
  // Create Modal Management
  // ====================================================

  function openCreateModal() {
    if (canManageServices) {
      setIsCreateModalOpen(true);
    }
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
  }

  function handleServiceCreated(
    createdService
  ) {
    if (!createdService?.id) {
      return;
    }

    setActiveServices(
      (currentServices) => [
        createdService,
        ...currentServices.filter(
          (service) =>
            service.id !==
            createdService.id
        ),
      ]
    );
  }

  // ====================================================
  // Action Modal Management
  // ====================================================

  function openActionModal(
    action,
    service
  ) {
    if (
      !service?.id ||
      !canManageServices
    ) {
      return;
    }

    setActionState({
      isOpen: true,
      action,
      service,
    });
  }

  function closeActionModal() {
    setActionState(
      INITIAL_ACTION_STATE
    );
  }

  function handleDelete(service) {
    openActionModal(
      "delete",
      service
    );
  }

  function handleRestore(service) {
    openActionModal(
      "restore",
      service
    );
  }

  function handlePermanentDelete(
    service
  ) {
    if (!isAdmin) {
      return;
    }

    openActionModal(
      "permanentDelete",
      service
    );
  }

  // ====================================================
  // Audit Modal Management
  // ====================================================

  function openAuditModal(service) {
    if (
      !service?.id ||
      !isAdmin
    ) {
      return;
    }

    setAuditState({
      isOpen: true,
      service,
    });
  }

  function closeAuditModal() {
    setAuditState(
      INITIAL_AUDIT_STATE
    );
  }

  // ====================================================
  // Completed Action State Updates
  // ====================================================

  function handleActionCompleted({
    action,
    service,
    result,
  }) {
    if (!service?.id) {
      return;
    }

    if (action === "delete") {
      setActiveServices(
        (currentServices) =>
          currentServices.filter(
            (currentService) =>
              currentService.id !==
              service.id
          )
      );

      if (result?.id) {
        setDeletedServices(
          (currentServices) => [
            result,
            ...currentServices.filter(
              (currentService) =>
                currentService.id !==
                result.id
            ),
          ]
        );
      }

      return;
    }

    if (action === "restore") {
      setDeletedServices(
        (currentServices) =>
          currentServices.filter(
            (currentService) =>
              currentService.id !==
              service.id
          )
      );

      if (result?.id) {
        setActiveServices(
          (currentServices) => [
            result,
            ...currentServices.filter(
              (currentService) =>
                currentService.id !==
                result.id
            ),
          ]
        );
      }

      return;
    }

    if (
      action ===
      "permanentDelete"
    ) {
      setDeletedServices(
        (currentServices) =>
          currentServices.filter(
            (currentService) =>
              currentService.id !==
              service.id
          )
      );
    }
  }

  // ====================================================
  // Render
  // ====================================================

  return (
    <>
      <section className="space-y-6">
        {/* ==================================================
            Header
        ================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Website content
            </p>

            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Services
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Create, organize, publish and securely manage
              the services offered by VeoTek Global.
            </p>
          </div>

          {!isTrashView ? (
            <button
              type="button"
              onClick={openCreateModal}
              disabled={
                !canManageServices
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus
                size={18}
                aria-hidden="true"
              />

              Add service
            </button>
          ) : null}
        </div>

        {/* ==================================================
            Permission Notice
        ================================================== */}

        {!canManageServices ? (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
            <ShieldAlert
              className="mt-0.5 shrink-0 text-red-400"
              size={20}
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-semibold text-red-300">
                Read-only access
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                Your account does not have permission to
                create, delete or restore services.
              </p>
            </div>
          </div>
        ) : null}

        {/* ==================================================
            Statistics
        ================================================== */}

        {!loading &&
        !errorMessage ? (
          <div className="flex flex-wrap gap-3">
            <StatisticCard
              label="Active services"
              value={
                serviceStatistics.active
              }
              icon={Layers3}
            />

            <StatisticCard
              label="Published"
              value={
                serviceStatistics.published
              }
              icon={CheckCircle2}
            />

            <StatisticCard
              label="Drafts"
              value={
                serviceStatistics.drafts
              }
              icon={FileText}
            />

            <StatisticCard
              label="Featured"
              value={
                serviceStatistics.featured
              }
              icon={Sparkles}
            />

            <StatisticCard
              label="Recycle Bin"
              value={
                serviceStatistics.deleted
              }
              icon={Archive}
            />
          </div>
        ) : null}

        {/* ==================================================
            Tabs
        ================================================== */}

        <div className="border-b border-white/10">
          <div
            className="flex gap-2 overflow-x-auto"
            role="tablist"
            aria-label="Service management views"
          >
            <button
              type="button"
              role="tab"
              aria-selected={
                !isTrashView
              }
              onClick={() =>
                handleTabChange(
                  TAB_OPTIONS.ACTIVE
                )
              }
              className={[
                "inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-3",
                "text-sm font-semibold transition-colors",
                !isTrashView
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-white",
              ].join(" ")}
            >
              <Layers3
                size={17}
                aria-hidden="true"
              />

              Active services

              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs">
                {
                  serviceStatistics.active
                }
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={
                isTrashView
              }
              onClick={() =>
                handleTabChange(
                  TAB_OPTIONS.TRASH
                )
              }
              className={[
                "inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-3",
                "text-sm font-semibold transition-colors",
                isTrashView
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-white",
              ].join(" ")}
            >
              <Archive
                size={17}
                aria-hidden="true"
              />

              Recycle Bin

              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs">
                {
                  serviceStatistics.deleted
                }
              </span>
            </button>
          </div>
        </div>

        {/* ==================================================
            Search and Filters
        ================================================== */}

        {!loading &&
        !errorMessage &&
        currentServices.length > 0 ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-surface p-4 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                size={18}
                aria-hidden="true"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder={
                  isTrashView
                    ? "Search deleted services..."
                    : "Search active services..."
                }
                aria-label="Search services"
                className="min-h-11 w-full rounded-xl border border-white/10 bg-dark py-2.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              aria-label="Filter services by status"
              className="min-h-11 rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 lg:min-w-44"
            >
              <option
                value={STATUS_FILTERS.ALL}
              >
                All statuses
              </option>

              <option
                value={
                  STATUS_FILTERS.PUBLISHED
                }
              >
                Published
              </option>

              <option
                value={
                  STATUS_FILTERS.DRAFT
                }
              >
                Draft
              </option>
            </select>

            <select
              value={featuredFilter}
              onChange={(event) =>
                setFeaturedFilter(
                  event.target.value
                )
              }
              aria-label="Filter services by featured status"
              className="min-h-11 rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 lg:min-w-44"
            >
              <option
                value={
                  FEATURED_FILTERS.ALL
                }
              >
                All services
              </option>

              <option
                value={
                  FEATURED_FILTERS.FEATURED
                }
              >
                Featured only
              </option>

              <option
                value={
                  FEATURED_FILTERS.STANDARD
                }
              >
                Standard only
              </option>
            </select>

            <button
              type="button"
              onClick={loadServices}
              disabled={loading}
              aria-label="Refresh services"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* ==================================================
            Loading State
        ================================================== */}

        {loading ? (
          <LoadingState
            isTrashView={isTrashView}
          />
        ) : null}

        {/* ==================================================
            Error State
        ================================================== */}

        {!loading &&
        errorMessage ? (
          <ErrorState
            message={errorMessage}
            onRetry={loadServices}
            isRetrying={loading}
          />
        ) : null}

        {/* ==================================================
            Empty State
        ================================================== */}

        {!loading &&
        !errorMessage &&
        filteredServices.length ===
          0 ? (
          <EmptyState
            isTrashView={isTrashView}
            hasFilters={hasFilters}
            canManageServices={
              canManageServices
            }
            onCreateService={
              openCreateModal
            }
            onClearFilters={
              clearFilters
            }
          />
        ) : null}

        {/* ==================================================
            Desktop Table
        ================================================== */}

        {!loading &&
        !errorMessage &&
        filteredServices.length >
          0 ? (
          <ServicesTable
            services={filteredServices}
            isTrashView={isTrashView}
            isAdmin={isAdmin}
            canManageServices={
              canManageServices
            }
            onDelete={handleDelete}
            onRestore={handleRestore}
            onPermanentDelete={
              handlePermanentDelete
            }
            onViewAudit={
              openAuditModal
            }
          />
        ) : null}

        {/* ==================================================
            Mobile Cards
        ================================================== */}

        {!loading &&
        !errorMessage &&
        filteredServices.length >
          0 ? (
          <MobileServiceCards
            services={filteredServices}
            isTrashView={isTrashView}
            isAdmin={isAdmin}
            canManageServices={
              canManageServices
            }
            onDelete={handleDelete}
            onRestore={handleRestore}
            onPermanentDelete={
              handlePermanentDelete
            }
            onViewAudit={
              openAuditModal
            }
          />
        ) : null}
      </section>

      {/* ==================================================
          Create Service Modal
      ================================================== */}

      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onServiceCreated={
          handleServiceCreated
        }
      />

      {/* ==================================================
          Service Action Modal
      ================================================== */}

      <ServiceActionModal
        isOpen={
          actionState.isOpen
        }
        action={
          actionState.action
        }
        service={
          actionState.service
        }
        onClose={
          closeActionModal
        }
        onActionCompleted={
          handleActionCompleted
        }
      />

      {/* ==================================================
          Service Audit Modal
      ================================================== */}

      <ServiceAuditModal
        isOpen={auditState.isOpen}
        service={auditState.service}
        onClose={closeAuditModal}
      />
    </>
  );
}