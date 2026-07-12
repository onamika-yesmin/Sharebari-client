import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PaymentSuccessPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Payment</p>
          <h1>Payment successful.</h1>
          <p className="lead">Your Stripe test-mode rental payment has been completed.</p>
          <Link className="button" href="/dashboard">Go to Dashboard</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
