// Authentication context: exposes session and auth actions to the app
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import supabase from "../lib/supabaseClient";
import { upsertProfile } from "../services/profiles";

// Holds auth-related state and operations
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Current Supabase auth session (null when logged out)
  const [session, setSession] = useState(null);
  // Indicates we are fetching the initial session on app start
  const [initializing, setInitializing] = useState(true);
  // Last auth-related error message (if any)
  const [error, setError] = useState(null);

  useEffect(() => {
    // On mount, load any persisted session and subscribe to future changes
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setInitializing(false);
    };
    init();

    // Keep session state in sync with Supabase auth events
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  // Create a new account and ensure a corresponding profile row exists
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

  // Sign in with email/password and ensure profile row exists
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

  // Sign out and clear session
  const signOut = async () => {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    return { error };
  };

  // Memoize context value to avoid needless re-renders
  const value = useMemo(
    () => ({ session, initializing, error, signUp, signIn, signOut }),
    [session, initializing, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
