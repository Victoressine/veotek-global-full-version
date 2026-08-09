import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import useAuth from "../../hooks/useAuth";

function NavigationLink({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "flex min-h-11 items-center gap-3 rounded-xl px-4 py-3",
          "text-sm font-medium transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary focus-visible:ring-offset-2",
          "focus-visible:ring-offset-surface",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted hover:bg-white/5 hover:text-white",
        ].join(" ")
      }
    >
      <Icon aria-hidden="true" size={20} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await logout();

      onNavigate?.();

      toast.success("You have been signed out.");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        error?.message ||
          "Unable to sign out. Please try again."
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="border-b border-white/10 px-6 py-6">
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Go to dashboard"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent font-bold text-dark">
            V
          </div>

          <div>
            <p className="text-lg font-bold text-white">
              VeoTek
            </p>

            <p className="text-xs text-muted">
              Content Management
            </p>
          </div>
        </NavLink>
      </div>

      <nav
        aria-label="CMS navigation"
        className="flex-1 space-y-1 overflow-y-auto px-4 py-6"
      >
        {navigationItems.map((item) => (
          <NavigationLink
            key={item.path}
            item={item}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? (
            <Loader2
              aria-hidden="true"
              size={20}
              className="animate-spin"
            />
          ) : (
            <LogOut
              aria-hidden="true"
              size={20}
            />
          )}

          <span>
            {isLoggingOut
              ? "Signing out..."
              : "Sign out"}
          </span>
        </button>
      </div>
    </div>
  );
}