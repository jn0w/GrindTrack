// Thin service layer for workout queries via Supabase
import supabase from "../lib/supabaseClient";

// Get the 10 most recent workouts
export const listWorkouts = async () => {
  return await supabase
    .from("workouts")
    .select("id, name, created_at")
    .order("created_at", { ascending: false })
    .limit(10);
};
