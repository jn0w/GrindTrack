import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// App state providers
import { useAuth } from "../providers/AuthProvider";
import { useProfile } from "../providers/ProfileProvider";
// Screen components
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileOnboardingScreen from "../screens/ProfileOnboardingScreen";

// Single stack navigator used for all flows
const Stack = createNativeStackNavigator();

// Stack used when the user is signed out
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: "Login" }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: "Register" }}
    />
  </Stack.Navigator>
);

// Main app stack shown after onboarding is complete
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: "GrindTrack" }}
    />
  </Stack.Navigator>
);

export default function RootNavigator() {
  // Authenticated session indicates signed-in state
  const { session } = useAuth();
  // If the profile is missing required fields, show onboarding first
  const { needsOnboarding } = useProfile();
  return (
    <NavigationContainer>
      {session ? (
        needsOnboarding ? (
          // When signed in but not onboarded yet
          <Stack.Navigator>
            <Stack.Screen
              name="Onboarding"
              component={ProfileOnboardingScreen}
              options={{ title: "Profile" }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "GrindTrack" }}
            />
          </Stack.Navigator>
        ) : (
          // When signed in and onboarded
          <AppStack />
        )
      ) : (
        // When signed out
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
