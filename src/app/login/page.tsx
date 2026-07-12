import { AuthForm } from "@/components/AuthForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function LoginPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Login</p>
          <h1>Welcome back.</h1>
          <p className="lead">Sign in to manage listings, start checkout, and see owner dashboard data.</p>
        </section>
        <AuthForm mode="login" />
      </main>
      <SiteFooter />
    </div>
  );
}
