import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { categories } from "@/lib/data";

export default function CategoriesPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Categories</p>
          <h1>Browse by need.</h1>
          <p className="lead">Each category is shaped around common short-term rental use cases.</p>
        </section>
        <section className="grid grid-3">
          {categories.map((category) => (
            <Link className="card" href={`/explore?category=${category.id}`} key={category.id}>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </Link>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
