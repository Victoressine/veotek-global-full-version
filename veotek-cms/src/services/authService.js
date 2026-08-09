import { supabase } from "../lib/supabase";

// ======================================================
// Supabase Guard
// ======================================================

function requireSupabase() {
  if (!supabase) {
    const error = new Error(
      "The CMS authentication service is unavailable.",
    );

    error.name = "SupabaseUnavailableError";
    error.code = "SUPABASE_NOT_CONFIGURED";

    throw error;
  }

  return supabase;
}

// ======================================================
// Authentication Service
// ======================================================

const authService = {
  async signIn(email, password) {
    const client = requireSupabase();

    const normalizedEmail =
      String(email ?? "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new Error(
        "Email and password are required.",
      );
    }

    const { data, error } =
      await client.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

    if (error) {
      throw error;
    }

    return data;
  },

  async signOut() {
    const client = requireSupabase();

    const { error } =
      await client.auth.signOut();

    if (error) {
      throw error;
    }
  },

  async getSession() {
    const client = requireSupabase();

    const { data, error } =
      await client.auth.getSession();

    if (error) {
      throw error;
    }

    return data?.session ?? null;
  },

  onAuthStateChange(callback) {
    if (!supabase) {
      return {
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      };
    }

    return supabase.auth.onAuthStateChange(
      callback,
    );
  },
};

export default authService;