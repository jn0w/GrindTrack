import React, { useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
// Auth hook gives us the current session and sign out action
import { useAuth } from "../providers/AuthProvider";
// Direct Supabase query example for demo purposes
import supabase from "../lib/supabaseClient";

export default function HomeScreen() {
  const { session, signOut } = useAuth();
  // Local UI state to show fetched workouts
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example: fetch the 10 most recent workouts from Supabase
  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("workouts")
        .select("id, name, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      setRows(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} className="px-4 gap-3">
      <Text className="text-xl font-semibold">Hello Gym Tracker! 💪</Text>
      <Text>Signed in as {session?.user?.email}</Text>
      <Button mode="contained" onPress={fetchWorkouts}>
        Fetch workouts (Supabase)
      </Button>
      <Button onPress={signOut}>Sign Out</Button>
      {loading && <ActivityIndicator />}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      {rows && (
        <View style={{ alignItems: "flex-start" }}>
          {rows.map((w) => (
            <Text key={w.id}>
              {w.name} — {new Date(w.created_at).toLocaleString()}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
