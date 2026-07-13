import Link from "next/link";
import { ItemCard } from "@/components/ItemCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getFeaturedItems, getRecentItems } from "@/lib/api";
import { categories, categoryName, formatMoney } from "@/lib/data";

export default async function Home() {
  const [featured, recent] = await Promise.all([getFeaturedItems(), getRecentItems()]);
  const showcaseItem = featured[0] || recent[0];
  const availableCount = [...featured, ...recent].filter((item) => item.availability === "available").length;
  const locations = Array.from(new Set([...featured, ...recent].map((item) => item.location))).slice(0, 5);

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="home-main">
        <section className="home-hero">
          {showcaseItem ? (
            <div className="home-hero-bg" aria-hidden="true">
              <img src={showcaseItem.images[0]} alt="" />
            </div>
          ) : null}
          <div className="container home-hero-grid">
            <div className="home-hero-copy">
              <p className="eyebrow">Bangladesh neighborhood rentals</p>
              <h1>Find the item you need without buying it.</h1>
              <p className="lead">
                Search nearby tools, cameras, event gear, kitchen appliances, outdoor items, and study kits from local owners.
              </p>
              <form className="home-search" action="/explore">
                <input className="field" name="search" placeholder="Search drill, camera, projector" />
                <select className="select" name="category" defaultValue="">
                  <option value="">All categories</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <input className="field" name="location" placeholder="City or area" />
                <button className="button" type="submit">Search</button>
              </form>
              <div className="home-quick-links" aria-label="Popular locations">
                {locations.map((location) => (
                  <Link href={`/explore?location=${encodeURIComponent(location)}`} key={location}>{location}</Link>
                ))}
              </div>
            </div>
            {showcaseItem ? (
              <Link className="home-showcase" href={`/items/${showcaseItem.id}`} aria-label={`View ${showcaseItem.title}`}>
                <img src={showcaseItem.images[0]} alt={showcaseItem.title} />
                <div className="home-showcase-info">
                  <span className="badge">{categoryName(showcaseItem.category)}</span>
                  <h2>{showcaseItem.title}</h2>
                  <p>{showcaseItem.location} · {showcaseItem.condition}</p>
                  <strong>{formatMoney(showcaseItem.dailyPrice)} / day</strong>
                </div>
              </Link>
            ) : null}
          </div>
        </section>

        <section className="home-category-rail">
          <div className="container">
            <div className="home-rail-head">
              <h2>Browse by need</h2>
              <Link className="button-ghost" href="/categories">All categories</Link>
            </div>
            <div className="home-category-grid">
              {categories.map((category) => (
                <Link className="category-card" href={`/explore?category=${category.id}`} key={category.id}>
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
                <h2>Featured rentals</h2>
                <p>Well-rated listings with clear prices, deposits, and pickup locations.</p>
              </div>
              <div className="action-row">
                <Link className="button-ghost" href="/explore?sort=rating">Highest rated</Link>
                <Link className="button" href="/explore">Explore all</Link>
              </div>
            </div>
            <div className="grid grid-4">
              {featured.map((item) => <ItemCard item={item} key={item.id} />)}
            </div>
          </div>
        </section>

        <section className="home-owner-band">
          <div className="container home-owner-grid">
            <div>
              <p className="eyebrow">For owners</p>
              <h2>Turn idle items into useful local listings.</h2>
              <p>Publish items, manage availability, and keep your neighborhood stocked with practical rentals.</p>
            </div>
            <div className="home-owner-actions">
              <Link className="button" href="/items/add">List an item</Link>
              <Link className="button-ghost" href="/dashboard">Open dashboard</Link>
            </div>
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
              <div className="panel stat"><strong>{availableCount}</strong><span>available listings shown</span></div>
              <div className="panel stat"><strong>6</strong><span>major rental categories</span></div>
              <div className="panel stat"><strong>4.6</strong><span>average item rating</span></div>
            </div>
          </div>
        </section>

        <section className="section-soft">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Recently added</h2>
                <p>Fresh listings from owners who want their useful items to work harder.</p>
              </div>
              <Link className="button-ghost" href="/explore?sort=newest">Newest first</Link>
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
            <div className="card"><h3>Payment connected</h3><p>Checkout totals are calculated on the server before opening Stripe payment.</p></div>
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
