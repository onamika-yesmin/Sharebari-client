import { notFound } from "next/navigation";
import { CheckoutPanel } from "@/components/CheckoutPanel";
import { PageHero } from "@/components/PageHero";
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
        <PageHero
          eyebrow="Checkout"
          title="Review rental request."
          lead="Send a rental request first. After the owner accepts it, this page will show the Stripe payment button."
          image={item.images[0]}
          imageAlt={item.title}
        />
        <section className="details-grid">
          <img className="gallery-main" src={item.images[0]} alt={item.title} />
          <CheckoutPanel item={item} initialRentalDays={initialRentalDays} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
