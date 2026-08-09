import { useEffect, useRef, useState } from "react";

import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Send,
  Star,
  Trash2,
  Upload,
} from "lucide-react";

import testimonialSubmissionService, {
  ALLOWED_PHOTO_TYPES,
  MAX_PHOTO_SIZE_BYTES,
} from "../../services/testimonialSubmissionService";

const INITIAL_FORM_STATE = {
  client_name: "",
  position: "",
  company: "",
  location: "",
  industry: "",
  review: "",
  rating: 5,
  consent_to_publish: false,
};

function validatePhoto(file) {
  if (!file) {
    return;
  }
  if (file.size === 0) {
    throw new Error("The selected image is empty.");
  }

  if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
    throw new Error("Kindly select a JPG, PNG, or WebP image.");
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    throw new Error("The client photo must not exceed 5 MB.");
  }
}

function getErrorMessage(error) {
  if (!error) {
    return "Your testimonial could not be submitted.";
  }

  switch (error.code) {
    case "42501":
      return "The testimonial could not be submitted because public submission access is unavailable.";

    case "23514":
      return "One or more submitted values are invalid.";

    default:
      return error.message || "Your testimonial could not be submitted.";
  }
}

function RatingSelector({ value, onChange, disabled }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-white">
        Your rating
        <span className="ml-1 text-red-400">*</span>
      </legend>

      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: 5 }, (_, index) => index + 1).map((rating) => {
          const selected = rating <= value;

          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              disabled={disabled}
              aria-label={`Give ${rating} out of 5 stars`}
              aria-pressed={value === rating}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-amber-400/30 hover:bg-amber-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Star
                size={21}
                aria-hidden="true"
                className={
                  selected ? "fill-amber-400 text-amber-400" : "text-white/25"
                }
              />
            </button>
          );
        })}

        <span className="ml-1 text-sm text-slate-400">{value} out of 5</span>
      </div>
    </fieldset>
  );
}

