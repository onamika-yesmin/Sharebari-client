import { AddItemForm } from "@/components/AddItemForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function AddItemPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Owner workspace</p>
          <h1>Add a rental item.</h1>
          <p className="lead">Create a clear listing with price, deposit, condition, and photos renters can trust.</p>
        </section>
        <AddItemForm />
      </main>
      <SiteFooter />
    </div>
  );
}
