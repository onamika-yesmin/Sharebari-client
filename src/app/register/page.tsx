import { AuthForm } from "@/components/AuthForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function RegisterPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="auth-page">
        <section className="auth-copy" aria-labelledby="register-title">
          <p className="eyebrow">Start sharing</p>
          <h1 id="register-title">Build your local rental profile.</h1>
          <p className="lead">Create one account to list items, rent from nearby owners, and manage payments.</p>
          <div className="auth-proof-grid">
            <span>Verified account flow</span>
            <span>Owner dashboard</span>
            <span>Secure checkout</span>
          </div>
        </section>
        <AuthForm mode="register" />
      </main>
      <SiteFooter />
    </div>
  );
}
