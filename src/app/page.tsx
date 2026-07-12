import Link from "next/link";
import { ItemCard } from "@/components/ItemCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { categories, rentalItems } from "@/lib/data";

export default function Home() {
  const featured = rentalItems.filter((item) => item.featured).slice(0, 4);
  const recent = rentalItems.slice(-4).reverse();

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">Borrow Nearby. Save More. Waste Less.</p>
              <h1>Rent everyday items from people around you.</h1>
              <p className="lead">
                ShareBari helps neighbors find tools, cameras, party supplies, study kits, and home appliances without buying things they only need once.
              </p>
              <div className="hero-actions">
                <Link className="button" href="/explore">Explore Items</Link>
                <Link className="button-secondary" href="/items/add">Add Your Item</Link>
              </div>
            </div>
            <form className="search-panel" action="/explore">
              <h3>Find something nearby</h3>
              <div className="field-grid">
                <input className="field" name="search" placeholder="Search camera, drill, tent" />
                <input className="field" name="location" placeholder="Location" />
                <button className="button" type="submit">Search</button>
              </div>
              <img
                className="hero-photo"
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1100&q=80"
                alt="Shared home tools ready for rental"
              />
            </form>
          </div>
        </section>

        <section className="section-soft">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Popular Categories</h2>
                <p>Start with the item type you need and compare nearby options.</p>
              </div>
              <Link className="button-ghost" href="/categories">View All</Link>
            </div>
            <div className="grid grid-3">
              {categories.map((category) => (
                <Link className="card" href={`/explore?category=${category.id}`} key={category.id}>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Featured Rental Items</h2>
                <p>Well-rated listings ready for rentals across Bangladesh.</p>
              </div>
              <Link className="button-ghost" href="/explore?sort=rating">Highest Rated</Link>
            </div>
            <div className="grid grid-4">
              {featured.map((item) => <ItemCard item={item} key={item.id} />)}
            </div>
          </div>
        </section>

        <section className="section-soft">
          <div className="container grid grid-3">
            {["Search nearby listings", "Confirm rental details", "Pick up and return"].map((step, index) => (
              <div className="card" key={step}>
                <span className="badge">Step {index + 1}</span>
                <h3>{step}</h3>
                <p>Simple rental flow designed for short-term needs, clear pricing, and trusted local owners.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="container grid grid-2">
            <div>
              <h2>Why rent instead of buy?</h2>
              <p className="lead">Lower your cost, reduce storage clutter, and keep useful items circulating in the community.</p>
            </div>
            <div className="grid grid-2">
              <div className="panel stat"><strong>72%</strong><span>estimated savings on one-time needs</span></div>
              <div className="panel stat"><strong>8</strong><span>active starter listings</span></div>
              <div className="panel stat"><strong>6</strong><span>major rental categories</span></div>
              <div className="panel stat"><strong>4.6</strong><span>average item rating</span></div>
            </div>
          </div>
        </section>

        <section className="section-soft">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Recently Added Items</h2>
                <p>Fresh listings from owners who want their useful items to work harder.</p>
              </div>
            </div>
            <div className="grid grid-4">
              {recent.map((item) => <ItemCard item={item} key={item.id} />)}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container grid grid-3">
            <div className="card"><h3>Renter friendly</h3><p>Clear daily prices, deposits, condition labels, and owner details after login.</p></div>
            <div className="card"><h3>Owner controlled</h3><p>Owners can list items, manage availability, and delete their own listings.</p></div>
            <div className="card"><h3>Payment ready</h3><p>Stripe checkout is planned with server-side total calculation for safer rentals.</p></div>
          </div>
        </section>

        <section className="section-soft">
          <div className="container section-head">
            <div>
              <h2>Questions before renting?</h2>
              <p>Read the help page or start exploring nearby items now.</p>
            </div>
            <div className="action-row">
              <Link className="button-ghost" href="/help">Help Center</Link>
              <Link className="button" href="/explore">Browse Items</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
