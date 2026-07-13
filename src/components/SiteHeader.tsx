"use client";

import { Compass, Grid3X3, Home, Info, LayoutDashboard, LogOut, PackageSearch, Phone, Plus, Route, UserRound } from "lucide-react";
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

  const initials = useMemo(() => user ? userInitials(user) : "", [user]);

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
        <div className="nav-links">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link className={isActivePath(pathname, link.href) ? "nav-link active" : "nav-link"} href={link.href} key={link.href} aria-current={isActivePath(pathname, link.href) ? "page" : undefined}>
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
      </nav>
    </header>
  );
}
