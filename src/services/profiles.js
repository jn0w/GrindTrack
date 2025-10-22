// Thin service layer for profile CRUD via Supabase
import supabase from "../lib/supabaseClient";

// Insert or update a profile by user_id (idempotent)
export const upsertProfile = async (userId, values = {}) => {
  return await supabase
    .from("profiles")
    .upsert({ user_id: userId, ...values }, { onConflict: "user_id" });
};

// Fetch a single profile row for the given user_id
export const getMyProfile = async (userId) => {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
};
