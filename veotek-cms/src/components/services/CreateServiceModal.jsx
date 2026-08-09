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
  FilePlus2,
  Loader2,
  Plus,
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

const VALID_STATUSES = ["draft", "published"];

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
// Error Mapping
// ======================================================

function getErrorMessage(error) {
  if (!error) {
    return "Unable to create the service.";
  }

  if (error.code === "23505") {
    return "A service with this slug already exists.";
  }

  if (error.code === "42501") {
    return "You do not have permission to create services.";
  }

  return (
    error.message ||
    "Unable to create the service."
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
  // Local Input State
  // ====================================================

  const [inputValue, setInputValue] =
    useState("");

  // ====================================================
  // Add Item
  // ====================================================

  function addItem() {
    const normalizedValue =
      inputValue.trim();

    if (!normalizedValue) {
      return;
    }

    if (
      values.some(
        (value) =>
          value.toLowerCase() ===
          normalizedValue.toLowerCase()
      )
    ) {
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
  // Keyboard Support
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

export default function CreateServiceModal({
  isOpen,
  onClose,
  onServiceCreated,
}) {
  // ====================================================
  // Authentication
  // ====================================================

  const { user } = useAuth();

  // ====================================================
  // Refs
  // ====================================================

  const titleInputRef = useRef(null);

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
  // Derived Values
  // ====================================================

  const isPublished =
    formData.status === "published";

  const characterCounts = useMemo(
    () => ({
      title: formData.title.length,
      shortDescription:
        formData.short_description.length,
      description:
        formData.description.length,
      seoTitle:
        formData.seo_title.length,
      seoDescription:
        formData.seo_description.length,
    }),
    [formData]
  );

  // ====================================================
  // Modal Lifecycle
  // ====================================================

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setFormData(INITIAL_FORM);
    setSlugWasEdited(false);
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
      window.clearTimeout(focusTimer);

      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    isOpen,
    isSubmitting,
    onClose,
  ]);

  // ====================================================
  // Early Return
  // ====================================================

  if (!isOpen) {
    return null;
  }

  // ====================================================
  // Field Updates
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
            : Math.max(0, parsedValue),
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
  // Modal Close
  // ====================================================

  function handleClose() {
    if (!isSubmitting) {
      onClose?.();
    }
  }

  // ====================================================
  // Validation
  // ====================================================

  function validateForm() {
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
        "Your session could not be verified. Sign in again and retry."
      );

      return null;
    }

    return {
      title,
      slug,
    };
  }

  // ====================================================
  // Submit Service
  // ====================================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validatedData =
      validateForm();

    if (!validatedData) {
      return;
    }

    try {
      setIsSubmitting(true);

      const createdService =
        await serviceService.createService({
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
          is_system_service: false,
          seo_title:
            formData.seo_title,
          seo_description:
            formData.seo_description,
          created_by:
            user.id,
          updated_by:
            user.id,
        });

      toast.success(
        isPublished
          ? "Service created and published."
          : "Service draft created successfully."
      );

      onServiceCreated?.(
        createdService
      );

      onClose?.();
    } catch (error) {
      console.error(
        "Unable to create service:",
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
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-service-title"
      aria-describedby="create-service-description"
    >
      {/* ==================================================
          Backdrop
      ================================================== */}

      <button
        type="button"
        onClick={handleClose}
        disabled={isSubmitting}
        aria-label="Close service creation form"
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
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FilePlus2
                className="text-primary"
                size={22}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2
                id="create-service-title"
                className="text-lg font-semibold text-white"
              >
                Create service
              </h2>

              <p
                id="create-service-description"
                className="mt-1 text-sm leading-6 text-muted"
              >
                Add a new service to the VeoTek Global website.
              </p>
            </div>
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
            Form Content
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
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Basic information
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Define the service name, URL and public summary.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="service-title-input"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Service title
                    <span
                      className="ml-1 text-red-400"
                      aria-hidden="true"
                    >
                      *
                    </span>
                  </label>

                  <input
                    ref={titleInputRef}
                    id="service-title-input"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    maxLength={
                      MAX_LENGTHS.title
                    }
                    placeholder="For example: Web Development"
                    autoComplete="off"
                    required
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-right text-xs text-muted">
                    {characterCounts.title}/
                    {MAX_LENGTHS.title}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="service-slug-input"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    URL slug
                    <span
                      className="ml-1 text-red-400"
                      aria-hidden="true"
                    >
                      *
                    </span>
                  </label>

                  <div className="flex min-h-12 overflow-hidden rounded-xl border border-white/10 bg-dark transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <span className="flex shrink-0 items-center border-r border-white/10 px-3 text-sm text-muted">
                      /
                    </span>

                    <input
                      id="service-slug-input"
                      name="slug"
                      type="text"
                      value={formData.slug}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      maxLength={
                        MAX_LENGTHS.slug
                      }
                      placeholder="web-development"
                      autoComplete="off"
                      required
                      className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-muted/60 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    Generated automatically from the title.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="service-order-input"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Display order
                  </label>

                  <input
                    id="service-order-input"
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

                  <p className="mt-2 text-xs leading-5 text-muted">
                    Lower numbers appear first.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="service-short-description"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Short description
                  </label>

                  <textarea
                    id="service-short-description"
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
                    placeholder="Summarize this service for service cards and listings."
                    className="w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
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

                <div className="sm:col-span-2">
                  <label
                    htmlFor="service-description"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Full description
                  </label>

                  <textarea
                    id="service-description"
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
                    placeholder="Describe the service, customer problem, approach and expected outcomes."
                    className="w-full resize-y rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-right text-xs text-muted">
                    {
                      characterCounts.description
                    }
                    /
                    {
                      MAX_LENGTHS.description
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* ==================================================
                Visual Settings
            ================================================== */}

            <section className="space-y-5 border-t border-white/10 pt-7">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Visual settings
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Provide visual references used by the public website.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="service-icon-name"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Icon name
                  </label>

                  <input
                    id="service-icon-name"
                    name="icon_name"
                    type="text"
                    value={formData.icon_name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    maxLength={
                      MAX_LENGTHS.iconName
                    }
                    placeholder="For example: Code2"
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service-image-url"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Image URL
                  </label>

                  <input
                    id="service-image-url"
                    name="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    maxLength={
                      MAX_LENGTHS.imageUrl
                    }
                    placeholder="https://..."
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>
            </section>

            {/* ==================================================
                Features and Technologies
            ================================================== */}

            <section className="space-y-6 border-t border-white/10 pt-7">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Service details
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Add reusable highlights and supported technologies.
                </p>
              </div>

              <TextCollectionField
                label="Features"
                description="Press Enter or comma to add a feature."
                placeholder="For example: Responsive development"
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
                description="List technologies commonly used for this service."
                placeholder="For example: React"
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
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Publishing
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Control visibility and homepage prominence.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="service-status"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Status
                  </label>

                  <select
                    id="service-status"
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="draft">
                      Draft — not visible publicly
                    </option>

                    <option value="published">
                      Published — visible publicly
                    </option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-dark px-4 py-3">
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
                </div>
              </div>
            </section>

            {/* ==================================================
                SEO Settings
            ================================================== */}

            <section className="space-y-5 border-t border-white/10 pt-7">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Search engine optimization
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Optional metadata for search results and link previews.
                </p>
              </div>

              <div>
                <label
                  htmlFor="service-seo-title"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  SEO title
                </label>

                <input
                  id="service-seo-title"
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
                  placeholder="Search result title"
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-dark px-4 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-right text-xs text-muted">
                  {
                    characterCounts.seoTitle
                  }
                  /
                  {
                    MAX_LENGTHS.seoTitle
                  }
                </p>
              </div>

              <div>
                <label
                  htmlFor="service-seo-description"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  SEO description
                </label>

                <textarea
                  id="service-seo-description"
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
                  placeholder="Brief description for search engines."
                  className="w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                      ? "mt-0.5 shrink-0 text-emerald-400"
                      : "mt-0.5 shrink-0 text-amber-400"
                  }
                  size={18}
                  aria-hidden="true"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    {isPublished
                      ? "This service will be published immediately."
                      : "This service will be saved as a draft."}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    You can change the publishing status later.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              Form Footer
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
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={18}
                    aria-hidden="true"
                  />

                  Creating service...
                </>
              ) : (
                <>
                  <FilePlus2
                    size={18}
                    aria-hidden="true"
                  />

                  Create service
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}