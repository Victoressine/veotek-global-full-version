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
  Check,
  Loader2,
  Plus,
  Save,
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
// Constants
// ======================================================

const INITIAL_FORM = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  icon_name: "",
  image_url: "",
  features: [],
  technologies: [],
  status: "draft",
  display_order: 0,
  is_featured: false,
  seo_title: "",
  seo_description: "",
};

const MAX_LENGTHS = {
  title: 120,
  slug: 120,
  shortDescription: 220,
  description: 5000,
  iconName: 80,
  imageUrl: 500,
  feature: 120,
  technology: 80,
  seoTitle: 70,
  seoDescription: 160,
};

const VALID_STATUSES = [
  "draft",
  "published",
];

// ======================================================
// Slug Helper
// ======================================================

function createSlug(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ======================================================
// Form Data Mapping
// ======================================================

function mapServiceToForm(service) {
  if (!service) {
    return INITIAL_FORM;
  }

  return {
    title: service.title ?? "",
    slug: service.slug ?? "",
    short_description:
      service.short_description ?? "",
    description:
      service.description ?? "",
    icon_name:
      service.icon_name ?? "",
    image_url:
      service.image_url ?? "",
    features: Array.isArray(
      service.features
    )
      ? service.features
      : [],
    technologies: Array.isArray(
      service.technologies
    )
      ? service.technologies
      : [],
    status:
      service.status ?? "draft",
    display_order:
      Number.isInteger(
        service.display_order
      )
        ? service.display_order
        : 0,
    is_featured: Boolean(
      service.is_featured
    ),
    seo_title:
      service.seo_title ?? "",
    seo_description:
      service.seo_description ?? "",
  };
}

// ======================================================
// Error Mapping
// ======================================================

function getErrorMessage(error) {
  if (!error) {
    return "Unable to update the service.";
  }

  if (error.code === "23505") {
    return "Another service already uses this slug.";
  }

  if (error.code === "42501") {
    return "You do not have permission to update services.";
  }

  if (error.code === "P0002") {
    return "The selected service could not be found.";
  }

  return (
    error.message ||
    "Unable to update the service."
  );
}

// ======================================================
// Text Collection Field
// ======================================================

function TextCollectionField({
  label,
  description,
  placeholder,
  values,
  onChange,
  disabled,
  maxLength,
}) {
  // ====================================================
  // Local State
  // ====================================================

  const [inputValue, setInputValue] =
    useState("");

  // ====================================================
  // Reset Input When Disabled
  // ====================================================

  useEffect(() => {
    if (disabled) {
      setInputValue("");
    }
  }, [disabled]);

  // ====================================================
  // Add Item
  // ====================================================

  function addItem() {
    const normalizedValue =
      inputValue.trim();

    if (!normalizedValue) {
      return;
    }

    const alreadyExists =
      values.some(
        (value) =>
          value.toLowerCase() ===
          normalizedValue.toLowerCase()
      );

    if (alreadyExists) {
      toast.error(
        `${label.replace(/s$/, "")} already added.`
      );

      return;
    }

    onChange([
      ...values,
      normalizedValue,
    ]);

    setInputValue("");
  }

  // ====================================================
  // Keyboard Handler
  // ====================================================

  function handleKeyDown(event) {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();
      addItem();
    }
  }

  // ====================================================
  // Remove Item
  // ====================================================

  function removeItem(itemToRemove) {
    onChange(
      values.filter(
        (value) =>
          value !== itemToRemove
      )
    );
  }

  // ====================================================
  // Render
  // ====================================================

  return (
    <div>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <label className="block text-sm font-medium text-white">
            {label}
          </label>

          {description ? (
            <p className="mt-1 text-xs leading-5 text-muted">
              {description}
            </p>
          ) : null}
        </div>

        <span className="shrink-0 text-xs text-muted">
          Optional
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={inputValue}
          onChange={(event) =>
            setInputValue(
              event.target.value
            )
          }
          onKeyDown={handleKeyDown}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={placeholder}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={addItem}
          disabled={
            disabled ||
            !inputValue.trim()
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus
            size={17}
            aria-hidden="true"
          />

          Add
        </button>
      </div>

      {values.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white"
            >
              {value}

              <button
                type="button"
                onClick={() =>
                  removeItem(value)
                }
                disabled={disabled}
                aria-label={`Remove ${value}`}
                className="text-muted transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X
                  size={14}
                  aria-hidden="true"
                />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ======================================================
// Main Component
// ======================================================

export default function EditServiceModal({
  isOpen,
  service,
  onClose,
  onServiceUpdated,
}) {
  // ====================================================
  // Authentication
  // ====================================================

  const {
    user,
    isAdmin,
    isEditor,
    isActive,
  } = useAuth();

  // ====================================================
  // Refs
  // ====================================================

  const titleInputRef =
    useRef(null);

  // ====================================================
  // State
  // ====================================================

  const [formData, setFormData] =
    useState(INITIAL_FORM);

  const [
    slugWasEdited,
    setSlugWasEdited,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  // ====================================================
  // Derived Permissions
  // ====================================================

  const canEditService =
    isActive &&
    (isAdmin || isEditor);

  const serviceId =
    service?.id ?? null;

  const isPublished =
    formData.status ===
    "published";

  // ====================================================
  // Character Counts
  // ====================================================

  const characterCounts = useMemo(
    () => ({
      title:
        formData.title.length,
      shortDescription:
        formData.short_description
          .length,
      description:
        formData.description.length,
      seoTitle:
        formData.seo_title.length,
      seoDescription:
        formData.seo_description
          .length,
    }),
    [formData]
  );

  // ====================================================
  // Change Detection
  // ====================================================

  const hasChanges = useMemo(() => {
    if (!service) {
      return false;
    }

    const originalForm =
      mapServiceToForm(service);

    return (
      JSON.stringify(formData) !==
      JSON.stringify(originalForm)
    );
  }, [
    formData,
    service,
  ]);

  // ====================================================
  // Modal Lifecycle
  // ====================================================

  useEffect(() => {
    if (!isOpen || !service) {
      return undefined;
    }

    setFormData(
      mapServiceToForm(service)
    );

    setSlugWasEdited(true);
    setIsSubmitting(false);

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const focusTimer =
      window.setTimeout(() => {
        titleInputRef.current?.focus();
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
    service,
    isSubmitting,
    onClose,
  ]);

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
  // Field Update Handler
  // ====================================================

  function updateField(
    fieldName,
    value
  ) {
    setFormData((current) => ({
      ...current,
      [fieldName]: value,
    }));
  }

  // ====================================================
  // Input Change Handler
  // ====================================================

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    if (name === "title") {
      setFormData((current) => ({
        ...current,
        title: value,
        slug: slugWasEdited
          ? current.slug
          : createSlug(value),
      }));

      return;
    }

    if (name === "slug") {
      setSlugWasEdited(true);

      setFormData((current) => ({
        ...current,
        slug: createSlug(value),
      }));

      return;
    }

    if (name === "display_order") {
      const parsedValue =
        Number.parseInt(value, 10);

      setFormData((current) => ({
        ...current,
        display_order:
          Number.isNaN(parsedValue)
            ? 0
            : Math.max(
                0,
                parsedValue
              ),
      }));

      return;
    }

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
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
  // Form Validation
  // ====================================================

  function validateForm() {
    if (!canEditService) {
      toast.error(
        "You do not have permission to edit services."
      );

      return null;
    }

    if (service.deleted_at) {
      toast.error(
        "Restore this service before editing it."
      );

      return null;
    }

    const title =
      formData.title.trim();

    const slug =
      createSlug(formData.slug);

    if (!title) {
      toast.error(
        "Enter a service title."
      );

      titleInputRef.current?.focus();

      return null;
    }

    if (title.length < 2) {
      toast.error(
        "Service title must contain at least 2 characters."
      );

      titleInputRef.current?.focus();

      return null;
    }

    if (!slug) {
      toast.error(
        "Enter a valid service slug."
      );

      return null;
    }

    if (
      !VALID_STATUSES.includes(
        formData.status
      )
    ) {
      toast.error(
        "Select a valid service status."
      );

      return null;
    }

    if (
      !Number.isInteger(
        formData.display_order
      ) ||
      formData.display_order < 0
    ) {
      toast.error(
        "Display order must be a non-negative whole number."
      );

      return null;
    }

    if (!user?.id) {
      toast.error(
        "Your session could not be verified."
      );

      return null;
    }

    return {
      title,
      slug,
    };
  }

  // ====================================================
  // Submit Updated Service
  // ====================================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      isSubmitting ||
      !hasChanges
    ) {
      return;
    }

    const validatedData =
      validateForm();

    if (!validatedData) {
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedService =
        await serviceService.updateService(
          serviceId,
          {
            title:
              validatedData.title,
            slug:
              validatedData.slug,
            short_description:
              formData.short_description,
            description:
              formData.description,
            icon_name:
              formData.icon_name,
            image_url:
              formData.image_url,
            features:
              formData.features,
            technologies:
              formData.technologies,
            status:
              formData.status,
            display_order:
              formData.display_order,
            is_featured:
              formData.is_featured,
            seo_title:
              formData.seo_title,
            seo_description:
              formData.seo_description,
            updated_by:
              user.id,
          }
        );

      toast.success(
        "Service updated successfully."
      );

      onServiceUpdated?.(
        updatedService
      );

      onClose?.();
    } catch (error) {
      console.error(
        "Unable to update service:",
        error
      );

      toast.error(
        getErrorMessage(error)
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
      className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-service-title"
      aria-describedby="edit-service-description"
    >
      {/* ==================================================
          Backdrop
      ================================================== */}

      <button
        type="button"
        onClick={handleClose}
        disabled={isSubmitting}
        aria-label="Close service editing form"
        className="absolute inset-0 cursor-default bg-dark/85 backdrop-blur-sm disabled:cursor-not-allowed"
      />

      {/* ==================================================
          Modal Container
      ================================================== */}

      <section className="relative z-10 flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-surface shadow-2xl sm:max-w-3xl sm:rounded-2xl">
        {/* ==================================================
            Header
        ================================================== */}

        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <h2
              id="edit-service-title"
              className="text-lg font-semibold text-white"
            >
              Edit service
            </h2>

            <p
              id="edit-service-description"
              className="mt-1 break-words text-sm leading-6 text-muted"
            >
              Update{" "}
              <span className="font-semibold text-white">
                {service.title}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X
              size={20}
              aria-hidden="true"
            />
          </button>
        </header>

        {/* ==================================================
            Editing Form
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-6">
            {/* ==================================================
                Basic Information
            ================================================== */}

            <section className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                Basic information
              </h3>

              <div>
                <label
                  htmlFor="edit-service-title-input"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Service title
                </label>

                <input
                  ref={titleInputRef}
                  id="edit-service-title-input"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={
                    MAX_LENGTHS.title
                  }
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-right text-xs text-muted">
                  {characterCounts.title}/
                  {MAX_LENGTHS.title}
                </p>
              </div>

              <div>
                <label
                  htmlFor="edit-service-slug-input"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  URL slug
                </label>

                <div className="flex min-h-12 overflow-hidden rounded-xl border border-white/10 bg-dark focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="flex items-center border-r border-white/10 px-3 text-sm text-muted">
                    /
                  </span>

                  <input
                    id="edit-service-slug-input"
                    name="slug"
                    type="text"
                    value={formData.slug}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    maxLength={
                      MAX_LENGTHS.slug
                    }
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-service-short-description"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Short description
                </label>

                <textarea
                  id="edit-service-short-description"
                  name="short_description"
                  value={
                    formData.short_description
                  }
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={3}
                  maxLength={
                    MAX_LENGTHS.shortDescription
                  }
                  className="w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-right text-xs text-muted">
                  {
                    characterCounts.shortDescription
                  }
                  /
                  {
                    MAX_LENGTHS.shortDescription
                  }
                </p>
              </div>

              <div>
                <label
                  htmlFor="edit-service-description"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Full description
                </label>

                <textarea
                  id="edit-service-description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={7}
                  maxLength={
                    MAX_LENGTHS.description
                  }
                  className="w-full resize-y rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-right text-xs text-muted">
                  {characterCounts.description}/
                  {MAX_LENGTHS.description}
                </p>
              </div>
            </section>

            {/* ==================================================
                Visual Settings
            ================================================== */}

            <section className="space-y-5 border-t border-white/10 pt-7">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                Visual settings
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-service-icon"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Icon name
                  </label>

                  <input
                    id="edit-service-icon"
                    name="icon_name"
                    type="text"
                    value={formData.icon_name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    maxLength={
                      MAX_LENGTHS.iconName
                    }
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-service-image"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Image URL
                  </label>

                  <input
                    id="edit-service-image"
                    name="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    maxLength={
                      MAX_LENGTHS.imageUrl
                    }
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>
            </section>

            {/* ==================================================
                Features and Technologies
            ================================================== */}

            <section className="space-y-6 border-t border-white/10 pt-7">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                Service details
              </h3>

              <TextCollectionField
                label="Features"
                description="Press Enter or comma to add a feature."
                placeholder="Add feature"
                values={formData.features}
                onChange={(values) =>
                  updateField(
                    "features",
                    values
                  )
                }
                disabled={isSubmitting}
                maxLength={
                  MAX_LENGTHS.feature
                }
              />

              <TextCollectionField
                label="Technologies"
                description="Add technologies commonly used for this service."
                placeholder="Add technology"
                values={
                  formData.technologies
                }
                onChange={(values) =>
                  updateField(
                    "technologies",
                    values
                  )
                }
                disabled={isSubmitting}
                maxLength={
                  MAX_LENGTHS.technology
                }
              />
            </section>

            {/* ==================================================
                Publishing Settings
            ================================================== */}

            <section className="space-y-5 border-t border-white/10 pt-7">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                Publishing
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-service-status"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Status
                  </label>

                  <select
                    id="edit-service-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-service-order"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Display order
                  </label>

                  <input
                    id="edit-service-order"
                    name="display_order"
                    type="number"
                    min="0"
                    step="1"
                    value={
                      formData.display_order
                    }
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-dark px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    Featured service
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Highlight this service in featured sections.
                  </p>
                </div>

                <input
                  name="is_featured"
                  type="checkbox"
                  checked={
                    formData.is_featured
                  }
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="size-5 rounded border-white/20 bg-surface text-primary focus:ring-primary disabled:cursor-not-allowed"
                />
              </label>
            </section>

            {/* ==================================================
                SEO Settings
            ================================================== */}

            <section className="space-y-5 border-t border-white/10 pt-7">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                Search engine optimization
              </h3>

              <div>
                <label
                  htmlFor="edit-service-seo-title"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  SEO title
                </label>

                <input
                  id="edit-service-seo-title"
                  name="seo_title"
                  type="text"
                  value={
                    formData.seo_title
                  }
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={
                    MAX_LENGTHS.seoTitle
                  }
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-right text-xs text-muted">
                  {characterCounts.seoTitle}/
                  {MAX_LENGTHS.seoTitle}
                </p>
              </div>

              <div>
                <label
                  htmlFor="edit-service-seo-description"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  SEO description
                </label>

                <textarea
                  id="edit-service-seo-description"
                  name="seo_description"
                  value={
                    formData.seo_description
                  }
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={3}
                  maxLength={
                    MAX_LENGTHS.seoDescription
                  }
                  className="w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-right text-xs text-muted">
                  {
                    characterCounts.seoDescription
                  }
                  /
                  {
                    MAX_LENGTHS.seoDescription
                  }
                </p>
              </div>
            </section>

            {/* ==================================================
                Publishing Summary
            ================================================== */}

            <div
              className={[
                "rounded-xl border px-4 py-3",
                isPublished
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-amber-500/20 bg-amber-500/5",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <Check
                  className={
                    isPublished
                      ? "mt-0.5 text-emerald-400"
                      : "mt-0.5 text-amber-400"
                  }
                  size={18}
                  aria-hidden="true"
                />

                <p className="text-sm text-white">
                  {isPublished
                    ? "This service is configured for public visibility."
                    : "This service is configured as a draft."}
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              Footer
          ================================================== */}

          <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !hasChanges ||
                !canEditService
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={18}
                    aria-hidden="true"
                  />

                  Saving changes...
                </>
              ) : (
                <>
                  <Save
                    size={18}
                    aria-hidden="true"
                  />

                  Save changes
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}