import { Loader2, LogOut, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

function LoadingScreen() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-dark"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className="h-8 w-8 animate-spin text-primary"
          aria-hidden="true"
        />

        <p className="text-sm text-muted">Verifying your account...</p>
      </div>

      <span className="sr-only">
        Loading authentication and profile information
      </span>
    </div>
  );
}

function AccessDenied({ message }) {
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(error?.message || "Unable to sign out. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dark px-4 text-light">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 text-center shadow-2xl sm:p-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10">
          <ShieldAlert aria-hidden="true" className="text-red-400" size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-white">
          Access unavailable
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted">{message}</p>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <LogOut aria-hidden="true" size={18} />
          Return to login
        </button>
      </section>
    </main>
  );
}

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const { user, profile, loading, profileError, isActive, isAdmin, isEditor } =
    useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (profileError || !profile) {
    return (
      <AccessDenied message="Your account is authenticated, but no valid CMS profile could be loaded. Contact an administrator to confirm your access." />
    );
  }

  if (!isActive) {
    return (
      <AccessDenied message="Your CMS account has been deactivated. Contact an administrator if you believe this is incorrect." />
    );
  }

  if (!isAdmin && !isEditor) {
    return (
      <AccessDenied message="Your account does not have permission to access the CMS." />
    );
  }

  return children;
}
