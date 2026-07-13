"use client";

import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiDelete, getMyItems } from "@/lib/api";
import { categoryName, formatMoney, type RentalItem } from "@/lib/data";

export function ManageItemsClient() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [message, setMessage] = useState("Loading your listings...");

  async function loadItems() {
    try {
      const data = await getMyItems();
      setItems(data);
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
    return (
      <div className="panel empty-state">
        <p>{message}</p>
        <Link className="button" href="/items/add">Add first item</Link>
      </div>
    );
  }

  return (
    <section className="manage-list">
      {message ? <p className="notice">{message}</p> : null}
      {items.map((item) => (
        <div className="panel manage-row" key={item.id}>
          <img className="manage-thumb" src={item.images[0]} alt={item.title} />
          <div className="manage-content">
            <div>
              <div className="badge-row">
                <span className="badge">{categoryName(item.category)}</span>
                <span className="badge badge-warm">{item.availability}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.location} - {formatMoney(item.dailyPrice)} / day</p>
            </div>
            <div className="manage-actions">
              <Link className="icon-button" href={`/items/${item.id}`} aria-label={`View ${item.title}`} title="View item">
                <Eye size={18} aria-hidden="true" />
              </Link>
              <button className="icon-button danger" type="button" onClick={() => deleteItem(item._id)} aria-label={`Delete ${item.title}`} title="Delete item">
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
