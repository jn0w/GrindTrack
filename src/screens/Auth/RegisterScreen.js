import React, { useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
// Access sign up action and error from auth context
import { useAuth } from "../../providers/AuthProvider";

export default function RegisterScreen({ navigation }) {
  const { signUp, error } = useAuth();
  // Local input state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Create an account using Supabase Auth
  const onSubmit = async () => {
    setLoading(true);
    await signUp(email, password);
    setLoading(false);
  };

  return (
    <View style={styles.container} className="px-4 gap-3">
      <Text style={styles.title} className="text-xl font-semibold">
        Create your account
      </Text>
      <TextInput
        mode="outlined"
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {loading && <ActivityIndicator />}
      {/* Show last auth error if signup fails */}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Button mode="contained" onPress={onSubmit}>
        Sign Up
      </Button>
      <Button onPress={() => navigation.navigate("Login")}>
        Already have an account? Sign in
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
    padding: 16,
  },
  title: { fontSize: 20, marginBottom: 12 },
  input: {
    width: 280,
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
});
