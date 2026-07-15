"use client";

import { Check, Eye, ImagePlus, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { LoadingState } from "@/components/LoadingState";
import { apiDelete, getMyItems, getOwnerRentalRequests, updateRentalItem, updateRentalRequestStatus, type RentalRequest } from "@/lib/api";
import { confirmAction, showError, showSuccess } from "@/lib/alerts";
import { categories, categoryName, formatMoney, type RentalItem } from "@/lib/data";
import { uploadItemImage } from "@/lib/upload";

const imageUploadSlots = [
  { name: "imageFile1", label: "Main image" },
  { name: "imageFile2", label: "Second image" },
  { name: "imageFile3", label: "Third image" },
];

function optionalValue(value: string) {
  return value === "Not specified" ? "" : value;
}

export function ManageItemsClient() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [message, setMessage] = useState("Loading your listings...");
  const [editingItem, setEditingItem] = useState<RentalItem | null>(null);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>(() => imageUploadSlots.map(() => ""));
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  async function loadItems() {
    try {
      const [data, ownerRequests] = await Promise.all([
        getMyItems(),
        getOwnerRentalRequests().catch(() => [] as RentalRequest[]),
      ]);
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

  function startEditing(item: RentalItem) {
    setEditingItem(item);
    setEditImagePreviews(imageUploadSlots.map((_, index) => item.images[index] || ""));
    setMessage("");
  }

  function cancelEditing() {
    setEditingItem(null);
    setEditImagePreviews(imageUploadSlots.map(() => ""));
  }

  async function saveEditedItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingItem) return;

    setIsSavingEdit(true);
    setMessage("");

    try {
      if (!editingItem._id) {
        throw new Error("Could not find this listing ID. Please refresh and try again.");
      }

      const form = new FormData(event.currentTarget);
      const images = await Promise.all(
        imageUploadSlots.map(async (slot, index) => {
          const value = form.get(slot.name);
          if (value instanceof File && value.size > 0) {
            return uploadItemImage(value);
          }

          return editImagePreviews[index] || "";
        }),
      );
      const cleanImages = images.map((image) => image.trim()).filter(Boolean);
      if (cleanImages.length === 0) {
        throw new Error("Please keep or upload at least one item image.");
      }

      await updateRentalItem(editingItem._id, {
        title: String(form.get("title") || "").trim(),
        shortDescription: String(form.get("shortDescription") || "").trim(),
        fullDescription: String(form.get("fullDescription") || "").trim(),
        category: form.get("category") as RentalItem["category"],
        dailyPrice: Number(form.get("dailyPrice") || 0),
        securityDeposit: Number(form.get("securityDeposit") || 0),
        location: String(form.get("location") || "").trim(),
        condition: form.get("condition") as RentalItem["condition"],
        availability: form.get("availability") as RentalItem["availability"],
        brand: String(form.get("brand") || "").trim(),
        model: String(form.get("model") || "").trim(),
        minimumRentalDays: Number(form.get("minimumRentalDays") || 1),
        images: cleanImages,
      });

      await showSuccess("Listing updated", "Your item data has been saved.");
      cancelEditing();
      await loadItems();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not update listing";
      setMessage(errorMessage);
      await showError("Could not update listing", errorMessage);
    } finally {
      setIsSavingEdit(false);
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
                  <p>{request.renter?.name || "Renter"} - {request.rentalDays} day(s) - {formatMoney(request.totalAmount)}</p>
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

      {editingItem ? (
        <form className="panel form-grid" key={editingItem._id || editingItem.id} onSubmit={saveEditedItem}>
          <div className="panel-title-row full">
            <div>
              <p className="eyebrow">Edit listing</p>
              <h3>{editingItem.title}</h3>
            </div>
            <button className="button-ghost" type="button" onClick={cancelEditing} disabled={isSavingEdit}>
              <X size={17} aria-hidden="true" />
              Cancel
            </button>
          </div>
          <input className="field" name="title" placeholder="Title" defaultValue={editingItem.title} required minLength={3} />
          <input className="field" name="shortDescription" placeholder="Short description" defaultValue={editingItem.shortDescription} required minLength={10} />
          <textarea className="textarea full" name="fullDescription" placeholder="Full description" defaultValue={editingItem.fullDescription} required minLength={20} />
          <select className="select" name="category" defaultValue={editingItem.category} required>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input className="field" name="dailyPrice" type="number" placeholder="Daily rental price" defaultValue={editingItem.dailyPrice} required min={1} />
          <input className="field" name="securityDeposit" type="number" placeholder="Security deposit" defaultValue={editingItem.securityDeposit} required min={0} />
          <input className="field" name="location" placeholder="Location" defaultValue={editingItem.location} required />
          <select className="select" name="condition" defaultValue={editingItem.condition} required>
            <option value="excellent">excellent</option>
            <option value="like-new">like-new</option>
            <option value="good">good</option>
            <option value="fair">fair</option>
          </select>
          <select className="select" name="availability" defaultValue={editingItem.availability} required>
            <option value="available">available</option>
            <option value="rented">rented</option>
            <option value="unavailable">unavailable</option>
          </select>
          <input className="field" name="brand" placeholder="Brand" defaultValue={optionalValue(editingItem.brand)} />
          <input className="field" name="model" placeholder="Model" defaultValue={optionalValue(editingItem.model)} />
          <input className="field" name="minimumRentalDays" type="number" placeholder="Minimum rental days" defaultValue={editingItem.minimumRentalDays} min={1} />
          <div className="item-image-upload-grid full">
            {imageUploadSlots.map((slot, index) => (
              <label className={`item-image-upload ${editImagePreviews[index] ? "has-preview" : ""}`} key={slot.name}>
                <input
                  name={slot.name}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    setEditImagePreviews((current) => current.map((preview, previewIndex) => (
                      previewIndex === index ? file ? URL.createObjectURL(file) : editingItem.images[index] || "" : preview
                    )));
                  }}
                />
                <span className="item-image-preview" aria-hidden="true">
                  {editImagePreviews[index] ? <img src={editImagePreviews[index]} alt="" /> : <ImagePlus size={30} />}
                </span>
                <span className="item-image-copy">
                  <strong>{slot.label}</strong>
                  <small>Keep current or upload new PNG, JPG or WebP</small>
                </span>
              </label>
            ))}
          </div>
          <button className="button" type="submit" disabled={isSavingEdit}>
            <Save size={17} aria-hidden="true" />
            {isSavingEdit ? "Updating..." : "Update listing"}
          </button>
        </form>
      ) : null}

      <div className="panel-title-row">
        <div>
          <p className="eyebrow">My listings</p>
          <h3>Items connected to your account</h3>
        </div>
        <Link className="button" href="/items/add">
          <Plus size={17} aria-hidden="true" />
          Add item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="panel empty-state">
          <p>No listings found for this account yet.</p>
          <Link className="button" href="/items/add">
            <Plus size={17} aria-hidden="true" />
            Add first item
          </Link>
        </div>
      ) : items.map((item) => (
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
              <button className="icon-button" type="button" onClick={() => startEditing(item)} aria-label={`Edit ${item.title}`} title="Edit item">
                <Pencil size={18} aria-hidden="true" />
              </button>
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
