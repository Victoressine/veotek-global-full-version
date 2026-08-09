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
// Supabase Options
// ======================================================

const supabaseOptions = {
  db: {
    schema: "public",
  },

  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },

  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },

  global: {
    headers: {
      "X-Client-Info": "veotek-cms",
    },
  },
};

// ======================================================
// Client Factory
// ======================================================

function createSupabaseClient() {
  if (!isSupabaseConfigured) {
    console.error(
      "Supabase CMS configuration is missing or invalid.",
    );

    return null;
  }

  try {
    return createClient(
      supabaseUrl,
      supabasePublishableKey,
      supabaseOptions,
    );
  } catch (error) {
    console.error(
      "Failed to initialize Supabase CMS client:",
      error,
    );

    return null;
  }
}

// ======================================================
// Development Singleton
// ======================================================

const globalSupabaseKey =
  "__VEOTEK_CMS_SUPABASE_CLIENT__";

export const supabase = import.meta.env.DEV
  ? (globalThis[globalSupabaseKey] ??=
      createSupabaseClient())
  : createSupabaseClient();

// ======================================================
// Public Configuration
// ======================================================

export const supabaseConfig = Object.freeze({
  url: supabaseUrl,
  schema: "public",
  clientName: "veotek-cms",
});

// ======================================================
// Default Export
// ======================================================

export default supabase;