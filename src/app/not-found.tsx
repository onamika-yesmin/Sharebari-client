import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="not-found-panel">
          <div>
            <p className="eyebrow">404</p>
            <h1>Page not found.</h1>
            <p className="lead">
              The page may have moved, or the rental link may no longer be available. You can return to the marketplace and keep browsing nearby items.
            </p>
            <div className="action-row">
              <Link className="button" href="/explore">Explore Items</Link>
              <Link className="button-ghost" href="/">Back Home</Link>
            </div>
          </div>
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
