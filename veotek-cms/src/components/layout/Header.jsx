import { Menu } from "lucide-react";

import useAuth from "../../hooks/useAuth";

function getInitials(fullName, email) {
  const cleanedName = fullName?.trim();

  if (cleanedName) {
    const nameParts = cleanedName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    return nameParts
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  }

  return email?.charAt(0)?.toUpperCase() || "U";
}

function formatRole(role) {
  if (!role) {
    return "CMS User";
  }

  return role
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

export default function Header({ onOpenSidebar }) {
  const { user, profile } = useAuth();

  const displayName =
    profile?.full_name?.trim() ||
    user?.email?.split("@")[0] ||
    "CMS User";

  const displayEmail =
    profile?.email || user?.email || "";

  const initials = getInitials(
    profile?.full_name,
    displayEmail
  );

  const roleLabel = formatRole(profile?.role);

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-white/10 bg-dark/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-surface text-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        >
          <Menu
            aria-hidden="true"
            size={22}
          />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white sm:text-base">
            VeoTek CMS
          </p>

          <p className="hidden truncate text-xs text-muted sm:block">
            Website content management
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden min-w-0 text-right sm:block">
          <p className="max-w-48 truncate text-sm font-semibold text-white">
            {displayName}
          </p>

          <p className="max-w-48 truncate text-xs text-muted">
            {roleLabel}
          </p>
        </div>

        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-dark"
          aria-label={`${displayName}, ${roleLabel}`}
          title={displayEmail}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}