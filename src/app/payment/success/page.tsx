import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PaymentSuccessPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Payment"
          title="Payment successful."
          lead="Your Stripe test-mode rental payment has been completed."
          image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Secure payment confirmation"
          actions={<Link className="button" href="/dashboard">Go to Dashboard</Link>}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
