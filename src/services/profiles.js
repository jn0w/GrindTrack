// Profile service: CRUD helpers for the `profiles` table
import supabase from "../lib/supabaseClient";

// Insert or update a profile row keyed by user_id
export const upsertProfile = async (userId, values = {}) => {
  return await supabase
    .from("profiles")
    .upsert({ user_id: userId, ...values }, { onConflict: "user_id" });
};

// Fetch the current user's profile (single row)
export const getMyProfile = async (userId) => {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
};

// Check if a username is unused (case-insensitive), excluding the current user
export const isUsernameAvailable = async (username, excludeUserId) => {
  if (!username) return { available: false, error: null };
  let query = supabase
    .from("profiles")
    .select("user_id", { count: "exact", head: true })
    .ilike("username", username);
  if (excludeUserId) {
    query = query.neq("user_id", excludeUserId);
  }
  const { count, error } = await query;
  return { available: !error && (count ?? 0) === 0, error };
};
