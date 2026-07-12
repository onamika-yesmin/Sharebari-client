import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function ContactPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Contact</p>
          <h1>Send a message.</h1>
          <p className="lead">Questions about a rental, listing quality, or partnership can start here.</p>
        </section>
        <form className="panel form-grid">
          <input className="field" placeholder="Name" />
          <input className="field" type="email" placeholder="Email" />
          <input className="field full" placeholder="Subject" />
          <textarea className="textarea full" placeholder="Message" />
          <button className="button" type="submit">Submit Message</button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
