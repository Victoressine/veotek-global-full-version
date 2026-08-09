// ======================================================
// Supabase Client Configuration
// ======================================================

import { createClient } from "@supabase/supabase-js";

// ======================================================
// Environment Variables
// ======================================================

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim() || "";

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || "";

// ======================================================
// Configuration Validation
// ======================================================

function isValidSupabaseUrl(value) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl(supabaseUrl) &&
    supabasePublishableKey,
);

// ======================================================
// Supabase Client Factory
// ======================================================

function createSupabaseClient() {
  if (!isSupabaseConfigured) {
    console.error(
      "Supabase configuration is missing or invalid.",
    );

    return null;
  }

  try {
    return createClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      },
    );
  } catch (error) {
    console.error(
      "Failed to initialize Supabase:",
      error,
    );

    return null;
  }
}

// ======================================================
// Supabase Client
// ======================================================

export const supabase =
  createSupabaseClient();

// ======================================================
// Default Export
// ======================================================

export default supabase;