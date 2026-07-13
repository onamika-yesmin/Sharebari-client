import { AuthForm } from "@/components/AuthForm";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function RegisterPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="auth-page">
        <PageHero
          eyebrow="Start sharing"
          title="Build your local rental profile."
          lead="Create one account to list items, rent from nearby owners, and manage payments."
          image="https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Owner preparing a marketplace account"
        >
          <div className="auth-proof-grid">
            <span>Verified account flow</span>
            <span>Owner dashboard</span>
            <span>Secure checkout</span>
          </div>
        </PageHero>
        <AuthForm mode="register" />
      </main>
      <SiteFooter />
    </div>
  );
}
