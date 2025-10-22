import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// Read current auth session
import { useAuth } from "./AuthProvider";
// Service helpers to fetch and save profile rows
import { getMyProfile, upsertProfile } from "../services/profiles";

// Context exposing the user's profile data and actions
const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const { session } = useAuth();
  // Latest profile row from the database
  const [profile, setProfile] = useState(null);
  // Track network state and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract user id from the auth session (or null when signed out)
  const userId = session?.user?.id ?? null;

  // Fetch the current user's profile from the database
  const loadProfile = async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getMyProfile(userId);
      if (error) throw error;
      setProfile(data ?? null);
    } catch (e) {
      setError(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Whenever the signed-in user changes, refetch profile
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Create or update the profile row, then refresh local state
  const saveProfile = async (values = {}) => {
    if (!userId) return { error: "No authenticated user" };
    setError(null);
    const { error } = await upsertProfile(userId, values);
    if (!error) await loadProfile();
    if (error) setError(error.message ?? String(error));
    return { error };
  };

  // Derive and memoize values for consumers
  const value = useMemo(() => {
    const needsOnboarding = !!userId && (!profile || !profile.full_name);
    return {
      profile,
      loading,
      error,
      needsOnboarding,
      refreshProfile: loadProfile,
      saveProfile,
    };
  }, [userId, profile, loading, error]);

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

// Convenience hook to access profile context
export const useProfile = () => useContext(ProfileContext);
