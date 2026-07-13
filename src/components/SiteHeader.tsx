"use client";

import { Compass, Grid3X3, Home, Info, LayoutDashboard, LogOut, Menu, PackageSearch, Phone, Plus, Route, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCurrentUser, logoutUser, type CurrentUser } from "@/lib/api";
import { showError, showSuccess } from "@/lib/alerts";

const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { href: "/how-it-works", label: "How It Works", icon: Route },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

function hasAuthMarker() {
  return typeof window !== "undefined" && window.localStorage.getItem("sharebari_authenticated") === "true";
}

function userInitials(user: CurrentUser) {
  const source = user.name || user.email || "ShareBari User";
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SU";
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const initials = useMemo(() => (user ? userInitials(user) : ""), [user]);

  useEffect(() => {
    let isActive = true;

    if (!hasAuthMarker()) {
      return;
    }

    Promise.resolve().then(() => {
      if (isActive) setIsCheckingSession(true);
    });
    getCurrentUser()
      .then((data) => {
        if (!isActive) return;
        setUser(data);
        window.localStorage.setItem("sharebari_authenticated", "true");
      })
      .catch(() => {
        if (!isActive) return;
        setUser(null);
        window.localStorage.removeItem("sharebari_authenticated");
        window.localStorage.removeItem("sharebari_auth_token");
      })
      .finally(() => {
        if (isActive) setIsCheckingSession(false);
      });

    return () => {
      isActive = false;
    };
  }, [pathname]);

  // Close the off-canvas menu whenever the route changes.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsMenuOpen(false), 0);
    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  // Lock body scroll + allow Escape to close while the off-canvas menu is open.
  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  async function handleLogout() {
    try {
      await logoutUser();
      await showSuccess("Logged out", "You have been signed out from ShareBari.");
    } catch {
      await showError("Session closed locally", "The server did not respond, but your browser session was cleared.");
    } finally {
      window.localStorage.removeItem("sharebari_authenticated");
      window.localStorage.removeItem("sharebari_auth_token");
      setUser(null);
      setIsMenuOpen(false);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="header">
      <nav className="container nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          <Image className="site-logo-image" src="/sharebari-logo.svg" width={44} height={44} alt="" aria-hidden="true" priority />
          <span className="brand-copy">
            <strong>ShareBari</strong>
            <small>Borrow Nearby. Save More.</small>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                className={isActivePath(pathname, link.href) ? "nav-link active" : "nav-link"}
                href={link.href}
                key={link.href}
                aria-current={isActivePath(pathname, link.href) ? "page" : undefined}
              >
                <Icon size={16} aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}

          {user ? (
            <div className="account-nav" aria-label="Account navigation">
              <Link className="icon-button" href="/items/add" aria-label="Add item" title="Add item">
                <Plus size={18} aria-hidden="true" />
              </Link>
              <Link className="account-chip" href="/profile" aria-label={`${user.name || "User"} profile`}>
                <span className="avatar" aria-hidden="true">
                  {user.avatar ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" /> : initials}
                </span>
                <span className="account-text">
                  <strong>{user.name || "ShareBari user"}</strong>
                  <small>{user.email}</small>
                </span>
              </Link>
              <Link className="icon-button" href="/dashboard" aria-label="Dashboard" title="Dashboard">
                <LayoutDashboard size={18} aria-hidden="true" />
              </Link>
              <Link className="icon-button" href="/items/manage" aria-label="Manage listings" title="Manage listings">
                <PackageSearch size={18} aria-hidden="true" />
              </Link>
              <button className="icon-button" type="button" onClick={handleLogout} aria-label="Logout" title="Logout">
                <LogOut size={18} aria-hidden="true" />
              </button>
            </div>
          ) : isCheckingSession ? (
            <div className="account-skeleton" aria-label="Checking account">
              <UserRound size={18} aria-hidden="true" />
              <span>Checking...</span>
            </div>
          ) : (
            <div className="auth-nav">
              <Link className="button-ghost" href="/login">Login</Link>
              <Link className="button" href="/register">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          className="menu-trigger"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-offcanvas"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {/* Off-canvas backdrop */}
      <div
        className={isMenuOpen ? "offcanvas-backdrop is-visible" : "offcanvas-backdrop"}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Off-canvas panel */}
      <aside
        id="mobile-offcanvas"
        className={isMenuOpen ? "offcanvas is-open" : "offcanvas"}
        aria-hidden={!isMenuOpen}
      >
        <div className="offcanvas-header">
          <span className="offcanvas-brand">
            <strong>ShareBari</strong>
            <small>Borrow Nearby. Save More.</small>
          </span>
          <button
            type="button"
            className="icon-button"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {user && (
          <Link className="offcanvas-profile" href="/profile" onClick={() => setIsMenuOpen(false)}>
            <span className="avatar" aria-hidden="true">
              {user.avatar ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" /> : initials}
            </span>
            <span className="account-text">
              <strong>{user.name || "ShareBari user"}</strong>
              <small>{user.email}</small>
            </span>
          </Link>
        )}

        <div className="offcanvas-links">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                className={isActivePath(pathname, link.href) ? "offcanvas-link active" : "offcanvas-link"}
                href={link.href}
                key={link.href}
                aria-current={isActivePath(pathname, link.href) ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon size={18} aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {user ? (
          <div className="offcanvas-actions">
            <Link className="offcanvas-link" href="/items/add" onClick={() => setIsMenuOpen(false)}>
              <Plus size={18} aria-hidden="true" />
              Add item
            </Link>
            <Link className="offcanvas-link" href="/dashboard" onClick={() => setIsMenuOpen(false)}>
              <LayoutDashboard size={18} aria-hidden="true" />
              Dashboard
            </Link>
            <Link className="offcanvas-link" href="/items/manage" onClick={() => setIsMenuOpen(false)}>
              <PackageSearch size={18} aria-hidden="true" />
              Manage listings
            </Link>
            <button className="offcanvas-link offcanvas-logout" type="button" onClick={handleLogout}>
              <LogOut size={18} aria-hidden="true" />
              Logout
            </button>
          </div>
        ) : isCheckingSession ? (
          <div className="account-skeleton" aria-label="Checking account">
            <UserRound size={18} aria-hidden="true" />
            <span>Checking...</span>
          </div>
        ) : (
          <div className="offcanvas-auth">
            <Link className="button-ghost" href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link className="button" href="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
          </div>
        )}
      </aside>
    </header>
  );
}