"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ApiError, getDashboardStats, type DashboardStats } from "@/lib/api";

export function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [message, setMessage] = useState("Loading dashboard...");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        setStats(data);
        setMessage("");
      })
      .catch((error) => {
        setIsUnauthorized(error instanceof ApiError && error.status === 401);
        setMessage(error instanceof Error ? error.message : "Could not load dashboard");
      });
  }, []);

  if (!stats) {
    return (
      <div className="panel empty-state">
        <p>{isUnauthorized ? "Please log in to view your dashboard." : message}</p>
        {isUnauthorized ? <Link className="button" href="/login">Login</Link> : null}
      </div>
    );
  }

  const categoryData = stats.byCategory?.map((item) => ({ name: item._id, count: item.count })) || [];
  const availabilityData = stats.byAvailability?.map((item) => ({ name: item._id, count: item.count })) || [];

  return (
    <>
      <section className="grid grid-4">
        <div className="panel stat"><strong>{stats.totalListedItems}</strong><span>Total listed items</span></div>
        <div className="panel stat"><strong>{stats.availableItems}</strong><span>Available items</span></div>
        <div className="panel stat"><strong>{stats.rentedItems}</strong><span>Rented items</span></div>
        <div className="panel stat"><strong>{stats.averageDailyPrice}</strong><span>Average daily price</span></div>
      </section>
      <section className="section grid grid-2">
        <div className="panel chart-panel">
          <h3>Items by category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#16745f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel chart-panel">
          <h3>Availability distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={availabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
