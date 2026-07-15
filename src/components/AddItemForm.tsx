"use client";

import { ImagePlus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiPost } from "@/lib/api";
import { showError, showSuccess } from "@/lib/alerts";
import { categories } from "@/lib/data";
import { uploadItemImage } from "@/lib/upload";

const imageUploadSlots = [
  { name: "imageFile1", label: "Main image", required: true },
  { name: "imageFile2", label: "Second image", required: false },
  { name: "imageFile3", label: "Third image", required: false },
];

function textValue(form: FormData, name: string) {
  return String(form.get(name) || "").trim();
}

export function AddItemForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>(() => imageUploadSlots.map(() => ""));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const imageFiles = imageUploadSlots
      .map((slot) => form.get(slot.name))
      .filter((value): value is File => value instanceof File && value.size > 0);

    try {
      if (imageFiles.length === 0) {
        throw new Error("Please upload at least one item image.");
      }

      const images = (await Promise.all(imageFiles.map((file) => uploadItemImage(file))))
        .map((image) => image.trim())
        .filter(Boolean);
      if (images.length === 0) {
        throw new Error("Image upload finished without a usable image URL.");
      }

      const body = {
        title: textValue(form, "title"),
        shortDescription: textValue(form, "shortDescription"),
        fullDescription: textValue(form, "fullDescription"),
        category: textValue(form, "category"),
        dailyPrice: Number(textValue(form, "dailyPrice")),
        securityDeposit: Number(textValue(form, "securityDeposit")),
        location: textValue(form, "location"),
        condition: textValue(form, "condition"),
        availability: textValue(form, "availability"),
        brand: textValue(form, "brand"),
        model: textValue(form, "model"),
        minimumRentalDays: Number(textValue(form, "minimumRentalDays") || 1),
        images,
      };

      await apiPost("/api/items", body);
      await showSuccess("Item saved", "Your rental listing has been added.");
      router.push("/items/manage");
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not save item";
      setMessage(errorMessage);
      await showError("Could not save item", errorMessage);
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
      <div className="item-image-upload-grid full">
        {imageUploadSlots.map((slot, index) => (
          <label className={`item-image-upload ${imagePreviews[index] ? "has-preview" : ""}`} key={slot.name}>
            <input
              name={slot.name}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              required={slot.required}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                setImagePreviews((current) => current.map((preview, previewIndex) => (
                  previewIndex === index ? file ? URL.createObjectURL(file) : "" : preview
                )));
              }}
            />
            <span className="item-image-preview" aria-hidden="true">
              {imagePreviews[index] ? <img src={imagePreviews[index]} alt="" /> : <ImagePlus size={30} />}
            </span>
            <span className="item-image-copy">
              <strong>{slot.label}</strong>
              <small>{slot.required ? "Required" : "Optional"} PNG, JPG or WebP</small>
            </span>
          </label>
        ))}
      </div>
      {message ? <p className="notice full">{message}</p> : null}
      <button className="button" type="submit" disabled={isLoading}>
        <Save size={17} aria-hidden="true" />
        {isLoading ? "Saving..." : "Save Item"}
      </button>
    </form>
  );
}
