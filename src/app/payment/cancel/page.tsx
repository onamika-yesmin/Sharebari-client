import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PaymentCancelPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Payment</p>
          <h1>Payment cancelled.</h1>
          <p className="lead">No rental payment was completed. You can return to the marketplace anytime.</p>
          <Link className="button-ghost" href="/explore">Explore Items</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
