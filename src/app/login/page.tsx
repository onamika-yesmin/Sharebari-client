import { AuthForm } from "@/components/AuthForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function LoginPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="auth-page">
        <section className="auth-copy" aria-labelledby="login-title">
          <p className="eyebrow">Secure access</p>
          <h1 id="login-title">Manage your rentals with confidence.</h1>
          <p className="lead">Sign in to track listings, availability, checkout activity, and owner dashboard data.</p>
          <div className="auth-proof-grid">
            <span>Protected owner tools</span>
            <span>Live listing data</span>
            <span>Checkout ready</span>
          </div>
        </section>
        <AuthForm mode="login" />
      </main>
      <SiteFooter />
    </div>
  );
}
