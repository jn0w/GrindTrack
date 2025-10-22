// Polyfills for React Native environment so URL and crypto APIs work as expected
import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
// Persist auth/session state on device
import AsyncStorage from "@react-native-async-storage/async-storage";
// Official Supabase client
import { createClient } from "@supabase/supabase-js";

// Read Supabase project URL and anon key from Expo env vars
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create a configured Supabase client for React Native
export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    // Store session using AsyncStorage instead of cookies
    storage: AsyncStorage,
    // Automatically refresh JWT tokens in the background
    autoRefreshToken: true,
    // Keep the session across app restarts
    persistSession: true,
    // In native apps there is no URL to parse for session
    detectSessionInUrl: false,
  },
});

// Default export for convenience
export default supabase;
