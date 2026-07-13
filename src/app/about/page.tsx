import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">About</p>
          <h1>Useful things should be easy to share.</h1>
          <p className="lead">ShareBari is built for neighborhoods where people need practical items for short periods and owners want those items to earn value between uses.</p>
        </section>
        <section className="grid grid-3">
          <div className="card"><h3>Local first</h3><p>Search and filter around the places where renters can realistically pick up items.</p></div>
          <div className="card"><h3>Waste less</h3><p>Reduce duplicate purchases by keeping rarely used items in circulation.</p></div>
          <div className="card"><h3>Rental ready</h3><p>The app supports authentication, item management, dashboard stats, profile images, contact messages, and Stripe checkout.</p></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
