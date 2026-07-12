import { AuthForm } from "@/components/AuthForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function RegisterPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Register</p>
          <h1>Create your ShareBari account.</h1>
          <p className="lead">Use one account to rent, list, pay, and track marketplace activity.</p>
        </section>
        <AuthForm mode="register" />
      </main>
      <SiteFooter />
    </div>
  );
}
