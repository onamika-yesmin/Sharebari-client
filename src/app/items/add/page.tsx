import { AddItemForm } from "@/components/AddItemForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function AddItemPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Protected</p>
          <h1>Add a rental item.</h1>
          <p className="lead">Owner, rating, and featured values are assigned by the server.</p>
        </section>
        <AddItemForm />
      </main>
      <SiteFooter />
    </div>
  );
}
