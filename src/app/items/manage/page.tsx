import { ManageItemsClient } from "@/components/ManageItemsClient";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function ManageItemsPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Owner workspace"
          title="Manage your listings."
          lead="Review availability, pricing, and listing quality for every item connected to your account."
          image="https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Owner reviewing rental listings"
        />
        <ManageItemsClient />
      </main>
      <SiteFooter />
    </div>
  );
}
