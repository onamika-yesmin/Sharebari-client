import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { rentalItems } from "@/lib/data";

export default function DashboardPage() {
  const available = rentalItems.filter((item) => item.availability === "available").length;
  const rented = rentalItems.filter((item) => item.availability === "rented").length;
  const average = Math.round(rentalItems.reduce((sum, item) => sum + item.dailyPrice, 0) / rentalItems.length);

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Protected</p>
          <h1>Dashboard.</h1>
        </section>
        <section className="grid grid-4">
          <div className="panel stat"><strong>{rentalItems.length}</strong><span>Total listed items</span></div>
          <div className="panel stat"><strong>{available}</strong><span>Available items</span></div>
          <div className="panel stat"><strong>{rented}</strong><span>Rented items</span></div>
          <div className="panel stat"><strong>{average}</strong><span>Average daily price</span></div>
        </section>
        <section className="section grid grid-3">
          <div className="card"><h3>Items by category</h3><p>Chart area ready for Recharts integration.</p></div>
          <div className="card"><h3>Items added by month</h3><p>Monthly listing data will come from server aggregation.</p></div>
          <div className="card"><h3>Availability distribution</h3><p>Availability data is prepared from rental item status.</p></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
