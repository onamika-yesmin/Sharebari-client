import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function TermsPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Terms</p>
          <h1>Rental terms.</h1>
          <p className="lead">Renters and owners are responsible for accurate listings, respectful communication, on-time pickup and return, and item condition checks.</p>
        </section>
        <section className="grid grid-3">
          <div className="card"><h3>Listings</h3><p>Owners must describe price, deposit, condition, and availability accurately.</p></div>
          <div className="card"><h3>Rentals</h3><p>Renters must return items in agreed condition and time.</p></div>
          <div className="card"><h3>Payments</h3><p>Payment totals are calculated by the server before Stripe checkout begins.</p></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
