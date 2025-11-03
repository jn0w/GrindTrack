// App root: sets up global UI and data providers used across the app
import { StatusBar } from "expo-status-bar";
import React from "react";
// Authentication and user profile contexts
import { AuthProvider } from "./src/providers/AuthProvider";
import { ProfileProvider } from "./src/providers/ProfileProvider";
// Navigation tree that renders screens based on auth/profile state
import RootNavigator from "./src/navigation/RootNavigator";
// React Native Paper provides theming and UI components
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
// Keeps UI within safe bounds (notches, status bar, etc.)
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    // App-wide theme provider (colors, fonts, components)
    <PaperProvider theme={MD3LightTheme}>
      {/* Ensures content respects device safe areas */}
      <SafeAreaProvider>
        {/* Provides authentication state and actions to the app */}
        <AuthProvider>
          {/* Provides user profile data and onboarding state */}
          <ProfileProvider>
            {/* Chooses which screen stack to show (auth, onboarding, home) */}
            <RootNavigator />
            {/* Native status bar styling */}
            <StatusBar style="auto" />
          </ProfileProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
