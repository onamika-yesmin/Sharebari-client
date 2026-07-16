"use client";

import { ArrowLeft, CalendarClock, Check, CreditCard, RefreshCw, Send, X, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { createCheckoutSession, createRentalRequest, getMyRentalRequests, type RentalRequest, type RentalRequestStatus } from "@/lib/api";
import { showError, showSuccess } from "@/lib/alerts";
import { formatMoney, type RentalItem } from "@/lib/data";

const requestStatusCopy: Record<RentalRequestStatus, { label: string; title: string; detail: string }> = {
  pending: {
    label: "Pending",
    title: "Waiting for owner approval",
    detail: "You can leave this page now. The request is saved, and you can check it anytime from your renter dashboard.",
  },
  accepted: {
    label: "Accepted",
    title: "Owner accepted your request",
    detail: "Stripe payment is unlocked. Pay securely to confirm this rental.",
  },
  rejected: {
    label: "Rejected",
    title: "Owner rejected this request",
    detail: "You can adjust the details or message and send a new request for this item.",
  },
  cancelled: {
    label: "Cancelled",
    title: "This request was cancelled",
    detail: "Send a fresh request if you still want to rent this item.",
  },
  paid: {
    label: "Paid",
    title: "Payment completed",
    detail: "This rental request is already paid and saved in your dashboard.",
  },
};

const requestStatusIcons = {
  pending: CalendarClock,
  accepted: Check,
  rejected: X,
  cancelled: X,
  paid: CreditCard,
} satisfies Record<RentalRequestStatus, LucideIcon>;

function formatRequestDate(value?: string) {
  if (!value) return "Just now";

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function CheckoutPanel({ item, initialRentalDays }: { item: RentalItem; initialRentalDays?: number }) {
  const safeInitialRentalDays = Math.max(initialRentalDays || item.minimumRentalDays, item.minimumRentalDays);
  const [rentalDays, setRentalDays] = useState(safeInitialRentalDays);
  const [renterMessage, setRenterMessage] = useState("");
  const [currentRequest, setCurrentRequest] = useState<RentalRequest | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const rentalAmount = item.dailyPrice * rentalDays;
  const total = rentalAmount + item.securityDeposit;
  const itemKeys = useMemo(() => new Set([item._id, item.id, item.slug].filter(Boolean).map(String)), [item._id, item.id, item.slug]);

  const loadRequestStatus = useCallback(async (silent = false) => {
    if (!silent) setIsCheckingStatus(true);

    try {
      const requests = await getMyRentalRequests();
      const match = requests.find((request) => {
        const requestItem = request.item || {};
        return [requestItem._id, requestItem.slug].filter(Boolean).some((value) => itemKeys.has(String(value)));
      });
      setCurrentRequest(match || null);
      if (match?.status === "accepted") {
        setMessage("Owner accepted your request. Continue to Stripe Checkout to pay securely.");
      } else if (match?.status === "pending") {
        setMessage("Request already sent. Waiting for owner approval.");
      } else if (match?.status === "rejected") {
        setMessage("Owner rejected this request. You can send a new request if details change.");
      } else if (match?.status === "paid") {
        setMessage("This rental request is already paid.");
      }
    } catch {
      setCurrentRequest(null);
    } finally {
      if (!silent) setIsCheckingStatus(false);
    }
  }, [itemKeys]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRequestStatus(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadRequestStatus]);

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
      await loadRequestStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not send request";
      setMessage(errorMessage);
      await showError("Could not send request", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePay() {
    if (!currentRequest) return;
    setIsPaying(true);
    setMessage("");

    try {
      const payload = await createCheckoutSession({ requestId: currentRequest._id });
      if (!payload.checkoutUrl) throw new Error("Stripe checkout URL was not returned");
      await showSuccess("Checkout ready", "You will be redirected to Stripe Checkout.");
      window.location.assign(payload.checkoutUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not open checkout";
      setMessage(errorMessage);
      await showError("Could not open checkout", errorMessage);
    } finally {
      setIsPaying(false);
    }
  }

  const statusContent = currentRequest ? requestStatusCopy[currentRequest.status] : null;
  const StatusIcon = currentRequest ? requestStatusIcons[currentRequest.status] : CalendarClock;

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
      <p className="payment-note">Payment is collected on Stripe Checkout after the owner accepts your rental request.</p>
      <div className={`request-status-card request-status-${currentRequest?.status || "empty"}`}>
        <div className="request-status-head">
          <span className="request-status-icon" aria-hidden="true">
            <StatusIcon size={18} />
          </span>
          <div>
            <span className="request-status-kicker">Request status</span>
            <strong>{statusContent?.title || "No request sent yet"}</strong>
          </div>
          <span className="badge status-badge">{statusContent?.label || "Not sent"}</span>
        </div>
        <p>{statusContent?.detail || "After you send a request, its pending, accepted, rejected, or paid status will stay saved in your renter dashboard."}</p>
        {currentRequest ? (
          <div className="request-status-meta">
            <span>{currentRequest.rentalDays} day(s)</span>
            <span>{formatMoney(currentRequest.totalAmount)}</span>
            <span>Sent {formatRequestDate(currentRequest.createdAt)}</span>
          </div>
        ) : null}
        {currentRequest?.ownerNote ? <p className="request-owner-note">Owner note: {currentRequest.ownerNote}</p> : null}
        <div className="request-status-actions">
          <Link className="button-ghost" href="/dashboard?tab=renter">
            <CalendarClock size={17} aria-hidden="true" />
            Track in Dashboard
          </Link>
          {currentRequest ? (
            <button className="button-ghost" type="button" disabled={isCheckingStatus} onClick={() => void loadRequestStatus()}>
              <RefreshCw size={17} aria-hidden="true" />
              {isCheckingStatus ? "Checking..." : "Refresh status"}
            </button>
          ) : null}
        </div>
      </div>
      <label>
        Message to owner
        <textarea className="textarea" value={renterMessage} onChange={(event) => setRenterMessage(event.target.value)} placeholder="Pickup time, purpose, or questions" />
      </label>
      {message ? <p className="notice">{message}</p> : null}
      <div className="action-row">
        {currentRequest?.status === "accepted" ? (
          <button className="button" type="button" disabled={isPaying} onClick={handlePay}>
            <CreditCard size={17} aria-hidden="true" />
            {isPaying ? "Opening Stripe..." : "Pay on Stripe"}
          </button>
        ) : (
          <button className="button" type="submit" disabled={isLoading || currentRequest?.status === "pending" || currentRequest?.status === "paid"}>
            <Send size={17} aria-hidden="true" />
            {isLoading ? "Sending..." : currentRequest?.status === "pending" ? "Waiting for Owner" : currentRequest?.status === "paid" ? "Already Paid" : "Send Rental Request"}
          </button>
        )}
        <Link className="button-ghost" href={`/items/${item.id}`}>
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Item
        </Link>
      </div>
    </form>
  );
}
