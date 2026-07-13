"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { showError, showSuccess } from "@/lib/alerts";
import { apiPost } from "@/lib/api";

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
            const form = new FormData(event.currentTarget);
            try {
              await apiPost("/api/contact", Object.fromEntries(form.entries()));
              await showSuccess("Message received", "Thanks for contacting ShareBari. We will get back to you soon.");
              event.currentTarget.reset();
            } catch (error) {
              await showError("Could not send message", error instanceof Error ? error.message : "Please try again.");
            }
          }}
        >
          <input className="field" name="name" placeholder="Name" required />
          <input className="field" name="email" type="email" placeholder="Email" required />
          <input className="field full" name="subject" placeholder="Subject" required />
          <textarea className="textarea full" name="message" placeholder="Message" required />
          <button className="button" type="submit">Submit Message</button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
