import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PrivacyPolicyPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Privacy"
          title="Privacy Policy."
          lead="ShareBari stores account, listing, contact, and payment session data only for marketplace operation. Real secrets are never committed and payment secrets remain server-side."
          image="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Secure account data on a laptop"
        />
        <section className="grid grid-2">
          <div className="card"><h3>Account data</h3><p>Name, email, phone, and location are used for authentication and rental coordination.</p></div>
          <div className="card"><h3>Payment data</h3><p>Stripe Checkout handles payment collection; ShareBari stores session and status metadata.</p></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
