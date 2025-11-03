// App navigation: decides which screens to show based on auth and profile state
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../providers/AuthProvider";
import { useProfile } from "../providers/ProfileProvider";
import { Button } from "react-native-paper";
import { Keyboard } from "react-native";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileOnboardingScreen from "../screens/ProfileOnboardingScreen";

const Stack = createNativeStackNavigator();

// Screens used when the user is not authenticated
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

// Screens used after the user is authenticated and onboarded
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
  // session: null when logged out, object when logged in
  const { session } = useAuth();
  // needsOnboarding: true when required profile fields are missing
  const { needsOnboarding } = useProfile();
  return (
    <NavigationContainer>
      {session ? (
        // Logged in: show onboarding until profile is complete
        needsOnboarding ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Onboarding"
              component={ProfileOnboardingScreen}
              options={{
                title: "Complete your profile",
                headerTitleAlign: "left",
                headerRight: () => (
                  <Button compact onPress={() => Keyboard.dismiss()}>
                    Hide keyboard
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "GrindTrack" }}
            />
          </Stack.Navigator>
        ) : (
          // Profile complete: show the main app stack
          <AppStack />
        )
      ) : (
        // Not logged in: show auth screens
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
