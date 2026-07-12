import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryName, formatMoney, rentalItems } from "@/lib/data";

export default function ManageItemsPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Protected</p>
          <h1>Manage your listings.</h1>
        </section>
        <section className="grid">
          {rentalItems.slice(0, 5).map((item) => (
            <div className="panel details-grid" key={item.id}>
              <img className="hero-photo" src={item.images[0]} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{categoryName(item.category)} - {formatMoney(item.dailyPrice)} / day</p>
                <p>Status: {item.availability}</p>
                <div className="action-row">
                  <Link className="button-ghost" href={`/items/${item.id}`}>View</Link>
                  <button className="button-secondary" type="button">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
