import { notFound } from "next/navigation";
import { CheckoutPanel } from "@/components/CheckoutPanel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getItemById } from "@/lib/api";
import { rentalItems } from "@/lib/data";

export function generateStaticParams() {
  return rentalItems.map((item) => ({ itemId: item.id }));
}

export default async function CheckoutPage({ params, searchParams }: { params: Promise<{ itemId: string }>; searchParams: Promise<{ days?: string }> }) {
  const { itemId } = await params;
  const { days } = await searchParams;
  const item = await getItemById(itemId);
  if (!item) notFound();
  const initialRentalDays = Math.max(Number(days) || item.minimumRentalDays, item.minimumRentalDays);

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
          <CheckoutPanel item={item} initialRentalDays={initialRentalDays} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
