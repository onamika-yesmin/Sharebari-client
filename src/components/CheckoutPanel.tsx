"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { apiPost } from "@/lib/api";
import { showError, showSuccess } from "@/lib/alerts";
import { formatMoney, type RentalItem } from "@/lib/data";

export function CheckoutPanel({ item }: { item: RentalItem }) {
  const [rentalDays, setRentalDays] = useState(item.minimumRentalDays);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const rentalAmount = item.dailyPrice * rentalDays;
  const total = rentalAmount + item.securityDeposit;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const payload = await apiPost<{ data: { checkoutUrl: string | null } }>("/api/payments/create-checkout-session", {
        itemId: item._id || item.id,
        rentalDays,
      });
      if (payload.data.checkoutUrl) {
        await showSuccess("Checkout ready", "You will be redirected to Stripe Checkout.");
        window.location.href = payload.data.checkoutUrl;
        return;
      }
      setMessage("Stripe checkout URL was not returned.");
      await showError("Checkout unavailable", "Stripe checkout URL was not returned.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not start checkout";
      setMessage(errorMessage);
      await showError("Could not start checkout", errorMessage);
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
      {message ? <p className="notice">{message}</p> : null}
      <div className="action-row">
        <button className="button" type="submit" disabled={isLoading}>{isLoading ? "Opening Stripe..." : "Pay with Stripe"}</button>
        <Link className="button-ghost" href={`/items/${item.id}`}>Back to Item</Link>
      </div>
    </form>
  );
}
