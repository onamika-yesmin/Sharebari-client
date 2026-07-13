import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { categories } from "@/lib/data";

export default function CategoriesPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Categories"
          title="Browse by need."
          lead="Each category is shaped around common short-term rental use cases."
          image="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Organized shelves with useful rental items"
        />
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
