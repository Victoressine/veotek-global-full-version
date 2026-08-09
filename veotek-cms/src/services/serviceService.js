// ======================================================
// Imports
// ======================================================

import { supabase } from "../lib/supabase";

// ======================================================
// Shared Column Selections
// ======================================================

const SERVICE_COLUMNS = `
  id,
  title,
  slug,
  short_description,
  description,
  icon_name,
  image_url,
  features,
  technologies,
  status,
  display_order,
  is_featured,
  is_system_service,
  seo_title,
  seo_description,
  created_by,
  updated_by,
  deleted_at,
  deleted_by,
  delete_reason,
  created_at,
  updated_at
`;

const AUDIT_COLUMNS = `
  id,
  entity_type,
  entity_id,
  action,
  actor_id,
  actor_role,
  entity_snapshot,
  metadata,
  created_at
`;

// ======================================================
// Constants
// ======================================================

const VALID_STATUSES = ["draft", "published"];

const DEFAULT_SERVICE_VALUES = {
  short_description: null,
  description: null,
  icon_name: null,
  image_url: null,
  features: [],
  technologies: [],
  status: "draft",
  display_order: 0,
  is_featured: false,
  is_system_service: false,
  seo_title: null,
  seo_description: null,
};

// ======================================================
// Validation Helpers
// ======================================================

function assertValidId(value, label = "ID") {
  if (
    !value ||
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(`${label} is required.`);
  }
}

function assertValidObject(value, message) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error(message);
  }
}

function assertValidStatus(status) {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(
      "Service status must be either draft or published."
    );
  }
}

function assertValidDisplayOrder(displayOrder) {
  if (
    !Number.isInteger(displayOrder) ||
    displayOrder < 0
  ) {
    throw new Error(
      "Display order must be a non-negative whole number."
    );
  }
}

function assertValidStringArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }

  const containsInvalidValue = value.some(
    (item) =>
      typeof item !== "string" ||
      !item.trim()
  );

  if (containsInvalidValue) {
    throw new Error(
      `${label} can only contain non-empty text values.`
    );
  }
}

function validateCreatePayload(serviceData) {
  assertValidObject(
    serviceData,
    "Valid service data is required."
  );

  if (!serviceData.title?.trim()) {
    throw new Error("Service title is required.");
  }

  if (!serviceData.slug?.trim()) {
    throw new Error("Service slug is required.");
  }

  assertValidStatus(
    serviceData.status ??
      DEFAULT_SERVICE_VALUES.status
  );

  assertValidDisplayOrder(
    serviceData.display_order ??
      DEFAULT_SERVICE_VALUES.display_order
  );

  assertValidStringArray(
    serviceData.features ??
      DEFAULT_SERVICE_VALUES.features,
    "Features"
  );

  assertValidStringArray(
    serviceData.technologies ??
      DEFAULT_SERVICE_VALUES.technologies,
    "Technologies"
  );

  if (!serviceData.created_by) {
    throw new Error(
      "The creating user is required."
    );
  }

  if (!serviceData.updated_by) {
    throw new Error(
      "The updating user is required."
    );
  }
}

// ======================================================
// Normalization Helpers
// ======================================================

function normalizeNullableText(value) {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim() || null;
}

function normalizeTextArray(value = []) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .filter(
          (item) =>
            typeof item === "string"
        )
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ];
}

