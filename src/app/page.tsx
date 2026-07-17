import Link from "next/link";
import { Compass, Gauge, Grid3X3, LayoutDashboard, PlusCircle, Search, Sparkles } from "lucide-react";
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
                <button className="button" type="submit">
                  <Search size={17} aria-hidden="true" />
                  Search
                </button>
              </form>
              <div className="home-quick-links" aria-label="Popular locations">
                {locations.map((location) => (
                  <Link href={`/explore?location=${encodeURIComponent(location)}`} key={location}>{location}</Link>
                ))}
              </div>
              <div className="home-hero-stats" aria-label="Marketplace highlights">
                <span><strong>{availableCount || "12+"}</strong> available now</span>
                <span><strong>{locations.length || "5+"}</strong> pickup areas</span>
                <span><strong>Stripe</strong> checkout ready</span>
              </div>
            </div>
            {showcaseItem ? (
              <Link className="home-showcase" href={`/items/${showcaseItem.id}`} aria-label={`View ${showcaseItem.title}`}>
                <img src={showcaseItem.images[0]} alt={showcaseItem.title} />
                <div className="home-showcase-info">
                  <span className="home-showcase-kicker">Featured nearby</span>
                  <span className="badge">{categoryName(showcaseItem.category)}</span>
                  <h2>{showcaseItem.title}</h2>
                  <p>{showcaseItem.location} · {showcaseItem.condition}</p>
                  <strong>{formatMoney(showcaseItem.dailyPrice)} / day</strong>
                </div>
              </Link>
            ) : null}
          </div>
        </section>

        <section className="home-category-rail scroll-reveal">
          <div className="container">
            <div className="home-rail-head">
              <h2>Browse by need</h2>
              <Link className="button-ghost" href="/categories">
                <Grid3X3 size={17} aria-hidden="true" />
                All categories
              </Link>
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

        <section className="section scroll-reveal">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Featured rentals</h2>
                <p>Well-rated listings with clear prices, deposits, and pickup locations.</p>
              </div>
              <div className="action-row">
                <Link className="button-ghost" href="/explore?sort=rating">
                  <Sparkles size={17} aria-hidden="true" />
                  Highest rated
                </Link>
                <Link className="button" href="/explore">
                  <Compass size={17} aria-hidden="true" />
                  Explore all
                </Link>
              </div>
            </div>
            <div className="grid grid-4">
              {featured.map((item) => <ItemCard item={item} key={item.id} />)}
            </div>
          </div>
        </section>

        <section className="home-owner-band scroll-reveal">
          <div className="container home-owner-grid">
            <div>
              <p className="eyebrow">For owners</p>
              <h2>Turn idle items into useful local listings.</h2>
              <p>Publish items, manage availability, and keep your neighborhood stocked with practical rentals.</p>
            </div>
            <div className="home-owner-actions">
              <Link className="button" href="/items/add">
                <PlusCircle size={17} aria-hidden="true" />
                List an item
              </Link>
              <Link className="button-ghost" href="/dashboard">
                <LayoutDashboard size={17} aria-hidden="true" />
                Open dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="section scroll-reveal">
          <div className="container grid grid-2">
            <div>
              <h2>Why rent instead of buy?</h2>
              <p className="lead">Lower your cost, reduce storage clutter, and keep useful items circulating in the community.</p>
            </div>
            <div className="grid grid-2 rent-stats">
              <div className="panel stat rent-stat-card"><strong className="count-up" data-count="72" data-suffix="%">72%</strong><span>estimated savings on one-time needs</span></div>
              <div className="panel stat rent-stat-card"><strong className="count-up" data-count={availableCount}>{availableCount}</strong><span>available listings shown</span></div>
              <div className="panel stat rent-stat-card"><strong className="count-up" data-count="6">6</strong><span>major rental categories</span></div>
              <div className="panel stat rent-stat-card"><strong className="count-up" data-count="4.6" data-decimals="1">4.6</strong><span>average item rating</span></div>
            </div>
          </div>
        </section>

        <section className="section-soft scroll-reveal">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Recently added</h2>
                <p>Fresh listings from owners who want their useful items to work harder.</p>
              </div>
              <Link className="button-ghost" href="/explore?sort=newest">
                <Gauge size={17} aria-hidden="true" />
                Newest first
              </Link>
            </div>
            <div className="grid grid-4">
              {recent.map((item) => <ItemCard item={item} key={item.id} />)}
            </div>
          </div>
        </section>

        <section className="section scroll-reveal">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Rent with confidence</h2>
                <p>Simple marketplace checks keep each rental clear before checkout.</p>
              </div>
            </div>
            <div className="grid grid-3">
              <div className="card"><h3>Renter friendly</h3><p>Clear daily prices, deposits, condition labels, and owner details after login.</p></div>
              <div className="card"><h3>Owner controlled</h3><p>Owners can list items, manage availability, and remove their own listings anytime.</p></div>
              <div className="card"><h3>Payment connected</h3><p>Checkout totals are calculated on the server before opening Stripe payment.</p></div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
