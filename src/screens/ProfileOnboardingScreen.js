import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
// Profile context provides save action and loading/error state
import { useProfile } from "../providers/ProfileProvider";

export default function ProfileOnboardingScreen() {
  const { saveProfile, loading, error } = useProfile();
  // Local form state
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  // Save basic profile info and move forward
  const onSubmit = async () => {
    setSaving(true);
    await saveProfile({ full_name: fullName });
    setSaving(false);
  };

  return (
    <View style={styles.container} className="px-4 gap-3">
      <Text style={styles.title} className="text-xl font-semibold">
        Complete your profile
      </Text>
      <TextInput
        mode="outlined"
        label="Full name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      {(loading || saving) && <Text>Saving...</Text>}
      {/* Display save errors */}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Button mode="contained" onPress={onSubmit} disabled={!fullName.trim()}>
        Continue
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, marginBottom: 12 },
  input: {
    width: 280,
  },
});
