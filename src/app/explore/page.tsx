import { ItemCard } from "@/components/ItemCard";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getItems } from "@/lib/api";
import { categories } from "@/lib/data";

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
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const { items, pagination, source } = await getItems(query.toString() ? `?${query.toString()}` : "");

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Explore"
          title="Find rental items nearby."
          lead="Search by title, description, or location, then filter by category, condition, and availability."
          image="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Useful items arranged for local rental"
        >
          {source === "fallback" ? <p className="notice">Showing sample listings while the API is unavailable or empty.</p> : null}
        </PageHero>
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
          {items.map((item) => <ItemCard item={item} key={item.id} />)}
        </div>
        <div className="section-head results-summary">
          <p>Showing {items.length} of {pagination.total} items. Page {pagination.page} of {pagination.totalPages}.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
