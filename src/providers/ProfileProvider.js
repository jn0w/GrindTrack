// Profile context: loads, exposes, and saves the current user's profile
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import { getMyProfile, upsertProfile } from "../services/profiles";

// Provides profile data and onboarding helpers
const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const { session } = useAuth();
  // Current user's profile row from the database
  const [profile, setProfile] = useState(null);
  // Loading flag for profile fetch/save operations
  const [loading, setLoading] = useState(false);
  // Last profile-related error message
  const [error, setError] = useState(null);

  // Convenience: user id of the authenticated user (or null)
  const userId = session?.user?.id ?? null;

  // Fetch the profile for the current user from the backend
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
    // Re-load profile whenever the authenticated user changes
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Save profile changes and refresh local state
  const saveProfile = async (values = {}) => {
    if (!userId) return { error: "No authenticated user" };
    setError(null);
    const { error } = await upsertProfile(userId, values);
    if (!error) await loadProfile();
    if (error) setError(error.message ?? String(error));
    return { error };
  };

  // Compute derived flags (e.g., whether onboarding is still required)
  const value = useMemo(() => {
    const requiredFields = [
      "full_name",
      "username",
      "age",
      "gender",
      "weight",
      "height",
      "experience_level",
      "qr_code",
    ];
    const hasAll = !!profile && requiredFields.every((k) => profile?.[k]);
    const needsOnboarding = !!userId && !hasAll;
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

export const useProfile = () => useContext(ProfileContext);
