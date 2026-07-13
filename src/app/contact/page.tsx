"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { showSuccess } from "@/lib/alerts";

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
        <form
          className="panel form-grid"
          onSubmit={async (event) => {
            event.preventDefault();
            await showSuccess("Message received", "Thanks for contacting ShareBari. We will get back to you soon.");
            event.currentTarget.reset();
          }}
        >
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
