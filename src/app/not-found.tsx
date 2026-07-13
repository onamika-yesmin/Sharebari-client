import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="not-found-panel">
          <PageHero
            eyebrow="404"
            title="Page not found."
            lead="The page may have moved, or the rental link may no longer be available. You can return to the marketplace and keep browsing nearby items."
            image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80"
            imageAlt="Packed shelves of useful items"
            actions={
              <>
              <Link className="button" href="/explore">Explore Items</Link>
              <Link className="button-ghost" href="/">Back Home</Link>
              </>
            }
          />
          <div className="not-found-card" aria-hidden="true">
            <strong>404</strong>
            <span>ShareBari</span>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
