/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../services/authService";
import profileService from "../services/profileService";

// ======================================================
// Authentication Context
// ======================================================

const AuthContext = createContext(undefined);

// ======================================================
// Authentication Provider
// ======================================================

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // ====================================================
  // Restore Authentication Session
  // ====================================================

  useEffect(() => {
    let isMounted = true;

    async function initialiseAuth() {
      try {
        const currentSession =
          await authService.getSession();

        if (!isMounted) {
          return;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error(
          "Unable to restore authentication session:",
          error,
        );

        if (isMounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    void initialiseAuth();

    const {
      data: { subscription },
    } = authService.onAuthStateChange(
      (_event, currentSession) => {
        if (!isMounted) {
          return;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setAuthLoading(false);
      },
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // ====================================================
  // Load CMS Profile
  // ====================================================

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!user?.id) {
        if (isMounted) {
          setProfile(null);
          setProfileError(null);
          setProfileLoading(false);
        }

        return;
      }

      try {
        setProfileLoading(true);
        setProfileError(null);

        const currentProfile =
          await profileService.getProfile(user.id);

        if (!isMounted) {
          return;
        }

        if (!currentProfile) {
          throw new Error(
            "No CMS profile was found for this account.",
          );
        }

        setProfile(currentProfile);
      } catch (error) {
        console.error(
          "Unable to load CMS profile:",
          error,
        );

        if (isMounted) {
          setProfile(null);

          setProfileError(
            error?.message ||
              "Unable to load your CMS profile.",
          );
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // ====================================================
  // Login
  // ====================================================

  async function login(email, password) {
    return authService.signIn(email, password);
  }

  // ====================================================
  // Logout
  // ====================================================

  async function logout() {
    await authService.signOut();

    setSession(null);
    setUser(null);
    setProfile(null);
    setProfileError(null);
    setProfileLoading(false);
  }

  // ====================================================
  // Refresh Profile
  // ====================================================

const refreshProfile = useCallback(async () => {
  if (!user?.id) {
    setProfile(null);

    return null;
  }

  try {
    setProfileLoading(true);
    setProfileError(null);

    const refreshedProfile =
      await profileService.getProfile(user.id);

    if (!refreshedProfile) {
      throw new Error(
        "No CMS profile was found for this account.",
      );
    }

    setProfile(refreshedProfile);

    return refreshedProfile;
  } catch (error) {
    console.error(
      "Unable to refresh CMS profile:",
      error,
    );

    setProfileError(
      error?.message ||
        "Unable to refresh your CMS profile.",
    );

    throw error;
  } finally {
    setProfileLoading(false);
  }
}, [user?.id]);

  // ====================================================
  // Derived Authentication State
  // ====================================================

  const loading =
  authLoading ||
  Boolean(user && profileLoading) ||
  Boolean(
    user &&
      !profile &&
      !profileError,
  );

  const isActive =
    profile?.is_active === true;

  const isAdmin =
    profile?.role === "admin";

  const isEditor =
    profile?.role === "editor";

  // ====================================================
// Context Value
// ====================================================

const value = useMemo(
  () => ({
    session,
    user,
    profile,
    loading,
    authLoading,
    profileLoading,
    profileError,
    isActive,
    isAdmin,
    isEditor,
    login,
    logout,
    refreshProfile,
  }),
  [
    session,
    user,
    profile,
    loading,
    authLoading,
    profileLoading,
    profileError,
    isActive,
    isAdmin,
    isEditor,
    refreshProfile,
  ],
);
      
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ======================================================
// Authentication Hook
// ======================================================

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider",
    );
  }

  return context;
}