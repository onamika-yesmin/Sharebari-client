"use client";

import { Check, Eye, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { apiDelete, getMyItems, getOwnerRentalRequests, updateRentalRequestStatus, type RentalRequest } from "@/lib/api";
import { confirmAction, showError, showSuccess } from "@/lib/alerts";
import { categoryName, formatMoney, type RentalItem } from "@/lib/data";

export function ManageItemsClient() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [message, setMessage] = useState("Loading your listings...");

  async function loadItems() {
    try {
      const [data, ownerRequests] = await Promise.all([getMyItems(), getOwnerRentalRequests()]);
      setItems(data);
      setRequests(ownerRequests);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load listings");
    }
  }

  async function updateRequest(id: string, status: "accepted" | "rejected") {
    try {
      await updateRentalRequestStatus(id, { status });
      await showSuccess(status === "accepted" ? "Request accepted" : "Request rejected", status === "accepted" ? "The renter can now pay from their dashboard." : "The renter will see the rejected status.");
      await loadItems();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not update request";
      setMessage(errorMessage);
      await showError("Could not update request", errorMessage);
    }
  }

  async function deleteItem(id?: string) {
    if (!id) return;
    const confirmed = await confirmAction("Delete listing?", "This item will be removed from your owner workspace.", "Delete");
    if (!confirmed) return;

    try {
      await apiDelete(`/api/items/${id}`);
      await showSuccess("Listing deleted", "The item has been removed.");
      await loadItems();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not delete item";
      setMessage(errorMessage);
      await showError("Could not delete item", errorMessage);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadItems();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (message && items.length === 0) {
    if (message.toLowerCase().includes("loading")) {
      return <LoadingState label={message} />;
    }

    return (
      <div className="panel empty-state">
        <p>{message}</p>
        <Link className="button" href="/items/add">
          <Plus size={17} aria-hidden="true" />
          Add first item
        </Link>
      </div>
    );
  }

  return (
    <section className="manage-list">
      {message ? <p className="notice">{message}</p> : null}
      <div className="panel owner-requests-panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Rental requests</p>
            <h3>Incoming renter requests</h3>
          </div>
          <span className="badge">{requests.length} requests</span>
        </div>
        {requests.length === 0 ? (
          <p>No renter requests yet.</p>
        ) : (
          <div className="request-list">
            {requests.map((request) => (
              <div className="request-row" key={request._id}>
                <div>
                  <strong>{request.item?.title || "Rental item"}</strong>
                  <p>{request.renter?.name || "Renter"} · {request.rentalDays} day(s) · {formatMoney(request.totalAmount)}</p>
                  {request.renterMessage ? <small>{request.renterMessage}</small> : null}
                </div>
                <span className="badge">{request.status}</span>
                {request.status === "pending" ? (
                  <div className="manage-actions">
                    <button className="icon-button" type="button" onClick={() => updateRequest(request._id, "accepted")} aria-label="Accept request" title="Accept request">
                      <Check size={18} aria-hidden="true" />
                    </button>
                    <button className="icon-button danger" type="button" onClick={() => updateRequest(request._id, "rejected")} aria-label="Reject request" title="Reject request">
                      <X size={18} aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
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
