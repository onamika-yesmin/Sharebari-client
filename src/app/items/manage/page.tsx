import { ManageItemsClient } from "@/components/ManageItemsClient";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function ManageItemsPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Protected</p>
          <h1>Manage your listings.</h1>
          <p className="lead">Your account listings load directly from the backend.</p>
        </section>
        <ManageItemsClient />
      </main>
      <SiteFooter />
    </div>
  );
}
