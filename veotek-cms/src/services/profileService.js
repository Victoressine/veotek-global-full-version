import { supabase } from "../lib/supabase";

// ======================================================
// Supabase Guard
// ======================================================

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "The CMS profile service is unavailable.",
    );
  }

  return supabase;
}

// ======================================================
// Profile Service
// ======================================================

const profileService = {
  async getProfile(userId) {
    if (
      typeof userId !== "string" ||
      !userId.trim()
    ) {
      throw new Error(
        "A user ID is required to retrieve a profile.",
      );
    }

    const client = requireSupabase();

    const { data, error } = await client
      .from("profiles")
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        role,
        is_active,
        created_at,
        updated_at
      `)
      .eq("id", userId.trim())
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ?? null;
  },
};

export default profileService;