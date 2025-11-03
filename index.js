// Entry point: registers the root React component with Expo
import { registerRootComponent } from "expo";

// The main App component which sets up providers and navigation
import App from "./App";

// This wires up the native runtime to render our App component.
// Works for both Expo Go and standalone native builds.
// Under the hood: AppRegistry.registerComponent('main', () => App)
registerRootComponent(App);
