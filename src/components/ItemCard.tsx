import Link from "next/link";
import { categoryName, formatMoney, type RentalItem } from "@/lib/data";

export function ItemCard({ item }: { item: RentalItem }) {
  return (
    <article className="item-card">
      <img src={item.images[0]} alt={item.title} />
      <div className="item-body">
        <div className="badge-row">
          <span className="badge">{categoryName(item.category)}</span>
          <span className="badge badge-warm">{item.availability}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.shortDescription}</p>
        <div className="meta-row">
          <span>{item.location}</span>
          <span>{item.condition}</span>
          <span>{item.rating.toFixed(1)} rating</span>
        </div>
        <div className="price">{formatMoney(item.dailyPrice)} / day</div>
        <Link className="button-ghost" href={`/items/${item.id}`}>View Details</Link>
      </div>
    </article>
  );
}
