import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function TermsPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Terms"
          title="Rental terms."
          lead="Renters and owners are responsible for accurate listings, respectful communication, on-time pickup and return, and item condition checks."
          image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Rental terms documents on a desk"
        />
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
