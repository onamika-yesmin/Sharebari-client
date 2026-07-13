import Link from "next/link";
import { Eye, Star } from "lucide-react";
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
          <span className="rating-pill"><Star size={14} aria-hidden="true" /> {item.rating.toFixed(1)}</span>
        </div>
        <div className="price">{formatMoney(item.dailyPrice)} / day</div>
        <Link className="button-ghost" href={`/items/${item.id}`}>
          <Eye size={17} aria-hidden="true" />
          View Details
        </Link>
      </div>
    </article>
  );
}
