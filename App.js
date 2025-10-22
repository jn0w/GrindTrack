import { StatusBar } from "expo-status-bar";
import React from "react";
// Global providers wrap the app to share state (auth/profile)
import { AuthProvider } from "./src/providers/AuthProvider";
import { ProfileProvider } from "./src/providers/ProfileProvider";
// App navigation entry
import RootNavigator from "./src/navigation/RootNavigator";
// UI libraries/providers
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <SafeAreaProvider>
        {/* AuthProvider exposes sign-in/out and session */}
        <AuthProvider>
          {/* ProfileProvider manages user profile data & onboarding state */}
          <ProfileProvider>
            <RootNavigator />
            <StatusBar style="auto" />
          </ProfileProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
