"use client";

import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { showError, showSuccess } from "@/lib/alerts";
import { apiPost } from "@/lib/api";

export default function ContactPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Contact"
          title="Send a message."
          lead="Questions about a rental, listing quality, or partnership can start here."
          image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Person writing a support message on a laptop"
        />
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