function normalizeSlug(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDeleteReason(reason) {
  const normalizedReason =
    typeof reason === "string"
      ? reason.trim()
      : "";

  if (normalizedReason.length > 500) {
    throw new Error(
      "Delete reason cannot exceed 500 characters."
    );
  }

  return normalizedReason || null;
}

function normalizeCreatePayload(serviceData) {
  const slug = normalizeSlug(serviceData.slug);

  if (!slug) {
    throw new Error(
      "Enter a valid service slug."
    );
  }

  return {
    title: serviceData.title.trim(),
    slug,
    short_description:
      normalizeNullableText(
        serviceData.short_description
      ),
    description:
      normalizeNullableText(
        serviceData.description
      ),
    icon_name:
      normalizeNullableText(
        serviceData.icon_name
      ),
    image_url:
      normalizeNullableText(
        serviceData.image_url
      ),
    features: normalizeTextArray(
      serviceData.features
    ),
    technologies: normalizeTextArray(
      serviceData.technologies
    ),
    status:
      serviceData.status ??
      DEFAULT_SERVICE_VALUES.status,
    display_order:
      serviceData.display_order ??
      DEFAULT_SERVICE_VALUES.display_order,
    is_featured: Boolean(
      serviceData.is_featured
    ),
    is_system_service: Boolean(
      serviceData.is_system_service
    ),
    seo_title:
      normalizeNullableText(
        serviceData.seo_title
      ),
    seo_description:
      normalizeNullableText(
        serviceData.seo_description
      ),
    created_by: serviceData.created_by,
    updated_by: serviceData.updated_by,
  };
}

// ======================================================
// Error Mapping
// ======================================================

function mapSupabaseError(
  error,
  fallbackMessage
) {
  if (!error) {
    return new Error(fallbackMessage);
  }

  switch (error.code) {
    case "23505":
      return new Error(
        "A service with this slug already exists."
      );

    case "42501":
      return new Error(
        "You do not have permission to perform this action."
      );

    case "P0002":
      return new Error(
        "The requested service was not found."
      );

    case "22001":
      return new Error(
        "The provided text exceeds the allowed length."
      );

    default:
      return new Error(
        error.message || fallbackMessage
      );
  }
}

// ======================================================
// Update Payload Builder
// ======================================================

function buildUpdatePayload(serviceData) {
  assertValidObject(
    serviceData,
    "Valid service changes are required."
  );

  const updatePayload = {};

  if (serviceData.title !== undefined) {
    const title = serviceData.title.trim();

    if (!title) {
      throw new Error(
        "Service title cannot be empty."
      );
    }

    updatePayload.title = title;
  }

  if (serviceData.slug !== undefined) {
    const slug = normalizeSlug(
      serviceData.slug
    );

    if (!slug) {
      throw new Error(
        "Service slug cannot be empty."
      );
    }

    updatePayload.slug = slug;
  }

  if (
    serviceData.short_description !==
    undefined
  ) {
    updatePayload.short_description =
      normalizeNullableText(
        serviceData.short_description
      );
  }

  if (
    serviceData.description !== undefined
  ) {
    updatePayload.description =
      normalizeNullableText(
        serviceData.description
      );
  }

  if (
    serviceData.icon_name !== undefined
  ) {
    updatePayload.icon_name =
      normalizeNullableText(
        serviceData.icon_name
      );
  }

  if (
    serviceData.image_url !== undefined
  ) {
    updatePayload.image_url =
      normalizeNullableText(
        serviceData.image_url
      );
  }

  if (
    serviceData.features !== undefined
  ) {
    assertValidStringArray(
      serviceData.features,
      "Features"
    );

    updatePayload.features =
      normalizeTextArray(
        serviceData.features
      );
  }

  if (
    serviceData.technologies !== undefined
  ) {
    assertValidStringArray(
      serviceData.technologies,
      "Technologies"
    );

    updatePayload.technologies =
      normalizeTextArray(
        serviceData.technologies
      );
  }

  if (serviceData.status !== undefined) {
    assertValidStatus(
      serviceData.status
    );

    updatePayload.status =
      serviceData.status;
  }

  if (
    serviceData.display_order !== undefined
  ) {
    assertValidDisplayOrder(
      serviceData.display_order
    );

    updatePayload.display_order =
      serviceData.display_order;
  }

  if (
    serviceData.is_featured !== undefined
  ) {
    updatePayload.is_featured =
      Boolean(serviceData.is_featured);
  }

  if (
    serviceData.is_system_service !==
    undefined
  ) {
    updatePayload.is_system_service =
      Boolean(
        serviceData.is_system_service
      );
  }

  if (
    serviceData.seo_title !== undefined
  ) {
    updatePayload.seo_title =
      normalizeNullableText(
        serviceData.seo_title
      );
  }

  if (
    serviceData.seo_description !==
    undefined
  ) {
    updatePayload.seo_description =
      normalizeNullableText(
        serviceData.seo_description
      );
  }

  if (
    serviceData.updated_by !== undefined
  ) {
    updatePayload.updated_by =
      serviceData.updated_by;
  }

  if (
    Object.keys(updatePayload).length === 0
  ) {
    throw new Error(
      "No service changes were provided."
    );
  }

  return updatePayload;
}

// ======================================================
// Service API
// ======================================================

const serviceService = {
  // ====================================================
  // Get Active Services
  // ====================================================

  async getActiveServices() {
    const { data, error } = await supabase
      .from("services")
      .select(SERVICE_COLUMNS)
      .is("deleted_at", null)
      .order("display_order", {
        ascending: true,
      })
      .order("updated_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Supabase getActiveServices error:",
        error
      );

      throw mapSupabaseError(
        error,
        "Unable to load active services."
      );
    }

    return data ?? [];
  },

  // ====================================================
  // Get Deleted Services
  // ====================================================

  async getDeletedServices() {
    const { data, error } = await supabase
      .from("services")
      .select(SERVICE_COLUMNS)
      .not("deleted_at", "is", null)
      .order("deleted_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Supabase getDeletedServices error:",
        error
      );

      throw mapSupabaseError(
        error,
        "Unable to load deleted services."
      );
    }

    return data ?? [];
  },

  // ====================================================
  // Get One Service by ID
  // ====================================================

  async getServiceById(serviceId) {
    assertValidId(
      serviceId,
      "Service ID"
    );

    const { data, error } = await supabase
      .from("services")
      .select(SERVICE_COLUMNS)
      .eq("id", serviceId)
      .maybeSingle();

    if (error) {
      console.error(
        "Supabase getServiceById error:",
        error
      );

      throw mapSupabaseError(
        error,
        "Unable to load the service."
      );
    }

    return data;
  },

  // ====================================================
  // Get Active Service by Slug
  // ====================================================

  async getServiceBySlug(slug) {
    const normalizedSlug =
      normalizeSlug(slug);

    if (!normalizedSlug) {
      throw new Error(
        "Service slug is required."
      );
    }

    const { data, error } = await supabase
      .from("services")
      .select(SERVICE_COLUMNS)
      .eq("slug", normalizedSlug)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      console.error(
        "Supabase getServiceBySlug error:",
        error
      );

      throw mapSupabaseError(
        error,
        "Unable to load the service."
      );
    }

    return data;
  },

  // ====================================================
  // Create Service
  // ====================================================

  async createService(serviceData) {
    validateCreatePayload(serviceData);

    const normalizedService =
      normalizeCreatePayload(serviceData);

    const { data, error } = await supabase
      .from("services")
      .insert([normalizedService])
      .select(SERVICE_COLUMNS)
      .single();

    if (error) {
      console.error(
        "Supabase createService error:",
        error
      );

      throw mapSupabaseError(
        error,
        "Unable to create the service."
      );
    }

    return data;
  },

  // ====================================================
  // Update Service
  // ====================================================

  async updateService(
    serviceId,
    serviceData
  ) {
    assertValidId(
      serviceId,
      "Service ID"
    );

    const updatePayload =
      buildUpdatePayload(serviceData);

    const { data, error } = await supabase
      .from("services")
      .update(updatePayload)
      .eq("id", serviceId)
      .is("deleted_at", null)
      .select(SERVICE_COLUMNS)
      .single();

    if (error) {
      console.error(
        "Supabase updateService error:",
        error
      );

      throw mapSupabaseError(
        error,
        "Unable to update the service."
      );
    }

    return data;
  },

  // ====================================================
  // Publish Service
  // ====================================================

  async publishService(
    serviceId,
    userId
  ) {
    assertValidId(
      serviceId,
      "Service ID"
    );

    assertValidId(
      userId,
      "User ID"
    );

    return this.updateService(serviceId, {
      status: "published",
      updated_by: userId,
    });
  },

  // ====================================================
  // Move Service to Draft
  // ====================================================

  async unpublishService(
    serviceId,
    userId
  ) {
    assertValidId(
      serviceId,
      "Service ID"
    );

    assertValidId(
      userId,
      "User ID"
    );

    return this.updateService(serviceId, {
      status: "draft",
      updated_by: userId,
    });
  },

  // ====================================================
  // Soft Delete Service
  // ====================================================

  async softDeleteService(
    serviceId,
    reason = null
  ) {
    assertValidId(
      serviceId,
      "Service ID"
    );

    const normalizedReason =
      normalizeDeleteReason(reason);

    const { data, error } =
      await supabase.rpc(
        "soft_delete_service",
        {
          p_service_id: serviceId,
          p_reason: normalizedReason,
        }
      );

    if (error) {
      console.error(
        "Supabase softDeleteService error:",
        error
      );

      throw mapSupabaseError(
        error,
        "Unable to move the service to the Recycle Bin."
      );
    }

    return data;
  },

  // ====================================================
  // Restore Deleted Service
  // ====================================================

  async restoreService(serviceId) {
    assertValidId(
      serviceId,
      "Service ID"
    );

    const { data, error } =
      await supabase.rpc(
        "restore_deleted_service",
        {
          p_service_id: serviceId,
        }
      );

    if (error) {
      console.error(
        "Supabase restoreService error:",
        error
      );

      throw mapSupabaseError(
        error,
        "Unable to restore the service."
      );
    }

    return data;
  },

  // ====================================================
  // Permanently Delete Service
  // ====================================================

  async permanentlyDeleteService(
    serviceId
  ) {
    assertValidId(
      serviceId,
      "Service ID"
    );

    const { data, error } =
      await supabase.rpc(
        "permanently_delete_service",
        {
          p_service_id: serviceId,
        }
      );

    if (error) {
      console.error(
        "Supabase permanentlyDeleteService error:",
        error
      );

      throw mapSupabaseError(
        error,
        "Unable to permanently delete the service."
      );
    }

    return data;
  },

  // ====================================================
  // Get Service Audit History
  // ====================================================

  async getServiceAuditHistory(
    serviceId
  ) {
    assertValidId(
      serviceId,
      "Service ID"
    );

    const { data, error } = await supabase
      .from("content_audit_logs")
      .select(AUDIT_COLUMNS)
      .eq("entity_type", "service")
      .eq("entity_id", serviceId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Supabase getServiceAuditHistory error:",
        error
      );

      throw mapSupabaseError(
        error,
        "Unable to load service audit history."
      );
    }

    return data ?? [];
  },
};

// ======================================================
// Export
// ======================================================

export default serviceService;