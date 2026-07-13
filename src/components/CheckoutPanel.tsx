"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createRentalRequest } from "@/lib/api";
import { showError, showSuccess } from "@/lib/alerts";
import { formatMoney, type RentalItem } from "@/lib/data";

export function CheckoutPanel({ item, initialRentalDays }: { item: RentalItem; initialRentalDays?: number }) {
  const safeInitialRentalDays = Math.max(initialRentalDays || item.minimumRentalDays, item.minimumRentalDays);
  const [rentalDays, setRentalDays] = useState(safeInitialRentalDays);
  const [renterMessage, setRenterMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const rentalAmount = item.dailyPrice * rentalDays;
  const total = rentalAmount + item.securityDeposit;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      await createRentalRequest({
        itemId: item._id || item.id,
        rentalDays,
        renterMessage,
      });
      setMessage("Request sent. The owner can accept or reject it from their dashboard.");
      await showSuccess("Request sent", "The owner will review your rental request. You can pay after they accept it.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not send request";
      setMessage(errorMessage);
      await showError("Could not send request", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="panel checkout-card" onSubmit={handleSubmit}>
      <h2>{item.title}</h2>
      <label>
        Rental days
        <input className="field" type="number" min={item.minimumRentalDays} value={rentalDays} onChange={(event) => setRentalDays(Number(event.target.value))} />
      </label>
      <p>Rental amount: {formatMoney(rentalAmount)}</p>
      <p>Security deposit: {formatMoney(item.securityDeposit)}</p>
      <p className="price">Estimated total: {formatMoney(total)}</p>
      <label>
        Message to owner
        <textarea className="textarea" value={renterMessage} onChange={(event) => setRenterMessage(event.target.value)} placeholder="Pickup time, purpose, or questions" />
      </label>
      {message ? <p className="notice">{message}</p> : null}
      <div className="action-row">
        <button className="button" type="submit" disabled={isLoading}>{isLoading ? "Sending..." : "Send Rental Request"}</button>
        <Link className="button-ghost" href={`/items/${item.id}`}>Back to Item</Link>
      </div>
    </form>
  );
}
