import { AddItemForm } from "@/components/AddItemForm";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function AddItemPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Owner workspace"
          title="Add a rental item."
          lead="Create a clear listing with price, deposit, condition, and photos renters can trust."
          image="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Tools prepared for a rental listing"
        />
        <AddItemForm />
      </main>
      <SiteFooter />
    </div>
  );
}
