"use client";

import { LayoutDashboard, LogOut, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCurrentUser, logoutUser, type CurrentUser } from "@/lib/api";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Items" },
  { href: "/categories", label: "Categories" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
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

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(() => hasAuthMarker());

  const initials = useMemo(() => user ? userInitials(user) : "", [user]);

  useEffect(() => {
    let isActive = true;

    if (!hasAuthMarker()) {
      return;
    }

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

  async function handleLogout() {
    try {
      await logoutUser();
    } catch {
      // Local cleanup still makes the UI correct if the API is unreachable.
    } finally {
      window.localStorage.removeItem("sharebari_authenticated");
      window.localStorage.removeItem("sharebari_auth_token");
      setUser(null);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="header">
      <nav className="container nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          ShareBari
          <span>Borrow Nearby. Save More.</span>
        </Link>
        <div className="nav-links">
          {publicLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
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
      </nav>
    </header>
  );
}
