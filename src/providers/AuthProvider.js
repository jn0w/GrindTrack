import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// Supabase client for auth operations
import supabase from "../lib/supabaseClient";
// Profile helper to ensure a profile row exists
import { upsertProfile } from "../services/profiles";

// React context to expose auth state and actions to the app
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Supabase session object when user is logged in
  const [session, setSession] = useState(null);
  // Track initial load so UI can wait for session check
  const [initializing, setInitializing] = useState(true);
  // Store last auth-related error message
  const [error, setError] = useState(null);

  useEffect(() => {
    // On mount, fetch any existing persisted session
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setInitializing(false);
    };
    init();

    // Subscribe to auth changes (sign in/out, token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );
    // Cleanup listener on unmount
    return () => sub.subscription.unsubscribe();
  }, []);

  // Register a new user, and create their profile row if signup succeeds
  const signUp = async (email, password) => {
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!error) {
      const newUserId = data?.user?.id;
      if (newUserId) {
        await upsertProfile(newUserId, { email });
      }
    }
    if (error) setError(error.message);
    return { error };
  };

  // Sign in an existing user, and ensure their profile row exists
  const signIn = async (email, password) => {
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      const existingUserId = data?.user?.id;
      if (existingUserId) {
        // Ensure a profile row exists (idempotent)
        await upsertProfile(existingUserId, { email });
      }
    }
    if (error) setError(error.message);
    return { error };
  };

  // Clear the current session
  const signOut = async () => {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    return { error };
  };

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({ session, initializing, error, signUp, signIn, signOut }),
    [session, initializing, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Convenience hook to read auth context
export const useAuth = () => useContext(AuthContext);
