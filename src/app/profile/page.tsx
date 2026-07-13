"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { showSuccess } from "@/lib/alerts";

export default function ProfilePage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Protected</p>
          <h1>Your profile.</h1>
        </section>
        <form
          className="panel form-grid"
          onSubmit={async (event) => {
            event.preventDefault();
            await showSuccess("Profile saved", "Your profile changes are ready for backend connection.");
          }}
        >
          <input className="field" defaultValue="ShareBari Demo User" />
          <input className="field" defaultValue="demo@sharebari.com" />
          <input className="field" placeholder="Phone" />
          <input className="field" defaultValue="Khulna" />
          <button className="button" type="submit">Save Profile</button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
