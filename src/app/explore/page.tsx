import { ItemCard } from "@/components/ItemCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { categories, rentalItems } from "@/lib/data";

type ExploreSearch = {
  search?: string;
  category?: string;
  location?: string;
  condition?: string;
  availability?: string;
  sort?: string;
};

export default async function ExplorePage({ searchParams }: { searchParams: Promise<ExploreSearch> }) {
  const params = await searchParams;
  const query = (params.search ?? "").toLowerCase();
  const filtered = rentalItems
    .filter((item) => !query || [item.title, item.shortDescription, item.location].join(" ").toLowerCase().includes(query))
    .filter((item) => !params.category || item.category === params.category)
    .filter((item) => !params.location || item.location.toLowerCase().includes(params.location.toLowerCase()))
    .filter((item) => !params.condition || item.condition === params.condition)
    .filter((item) => !params.availability || item.availability === params.availability)
    .sort((a, b) => {
      if (params.sort === "price-asc") return a.dailyPrice - b.dailyPrice;
      if (params.sort === "price-desc") return b.dailyPrice - a.dailyPrice;
      if (params.sort === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Explore</p>
          <h1>Find rental items nearby.</h1>
          <p className="lead">Search by title, description, or location, then filter by category, condition, and availability.</p>
        </section>
        <form className="filters">
          <input className="field" name="search" defaultValue={params.search} placeholder="Search items" />
          <select className="select" name="category" defaultValue={params.category ?? ""}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input className="field" name="location" defaultValue={params.location} placeholder="Location" />
          <select className="select" name="condition" defaultValue={params.condition ?? ""}>
            <option value="">Any condition</option>
            {["like-new", "excellent", "good", "fair"].map((condition) => <option key={condition}>{condition}</option>)}
          </select>
          <select className="select" name="availability" defaultValue={params.availability ?? ""}>
            <option value="">Any status</option>
            {["available", "rented", "unavailable"].map((status) => <option key={status}>{status}</option>)}
          </select>
          <select className="select" name="sort" defaultValue={params.sort ?? ""}>
            <option value="">Newest</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
            <option value="rating">Highest rating</option>
          </select>
          <button className="button" type="submit">Apply</button>
        </form>
        <div className="grid grid-4">
          {filtered.map((item) => <ItemCard item={item} key={item.id} />)}
        </div>
        <div className="section-head" style={{ marginTop: 24 }}>
          <p>Showing {filtered.length} of {rentalItems.length} items. Pagination is prepared for 12 items per page as listings grow.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
