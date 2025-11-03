// Supabase client setup used throughout the app
// Polyfills ensure web APIs exist in React Native environment
import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Read connection details from Expo env (configured in app config / .env)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create a single shared client instance with React Native-friendly auth storage
export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    // Persist session tokens on device
    storage: AsyncStorage,
    // Keep sessions fresh with background refresh
    autoRefreshToken: true,
    // Rehydrate session on app start
    persistSession: true,
    // React Native has no URL to parse after OAuth redirect
    detectSessionInUrl: false,
  },
});

export default supabase;
