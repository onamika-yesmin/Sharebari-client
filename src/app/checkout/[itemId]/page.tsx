import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatMoney, getItem, rentalItems } from "@/lib/data";

export function generateStaticParams() {
  return rentalItems.map((item) => ({ itemId: item.id }));
}

export default async function CheckoutPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const item = getItem(itemId);
  if (!item) notFound();

  const rentalDays = item.minimumRentalDays;
  const rentalAmount = item.dailyPrice * rentalDays;
  const total = rentalAmount + item.securityDeposit;

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Checkout</p>
          <h1>Review rental request.</h1>
          <p className="lead">The backend will recalculate the trusted total before creating a Stripe Checkout Session.</p>
        </section>
        <section className="details-grid">
          <img className="gallery-main" src={item.images[0]} alt={item.title} />
          <div className="panel">
            <h2>{item.title}</h2>
            <p>Rental days: {rentalDays}</p>
            <p>Rental amount: {formatMoney(rentalAmount)}</p>
            <p>Security deposit: {formatMoney(item.securityDeposit)}</p>
            <p className="price">Estimated total: {formatMoney(total)}</p>
            <div className="action-row">
              <Link className="button" href="/payment/success">Pay with Stripe</Link>
              <Link className="button-ghost" href={`/items/${item.id}`}>Back to Item</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
