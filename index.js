import { registerRootComponent } from "expo";

// Import the main App component
import App from "./App";

// Register the root component so Expo/React Native can bootstrap the app
// Works both in Expo Go and standalone builds
registerRootComponent(App);
