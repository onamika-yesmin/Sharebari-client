"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiBaseUrl, apiDelete } from "@/lib/api";
import { categoryName, formatMoney, type RentalItem } from "@/lib/data";

export function ManageItemsClient() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [message, setMessage] = useState("Loading your listings...");

  async function loadItems() {
    try {
      const response = await fetch(`${apiBaseUrl}/api/items/my-items`, { credentials: "include" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Could not load listings");
      setItems(payload.data.map((item: RentalItem & { _id?: string; slug?: string }) => ({ ...item, id: item.slug || item._id || item.id })));
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load listings");
    }
  }

  async function deleteItem(id?: string) {
    if (!id) return;
    try {
      await apiDelete(`/api/items/${id}`);
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete item");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadItems();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (message && items.length === 0) {
    return <div className="panel empty-state">{message}</div>;
  }

  return (
    <section className="grid">
      {message ? <p className="notice">{message}</p> : null}
      {items.map((item) => (
        <div className="panel manage-row" key={item.id}>
          <img className="hero-photo" src={item.images[0]} alt={item.title} />
          <div>
            <h3>{item.title}</h3>
            <p>{categoryName(item.category)} - {formatMoney(item.dailyPrice)} / day</p>
            <p>Status: {item.availability}</p>
            <div className="action-row">
              <Link className="button-ghost" href={`/items/${item.id}`}>View</Link>
              <button className="button-secondary" type="button" onClick={() => deleteItem(item._id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
