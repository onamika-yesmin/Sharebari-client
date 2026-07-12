import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { categories } from "@/lib/data";

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
        <form className="panel form-grid">
          <input className="field" placeholder="Title" />
          <input className="field" placeholder="Short description" />
          <textarea className="textarea full" placeholder="Full description" />
          <select className="select">
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input className="field" type="number" placeholder="Daily rental price" />
          <input className="field" type="number" placeholder="Security deposit" />
          <input className="field" placeholder="Location" />
          <select className="select"><option>excellent</option><option>like-new</option><option>good</option><option>fair</option></select>
          <select className="select"><option>available</option><option>rented</option><option>unavailable</option></select>
          <input className="field" placeholder="Brand" />
          <input className="field" placeholder="Model" />
          <input className="field" type="number" placeholder="Minimum rental days" />
          <input className="field full" placeholder="Image URL 1" />
          <input className="field full" placeholder="Image URL 2" />
          <input className="field full" placeholder="Image URL 3" />
          <button className="button" type="submit">Save Item</button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
