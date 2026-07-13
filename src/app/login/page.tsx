import { AuthForm } from "@/components/AuthForm";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function LoginPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="auth-page">
        <PageHero
          eyebrow="Secure access"
          title="Manage your rentals with confidence."
          lead="Sign in to track listings, availability, checkout activity, and owner dashboard data."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Secure marketplace dashboard"
        >
          <div className="auth-proof-grid">
            <span>Protected owner tools</span>
            <span>Live listing data</span>
            <span>Checkout ready</span>
          </div>
        </PageHero>
        <AuthForm mode="login" />
      </main>
      <SiteFooter />
    </div>
  );
}
