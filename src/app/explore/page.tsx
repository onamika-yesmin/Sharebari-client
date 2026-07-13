import Link from "next/link";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
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
  page?: string;
};

export default async function ExplorePage({ searchParams }: { searchParams: Promise<ExploreSearch> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const { items, pagination, source } = await getItems(query.toString() ? `?${query.toString()}` : "");
  const currentPage = Number(pagination.page) || 1;
  const totalPages = Math.max(Number(pagination.totalPages) || 1, 1);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  function pageHref(page: number) {
    const nextQuery = new URLSearchParams(query.toString());
    if (page <= 1) {
      nextQuery.delete("page");
    } else {
      nextQuery.set("page", String(page));
    }
    const queryString = nextQuery.toString();
    return queryString ? `/explore?${queryString}` : "/explore";
  }

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
          <button className="button" type="submit">
            <SlidersHorizontal size={17} aria-hidden="true" />
            Apply
          </button>
        </form>
        <div className="grid grid-4">
          {items.map((item) => <ItemCard item={item} key={item.id} />)}
        </div>
        <div className="section-head results-summary">
          <p>Showing {items.length} of {pagination.total} items. Page {pagination.page} of {pagination.totalPages}.</p>
          {totalPages > 1 ? (
            <nav className="pagination" aria-label="Explore pagination">
              {currentPage > 1 ? (
                <Link className="pagination-button" href={pageHref(currentPage - 1)} aria-label="Previous page">
                  <ChevronLeft size={17} aria-hidden="true" />
                  Previous
                </Link>
              ) : (
                <span className="pagination-button disabled" aria-disabled="true">
                  <ChevronLeft size={17} aria-hidden="true" />
                  Previous
                </span>
              )}
              <div className="pagination-pages" aria-label="Page numbers">
                {pageNumbers.map((page) => (
                  <Link
                    className={page === currentPage ? "pagination-page active" : "pagination-page"}
                    href={pageHref(page)}
                    key={page}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </Link>
                ))}
              </div>
              {currentPage < totalPages ? (
                <Link className="pagination-button" href={pageHref(currentPage + 1)} aria-label="Next page">
                  Next
                  <ChevronRight size={17} aria-hidden="true" />
                </Link>
              ) : (
                <span className="pagination-button disabled" aria-disabled="true">
                  Next
                  <ChevronRight size={17} aria-hidden="true" />
                </span>
              )}
            </nav>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
