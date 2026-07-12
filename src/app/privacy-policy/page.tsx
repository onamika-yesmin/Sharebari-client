import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PrivacyPolicyPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Privacy</p>
          <h1>Privacy Policy.</h1>
          <p className="lead">ShareBari stores account, listing, contact, and payment session data only for marketplace operation. Real secrets are never committed and payment secrets remain server-side.</p>
        </section>
        <section className="grid grid-2">
          <div className="card"><h3>Account data</h3><p>Name, email, phone, and location are used for authentication and rental coordination.</p></div>
          <div className="card"><h3>Payment data</h3><p>Stripe Checkout handles payment collection; ShareBari stores session and status metadata.</p></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
