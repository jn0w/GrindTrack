// Workouts service: helpers around the `workouts` table
import supabase from "../lib/supabaseClient";

// Fetch the latest workouts
export const listWorkouts = async () => {
  return await supabase
    .from("workouts")
    .select("id, name, created_at")
    .order("created_at", { ascending: false })
    .limit(10);
};
