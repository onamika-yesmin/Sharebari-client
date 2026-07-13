import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PaymentCancelPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Payment"
          title="Payment cancelled."
          lead="No rental payment was completed. You can return to the marketplace anytime."
          image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Payment receipt and card on a desk"
          actions={<Link className="button-ghost" href="/explore">Explore Items</Link>}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
