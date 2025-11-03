// Onboarding screen: collects required profile details and saves them
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import {
  TextInput,
  Button,
  Switch,
  SegmentedButtons,
  Menu,
  Divider,
} from "react-native-paper";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "../providers/ProfileProvider";
import { useAuth } from "../providers/AuthProvider";
import { isUsernameAvailable } from "../services/profiles";

export default function ProfileOnboardingScreen() {
  const { session } = useAuth();
  const { profile, saveProfile, loading, error } = useProfile();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [experience, setExperience] = useState("");

  const [saving, setSaving] = useState(false);
  // null | 'checking' | 'available' | 'taken'
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [usernameError, setUsernameError] = useState("");

  const [weightMetric, setWeightMetric] = useState(true); // true = kg, false = lbs
  const [heightMetric, setHeightMetric] = useState(true); // true = cm, false = ft
  const [expMenuVisible, setExpMenuVisible] = useState(false);

  // Initialize fields from existing profile (if present)
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setUsername(profile.username ?? "");
      setAge(profile.age ? String(profile.age) : "");
      setGender(profile.gender ?? "");
      setWeight(profile.weight ? String(profile.weight) : "");
      setHeight(profile.height ? String(profile.height) : "");
      setExperience(profile.experience_level ?? "");
    }
  }, [profile]);

  // Debounced username availability check
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus(null);
      setUsernameError("");
      return;
    }
    let active = true;
    setUsernameStatus("checking");
    const handle = setTimeout(async () => {
      const lower = username.trim().toLowerCase();
      const { available, error: checkErr } = await isUsernameAvailable(
        lower,
        session?.user?.id
      );
      if (!active) return;
      if (checkErr) {
        setUsernameStatus(null);
        setUsernameError("Could not verify username");
      } else if (available) {
        setUsernameStatus("available");
        setUsernameError("");
      } else {
        setUsernameStatus("taken");
        setUsernameError("Username is already taken");
      }
    }, 400);
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [username, session?.user?.id]);

  // Parse numeric fields once to reuse downstream
  const parsed = useMemo(
    () => ({
      age: age ? parseInt(age, 10) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
    }),
    [age, weight, height]
  );

  // Validate required fields and gating conditions
  const canSubmit = useMemo(() => {
    const allPresent =
      fullName.trim() &&
      username.trim().length >= 3 &&
      parsed.age &&
      parsed.age >= 13 &&
      parsed.age <= 100 &&
      gender.trim() &&
      parsed.weight &&
      parsed.weight > 0 &&
      parsed.height &&
      parsed.height > 0 &&
      experience.trim();
    const usernameOk =
      usernameStatus === "available" ||
      (profile?.username && profile.username === username);
    return !!allPresent && usernameOk && !loading && !saving;
  }, [
    fullName,
    username,
    parsed,
    gender,
    experience,
    usernameStatus,
    loading,
    saving,
    profile,
  ]);

  // Convert units if needed and persist to backend
  const onSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    const lowerUsername = username.trim().toLowerCase();
    const toKg = (w) => (weightMetric ? w : w / 2.2046226218);
    const toCm = (h) => (heightMetric ? h : h * 30.48);
    const values = {
      full_name: fullName.trim(),
      username: lowerUsername,
      age: parsed.age,
      gender: gender.trim(),
      weight: parsed.weight
        ? Number(toKg(parsed.weight).toFixed(2))
        : undefined,
      height: parsed.height
        ? Number(toCm(parsed.height).toFixed(1))
        : undefined,
      experience_level: experience.trim(),
      preferred_weight_unit: weightMetric ? "kg" : "lbs",
      preferred_height_unit: heightMetric ? "cm" : "ft",
      // Use user id as a unique QR code seed for now
      qr_code: profile?.qr_code ?? session?.user?.id,
    };
    await saveProfile(values);
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <TextInput
              mode="outlined"
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Username (min 3 chars)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
              right={
                <TextInput.Affix
                  text={
                    usernameStatus === "checking"
                      ? "…"
                      : usernameStatus === "available"
                      ? "✓"
                      : usernameStatus === "taken"
                      ? "✗"
                      : ""
                  }
                />
              }
            />
            {!!usernameError && (
              <Text style={{ color: "red" }}>{usernameError}</Text>
            )}

            <TextInput
              mode="outlined"
              label="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              style={styles.input}
            />
            <View style={styles.sliderRow}>
              <Slider
                minimumValue={13}
                maximumValue={100}
                step={1}
                value={age ? Number(age) : 18}
                onValueChange={(v) => setAge(String(Math.round(v)))}
                style={{ flex: 1 }}
              />
              <Text style={{ width: 40, textAlign: "right" }}>{age || 18}</Text>
            </View>

            <SegmentedButtons
              value={gender || ""}
              onValueChange={setGender}
              style={{ width: "100%" }}
              buttons={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />

            <View style={styles.row}>
              <TextInput
                mode="outlined"
                label={`Weight (${weightMetric ? "kg" : "lbs"})`}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                style={[styles.input, { flex: 1 }]}
                right={<TextInput.Affix text={weightMetric ? "kg" : "lbs"} />}
              />
              <View style={styles.switchContainer}>
                <Text>kg</Text>
                <Switch
                  value={!weightMetric}
                  onValueChange={(v) => {
                    if (weight) {
                      const num = parseFloat(weight);
                      if (!Number.isNaN(num)) {
                        const converted = v
                          ? num * 2.2046226218
                          : num / 2.2046226218;
                        setWeight(String(Number(converted.toFixed(1))));
                      }
                    }
                    setWeightMetric(!v ? true : false);
                  }}
                />
                <Text>lbs</Text>
              </View>
            </View>

            <View style={styles.sliderRow}>
              <Slider
                minimumValue={weightMetric ? 30 : 66}
                maximumValue={weightMetric ? 200 : 440}
                step={weightMetric ? 0.5 : 1}
                value={weight ? Number(weight) : weightMetric ? 75 : 165}
                onValueChange={(v) =>
                  setWeight(String(Number(v.toFixed(weightMetric ? 1 : 0))))
                }
                style={{ flex: 1 }}
              />
              <Text style={{ width: 60, textAlign: "right" }}>
                {weight || (weightMetric ? 75 : 165)}
              </Text>
            </View>

            <View style={styles.row}>
              <TextInput
                mode="outlined"
                label={`Height (${heightMetric ? "cm" : "ft"})`}
                value={height}
                onChangeText={setHeight}
                keyboardType="decimal-pad"
                style={[styles.input, { flex: 1 }]}
                right={<TextInput.Affix text={heightMetric ? "cm" : "ft"} />}
              />
              <View style={styles.switchContainer}>
                <Text>cm</Text>
                <Switch
                  value={!heightMetric}
                  onValueChange={(v) => {
                    if (height) {
                      const num = parseFloat(height);
                      if (!Number.isNaN(num)) {
                        if (v) {
                          // switching to feet → 1 decimal place
                          const converted = num / 30.48;
                          setHeight(String(Number(converted.toFixed(1))));
                        } else {
                          // switching to cm → no decimals
                          const converted = num * 30.48;
                          setHeight(String(Math.round(converted)));
                        }
                      }
                    }
                    setHeightMetric(!v ? true : false);
                  }}
                />
                <Text>ft</Text>
              </View>
            </View>

            <View style={styles.sliderRow}>
              <Slider
                minimumValue={heightMetric ? 120 : 3.5}
                maximumValue={heightMetric ? 220 : 7.5}
                step={heightMetric ? 1 : 0.1}
                value={height ? Number(height) : heightMetric ? 175 : 5.9}
                onValueChange={(v) =>
                  setHeight(
                    String(heightMetric ? Math.round(v) : Number(v.toFixed(1)))
                  )
                }
                style={{ flex: 1 }}
              />
              <Text style={{ width: 60, textAlign: "right" }}>
                {height
                  ? heightMetric
                    ? String(Math.round(Number(height)))
                    : String(Number(Number(height).toFixed(1)))
                  : heightMetric
                  ? 175
                  : 5.9}
              </Text>
            </View>

            <View style={{ width: "100%" }}>
              <Menu
                visible={expMenuVisible}
                onDismiss={() => setExpMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setExpMenuVisible(true)}
                  >
                    {experience
                      ? `Experience: ${experience}`
                      : "Select experience level"}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setExperience("Beginner");
                    setExpMenuVisible(false);
                  }}
                  title="Beginner: 0-1 years"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setExperience("Novice");
                    setExpMenuVisible(false);
                  }}
                  title="Novice: 1-3 years"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setExperience("Intermediate");
                    setExpMenuVisible(false);
                  }}
                  title="Intermediate: 3-6 years"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setExperience("Advanced");
                    setExpMenuVisible(false);
                  }}
                  title="Advanced: 6-10 years"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setExperience("Elite");
                    setExpMenuVisible(false);
                  }}
                  title="Elite: 10+ years"
                />
              </Menu>
            </View>

            {(loading || saving) && <Text>Saving...</Text>}
            {error && <Text style={{ color: "red" }}>{error}</Text>}
            <Button mode="contained" onPress={onSubmit} disabled={!canSubmit}>
              Save and continue
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 16,
  },
  form: {
    gap: 8,
    alignItems: "stretch",
  },
  title: { fontSize: 20, marginBottom: 0 },
  input: { width: "100%", marginBottom: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
