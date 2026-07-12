"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiPost } from "@/lib/api";
import { categories } from "@/lib/data";

export function AddItemForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const images = [form.get("image1"), form.get("image2"), form.get("image3")]
      .map((value) => String(value || "").trim())
      .filter(Boolean);

    const body = {
      title: form.get("title"),
      shortDescription: form.get("shortDescription"),
      fullDescription: form.get("fullDescription"),
      category: form.get("category"),
      dailyPrice: form.get("dailyPrice"),
      securityDeposit: form.get("securityDeposit"),
      location: form.get("location"),
      condition: form.get("condition"),
      availability: form.get("availability"),
      brand: form.get("brand"),
      model: form.get("model"),
      minimumRentalDays: form.get("minimumRentalDays"),
      images,
    };

    try {
      await apiPost("/api/items", body);
      router.push("/items/manage");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save item");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <input className="field" name="title" placeholder="Title" required minLength={3} />
      <input className="field" name="shortDescription" placeholder="Short description" required minLength={10} />
      <textarea className="textarea full" name="fullDescription" placeholder="Full description" required minLength={20} />
      <select className="select" name="category" required>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <input className="field" name="dailyPrice" type="number" placeholder="Daily rental price" required min={1} />
      <input className="field" name="securityDeposit" type="number" placeholder="Security deposit" required min={0} />
      <input className="field" name="location" placeholder="Location" required />
      <select className="select" name="condition" required><option value="excellent">excellent</option><option value="like-new">like-new</option><option value="good">good</option><option value="fair">fair</option></select>
      <select className="select" name="availability" required><option value="available">available</option><option value="rented">rented</option><option value="unavailable">unavailable</option></select>
      <input className="field" name="brand" placeholder="Brand" />
      <input className="field" name="model" placeholder="Model" />
      <input className="field" name="minimumRentalDays" type="number" placeholder="Minimum rental days" defaultValue={1} min={1} />
      <input className="field full" name="image1" placeholder="Image URL 1" required type="url" />
      <input className="field full" name="image2" placeholder="Image URL 2" type="url" />
      <input className="field full" name="image3" placeholder="Image URL 3" type="url" />
      {message ? <p className="notice full">{message}</p> : null}
      <button className="button" type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Item"}</button>
    </form>
  );
}