export default function TestimonialSubmissionForm() {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [photoPreview, setPhotoPreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrorMessage("");
  }

  function handleRatingChange(rating) {
    setFormData((current) => ({
      ...current,
      rating,
    }));

    setErrorMessage("");
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      validatePhoto(file);

      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }

      setSelectedPhoto(file);

      setPhotoPreview(URL.createObjectURL(file));

      setErrorMessage("");
    } catch (error) {
      setSelectedPhoto(null);
      setPhotoPreview("");
      setErrorMessage(error.message);

      event.target.value = "";
    }
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setSelectedPhoto(null);
    setPhotoPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function validateForm() {
    if (!formData.client_name.trim()) {
      throw new Error("Enter your full name.");
    }

    if (!formData.position.trim()) {
      throw new Error("Enter your position.");
    }

    if (!formData.company.trim()) {
      throw new Error("Enter your company.");
    }

    if (!formData.location.trim()) {
      throw new Error("Enter your location.");
    }

    if (!formData.industry.trim()) {
      throw new Error("Enter your industry.");
    }

    if (!formData.review.trim()) {
      throw new Error("Kindly enter your testimonial.");
    }

    if (formData.review.trim().length < 20) {
      throw new Error("Your testimonial must contain at least 20 characters.");
    }

    if (!formData.consent_to_publish) {
      throw new Error(
        "Kindly agree to the publication consent before submitting.",
      );
    }
  }

  function resetForm() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setFormData(INITIAL_FORM_STATE);

    setSelectedPhoto(null);
    setPhotoPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      validateForm();

      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      await testimonialSubmissionService.submitTestimonial({
        client_name: formData.client_name.trim(),

        position: formData.position.trim(),

        company: formData.company.trim(),

        location: formData.location.trim(),

        industry: formData.industry.trim(),

        review: formData.review.trim(),

        rating: Number(formData.rating),

        consent_to_publish: formData.consent_to_publish,

        photo: selectedPhoto,
      });
      resetForm();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setSuccessMessage(
        "Thank you. Your testimonial has been submitted for review. It will appear on our website after approval.",
      );
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Unable to submit testimonial:", error);
      }
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-7 lg:p-9"
      aria-labelledby="testimonial-form-heading"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-3xl" />

      <div className="relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            Share Your Experience
          </div>

          <h2
            id="testimonial-form-heading"
            className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl"
          >
            Tell Us About Your Experience With VeoTek
          </h2>

          <p className="mt-4 text-base leading-8 text-slate-400">
            Your feedback helps prospective clients understand how we work and
            the value our solutions provide. Every submission is reviewed before
            publication.
          </p>
        </div>

        {successMessage ? (
          <div
            id="testimonial-form-success"
            className="mt-7 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-4"
            role="status"
          >
            <CheckCircle2
              size={21}
              className="mt-0.5 shrink-0 text-emerald-300"
              aria-hidden="true"
            />

            <p className="text-sm leading-6 text-emerald-100">
              {successMessage}
            </p>
          </div>
        ) : null}

        {errorMessage ? (
          <div
            id="testimonial-form-error"
            className="mt-7 rounded-2xl border border-red-400/20 bg-red-400/[0.07] px-4 py-4"
            role="alert"
          >
            <p className="text-sm leading-6 text-red-200">{errorMessage}</p>
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-7"
          noValidate
          aria-describedby={
            errorMessage
              ? "testimonial-form-error"
              : successMessage
                ? "testimonial-form-success"
                : undefined
          }
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="testimonial-client-name"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Full Name
                <span className="ml-1 text-red-400">*</span>
              </label>

              <input
                id="testimonial-client-name"
                name="client_name"
                type="text"
                value={formData.client_name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                maxLength={150}
                autoComplete="name"
                placeholder="e.g. Michael Johnson"
                className="min-h-12 w-full rounded-xl border border-white/10 bg-[#070716] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="testimonial-position"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Position
                <span className="ml-1 text-red-400">*</span>
              </label>

              <input
                id="testimonial-position"
                name="position"
                type="text"
                value={formData.position}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                maxLength={150}
                autoComplete="organization-title"
                placeholder="e.g. Managing Director"
                className="min-h-12 w-full rounded-xl border border-white/10 bg-[#070716] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="testimonial-company"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Company
                <span className="ml-1 text-red-400">*</span>
              </label>

              <input
                id="testimonial-company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                maxLength={150}
                autoComplete="organization"
                placeholder="e.g. Veotek Global"
                className="min-h-12 w-full rounded-xl border border-white/10 bg-[#070716] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="testimonial-location"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Location
                <span className="ml-1 text-red-400">*</span>
              </label>

              <input
                id="testimonial-location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                maxLength={120}
                autoComplete="address-level2"
                placeholder="e.g. New York, NY"
                className="min-h-12 w-full rounded-xl border border-white/10 bg-[#070716] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="testimonial-industry"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Industry
                <span className="ml-1 text-red-400">*</span>
              </label>

              <input
                id="testimonial-industry"
                name="industry"
                type="text"
                value={formData.industry}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                maxLength={120}
                placeholder="e.g. Information Technology"
                className="min-h-12 w-full rounded-xl border border-white/10 bg-[#070716] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
              />
            </div>
          </div>
          <RatingSelector
            value={Number(formData.rating)}
            onChange={handleRatingChange}
            disabled={isSubmitting}
          />
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="testimonial-review"
                className="text-sm font-semibold text-white"
              >
                Your testimonial
                <span className="ml-1 text-red-400">*</span>
              </label>

              <span className="text-xs text-slate-500">
                {formData.review.length}/2000
              </span>
            </div>

            <textarea
              id="testimonial-review"
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              disabled={isSubmitting}
              maxLength={2000}
              minLength={20}
              rows={7}
              required
              placeholder="Tell us about the project, your experience working with VeoTek, and the outcome..."
              className="w-full resize-y rounded-xl border border-white/10 bg-[#070716] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-white">
              Your photo
              <span className="ml-1 text-xs font-normal text-slate-500">
                Optional
              </span>
            </p>

            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#070716]/70 p-4 sm:flex-row sm:items-center">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Selected testimonial photo preview"
                  className="h-24 w-24 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.025]">
                  <ImagePlus
                    size={30}
                    className="text-slate-500"
                    aria-hidden="true"
                  />
                </div>
              )}

              <div className="flex-1">
                <p className="text-sm text-slate-300">
                  Upload a professional photograph to accompany your
                  testimonial.
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  JPG, PNG or WebP. Maximum file size: 5 MB.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-50"
                  >
                    <Upload size={16} aria-hidden="true" />
                    Choose photo
                  </button>

                  {selectedPhoto ? (
                    <button
                      type="button"
                      onClick={removePhoto}
                      disabled={isSubmitting}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-400/20 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Remove
                    </button>
                  ) : null}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-[#070716]/70 px-4 py-4">
            <input
              name="consent_to_publish"
              type="checkbox"
              checked={formData.consent_to_publish}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
              className="mt-1 h-4 w-4 rounded border-white/20 bg-[#070716] text-cyan-400 focus:ring-cyan-400"
            />

            <span>
              <span className="block text-sm font-semibold text-white">
                Publication consent
                <span className="ml-1 text-red-400">*</span>
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-400">
                I confirm that the information provided is accurate and
                authorize VeoTek Global to review, edit for clarity, and publish
                this testimonial and uploaded photograph on its website and
                promotional channels.
              </span>
            </span>
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-xs leading-5 text-slate-500">
              Submitting this form does not publish your testimonial
              immediately. It will first be reviewed by the VeoTek team.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00CFFF] via-[#35E0FF] to-[#3B3BFF] px-7 text-sm font-bold text-white shadow-[0_18px_45px_rgba(0,207,255,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(59,59,255,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35E0FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030311] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send
                    size={18}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                  Submit testimonial
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
