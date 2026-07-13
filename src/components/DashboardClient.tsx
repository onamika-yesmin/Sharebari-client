"use client";

import { Boxes, CalendarClock, CircleDollarSign, Gauge, PackageCheck, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LoadingState } from "@/components/LoadingState";
import { ApiError, getCurrentUser, getDashboardStats, type CurrentUser, type DashboardStats } from "@/lib/api";
import { formatMoney } from "@/lib/data";

function hasAuthMarker() {
  return typeof window !== "undefined" && window.localStorage.getItem("sharebari_authenticated") === "true";
}

export function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState(() => hasAuthMarker() ? "Loading dashboard..." : "Please log in to view your dashboard.");
  const [isUnauthorized, setIsUnauthorized] = useState(() => !hasAuthMarker());

  useEffect(() => {
    if (!hasAuthMarker()) return;

    Promise.all([getDashboardStats(), getCurrentUser()])
      .then(([dashboardStats, currentUser]) => {
        setStats(dashboardStats);
        setUser(currentUser);
        setMessage("");
      })
      .catch((error) => {
        setIsUnauthorized(error instanceof ApiError && error.status === 401);
        if (error instanceof ApiError && error.status === 401) {
          window.localStorage.removeItem("sharebari_authenticated");
        }
        setMessage(error instanceof Error ? error.message : "Could not load dashboard");
      });
  }, []);

  if (!stats) {
    if (!isUnauthorized) {
      return <LoadingState label={message || "Loading dashboard..."} />;
    }

    return (
      <div className="panel empty-state">
        <p>{isUnauthorized ? "Please log in to view your dashboard." : message}</p>
        {isUnauthorized ? <Link className="button" href="/login">Login</Link> : null}
      </div>
    );
  }

  const categoryData = stats.byCategory?.map((item) => ({ name: item._id, count: item.count })) || [];
  const availabilityData = stats.byAvailability?.map((item) => ({ name: item._id, count: item.count })) || [];
  const roleLabel = stats.totalListedItems > 0 ? "Owner workspace" : "Renter workspace";
  const healthScore = stats.totalListedItems === 0 ? 0 : Math.round((stats.availableItems / stats.totalListedItems) * 100);

  return (
    <>
      <section className="dashboard-hero panel">
        <div>
          <p className="eyebrow">Role based workspace</p>
          <h2>{roleLabel}</h2>
          <p>
            {stats.totalListedItems > 0
              ? "Manage your listed inventory, availability, pricing, and renter activity from one place."
              : "Browse rentals, start listing your first item, and build your owner dashboard as soon as you publish."}
          </p>
        </div>
        <div className="dashboard-profile">
          <span className="avatar avatar-large" aria-hidden="true">
            {user?.avatar ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" /> : <UserRound size={24} />}
          </span>
          <div>
            <strong>{user?.name || "ShareBari user"}</strong>
            <span>{user?.email || "Authenticated account"}</span>
            <small>{user?.role || "user"} account</small>
          </div>
        </div>
      </section>

      <section className="dashboard-tabs" aria-label="Dashboard roles">
        <span className="active"><Boxes size={16} aria-hidden="true" /> Owner</span>
        <span><CalendarClock size={16} aria-hidden="true" /> Renter</span>
        <span><ShieldCheck size={16} aria-hidden="true" /> Profile</span>
      </section>

      <section className="dashboard-stats">
        <div className="panel stat-card"><PackageCheck size={20} aria-hidden="true" /><span>Total listed items</span><strong>{stats.totalListedItems}</strong></div>
        <div className="panel stat-card"><Gauge size={20} aria-hidden="true" /><span>Available items</span><strong>{stats.availableItems}</strong><small>{healthScore}% ready</small></div>
        <div className="panel stat-card"><Boxes size={20} aria-hidden="true" /><span>Rented items</span><strong>{stats.rentedItems}</strong></div>
        <div className="panel stat-card"><CircleDollarSign size={20} aria-hidden="true" /><span>Average daily price</span><strong>{formatMoney(stats.averageDailyPrice)}</strong></div>
      </section>

      <section className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-title-row">
            <h3>Items by category</h3>
            <span className="badge">{categoryData.length || 0} groups</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2f6f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel chart-panel">
          <div className="panel-title-row">
            <h3>Availability distribution</h3>
            <span className="badge badge-warm">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={availabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8a623a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid-tight">
        <div className="panel workspace-panel">
          <h3>Owner actions</h3>
          <p>Keep item data fresh so renters can trust price, condition, and pickup expectations.</p>
          <div className="action-row">
            <Link className="button" href="/items/add">Add item</Link>
            <Link className="button-ghost" href="/items/manage">Manage listings</Link>
          </div>
        </div>
        <div className="panel workspace-panel">
          <h3>Renter actions</h3>
          <p>Search nearby options, compare deposits, and continue checkout when you find the right item.</p>
          <div className="action-row">
            <Link className="button-secondary" href="/explore">Explore rentals</Link>
            <Link className="button-ghost" href="/profile">Update profile</Link>
          </div>
        </div>
      </section>
    </>
  );
}
