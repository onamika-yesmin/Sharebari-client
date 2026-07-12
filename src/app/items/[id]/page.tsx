import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemCard } from "@/components/ItemCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getItemById, getItems } from "@/lib/api";
import { categoryName, formatMoney, rentalItems } from "@/lib/data";

export function generateStaticParams() {
  return rentalItems.map((item) => ({ id: item.id }));
}

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getItemById(id);
  if (!item) notFound();

  const relatedResult = await getItems(`?category=${item.category}`);
  const related = relatedResult.items.filter((candidate) => candidate.id !== item.id).slice(0, 4);

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">{categoryName(item.category)}</p>
          <h1>{item.title}</h1>
          <p className="lead">{item.shortDescription}</p>
        </section>
        <section className="details-grid">
          <div>
            <img className="gallery-main" src={item.images[0]} alt={item.title} />
            <div className="thumb-grid">
              {item.images.map((image) => <img src={image} alt={item.title} key={image} />)}
            </div>
          </div>
          <aside className="panel">
            <div className="badge-row">
              <span className="badge">{item.availability}</span>
              <span className="badge badge-warm">{item.condition}</span>
            </div>
            <p className="price">{formatMoney(item.dailyPrice)} / day</p>
            <p>Security deposit: {formatMoney(item.securityDeposit)}</p>
            <p>Minimum rental: {item.minimumRentalDays} day(s)</p>
            <form className="grid" action={`/checkout/${item.id}`}>
              <label>
                Rental days
                <input className="field" name="days" type="number" min={item.minimumRentalDays} defaultValue={item.minimumRentalDays} />
              </label>
              <button className="button" type="submit">Continue to Checkout</button>
            </form>
          </aside>
        </section>
        <section className="section grid grid-2">
          <div className="panel">
            <h2>Full Description</h2>
            <p>{item.fullDescription}</p>
          </div>
          <div className="panel">
            <h2>Specifications</h2>
            <p>Brand: {item.brand}</p>
            <p>Model: {item.model}</p>
            <p>Location: {item.location}</p>
            <p>Rating: {item.rating.toFixed(1)}</p>
          </div>
          <div className="panel">
            <h2>Owner Information</h2>
            <p>{item.owner.name}</p>
            <p>{item.owner.location || item.location}</p>
            <p>Contact details are visible after login.</p>
            <Link className="button-ghost" href="/login">Login to View Contact</Link>
          </div>
          <div className="panel">
            <h2>Rental Information</h2>
            <p>Inspect item condition at pickup, agree on return time, and keep payment records for the rental.</p>
          </div>
        </section>
        <section className="section">
          <div className="section-head">
            <div>
              <h2>Related Items</h2>
              <p>More listings from the same category.</p>
            </div>
          </div>
          <div className="grid grid-4">
            {related.map((candidate) => <ItemCard item={candidate} key={candidate.id} />)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
